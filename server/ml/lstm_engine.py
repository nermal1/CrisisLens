import numpy as np
import pandas as pd
import os
import math
import yfinance as yf
import datetime
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model

from .train_model import AttentionLayer, add_indicators, FEATURES

MODEL_PATH = os.path.join(os.path.dirname(__file__), "portfolio_lstm.keras")
SEQ = 60
HOLDOUT = 21  # ~1 trading month held out for accuracy testing


def _safe(val: float) -> float:
    f = float(val)
    return 0.0 if (math.isnan(f) or math.isinf(f)) else round(f, 4)


def fetch_ticker_data(ticker: str, lookback_days: int = 500) -> pd.DataFrame:
    end = datetime.date.today()
    start = end - datetime.timedelta(days=lookback_days)
    df = yf.download(ticker, start=start, end=end, progress=False, auto_adjust=True)
    if df.empty:
        return pd.DataFrame()
    
    # Flatten MultiIndex columns that newer yfinance versions return for single tickers
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    
    df = add_indicators(df)
    return df[FEATURES].dropna()



def compute_accuracy(model, scaled: np.ndarray, scaler: MinMaxScaler) -> float:
    """
    Price-closeness accuracy on held-out last HOLDOUT days.
    Formula: 100 - (MAE / mean_actual_price * 100)
    Same metric used in standard academic LSTM stock papers.
    """
    if len(scaled) < SEQ + HOLDOUT:
        return 0.0

    c_min, c_max = scaler.data_min_[0], scaler.data_max_[0]
    actuals, predictions = [], []

    for i in range(HOLDOUT):
        end_idx = len(scaled) - HOLDOUT + i
        window = scaled[end_idx - SEQ:end_idx]
        pred_scaled = model(window[np.newaxis, :, :], training=False).numpy()[0, 0]
        pred_price = pred_scaled * (c_max - c_min) + c_min
        actual_price = scaled[end_idx, 0] * (c_max - c_min) + c_min
        predictions.append(_safe(pred_price))
        actuals.append(_safe(actual_price))

    actuals = np.array(actuals)
    predictions = np.array(predictions)
    mae = np.mean(np.abs(actuals - predictions))
    mean_price = np.mean(actuals)
    accuracy = 100 - (mae / mean_price * 100)
    print(f"  MAE: ${mae:.2f} | Mean actual price: ${mean_price:.2f} | Accuracy: {accuracy:.1f}%")
    return round(max(0.0, min(100.0, accuracy)), 1)


import json
import numpy as np
import pandas as pd
import os
import math
import yfinance as yf
import datetime
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model

from .train_model import AttentionLayer, add_indicators, FEATURES

MODEL_PATH = os.path.join(os.path.dirname(__file__), "portfolio_lstm.keras")
SEQ = 60
HOLDOUT = 21  # ~1 trading month held out for accuracy testing
MC_RUNS = 100 # Number of Monte Carlo parallel universes


def _safe(val: float) -> float:
    f = float(val)
    return 0.0 if (math.isnan(f) or math.isinf(f)) else round(f, 4)


def compute_accuracy(model, scaled: np.ndarray, scaler: MinMaxScaler, actual_prices: np.ndarray) -> float:
    """
    Since we predict Returns now, we calculate accuracy by applying the predicted return 
    to the previous day's actual price, comparing it to the real price.
    """
    if len(scaled) < SEQ + HOLDOUT:
        return 0.0

    c_min, c_max = scaler.data_min_[0], scaler.data_max_[0]
    actual_holdout_prices = actual_prices[-HOLDOUT:]
    predicted_prices = []

    for i in range(HOLDOUT):
        end_idx = len(scaled) - HOLDOUT + i
        window = scaled[end_idx - SEQ:end_idx]
        
        # Predict the RETURN
        pred_scaled_return = model(window[np.newaxis, :, :], training=False).numpy()[0, 0]
        pred_return = pred_scaled_return * (c_max - c_min) + c_min
        
        # Reconstruct PRICE: Previous Day's Actual Price * (1 + Predicted Return)
        prev_price = actual_prices[end_idx - 1]
        pred_price = prev_price * (1 + pred_return)
        predicted_prices.append(pred_price)

    actuals = np.array(actual_holdout_prices)
    predictions = np.array(predicted_prices)
    
    mae = np.mean(np.abs(actuals - predictions))
    mean_price = np.mean(actuals)
    accuracy = 100 - (mae / mean_price * 100)
    
    return round(max(0.0, min(100.0, accuracy)), 1)


def run_lstm_forecast(tickers: list, shares: list, projection_days: int = 21):
    yield json.dumps({"type": "progress", "message": "LOADING AI MODEL..."}) + "\n"
    
    if not os.path.exists(MODEL_PATH):
        yield json.dumps({"type": "error", "message": "Model file not found. Run train_model.py first."}) + "\n"
        return

    model = load_model(MODEL_PATH, custom_objects={'AttentionLayer': AttentionLayer})

    yield json.dumps({"type": "progress", "message": f"FETCHING TICKER DATA ({', '.join(tickers)})..."}) + "\n"
    
    ticker_forecasts = []
    ticker_weights = []
    overall_accuracy_scores = []

    for ticker, share_count in zip(tickers, shares):
        # 1. Fetch raw data
        end = datetime.date.today()
        start = end - datetime.timedelta(days=500)
        df_raw = yf.download(ticker, start=start, end=end, progress=False, auto_adjust=True)
        
        if df_raw.empty:
            yield json.dumps({"type": "progress", "message": f"Skipping {ticker} — no data found"}) + "\n"
            continue
            
        if isinstance(df_raw.columns, pd.MultiIndex):
            df_raw.columns = df_raw.columns.get_level_values(0)

        # 2. Build Returns and Indicators
        df_raw['Returns'] = df_raw['Close'].pct_change().fillna(0)
        df_features = add_indicators(df_raw)
        df_model = df_features[FEATURES].dropna()

        if len(df_model) < SEQ + HOLDOUT + 10:
            yield json.dumps({"type": "progress", "message": f"Skipping {ticker} — insufficient history"}) + "\n"
            continue

        actual_prices = df_raw['Close'].values[-len(df_model):]
        current_price = actual_prices[-1]
        portfolio_value = current_price * float(share_count)

        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled = scaler.fit_transform(df_model.values)
        c_min, c_max = scaler.data_min_[0], scaler.data_max_[0]

        yield json.dumps({"type": "progress", "message": f"Fine-tuning model on {ticker} genetics..."}) + "\n"

        # 3. Fine-tune on this ticker's data (excluding holdout)
        X_tune, y_tune = [], []
        for i in range(SEQ, len(scaled) - HOLDOUT):
            X_tune.append(scaled[i - SEQ:i])
            y_tune.append(scaled[i, 0])

        if len(X_tune) > 0:
            model.fit(np.array(X_tune), np.array(y_tune), epochs=5, batch_size=32, verbose=0)

        # 4. Accuracy on holdout
        acc = compute_accuracy(model, scaled, scaler, actual_prices)
        overall_accuracy_scores.append(acc)
        yield json.dumps({"type": "progress", "message": f"{ticker} Verification: {acc}% accuracy"}) + "\n"

        # 5. Final fine-tune on all recent data
        X_all, y_all = [], []
        for i in range(SEQ, len(scaled)):
            X_all.append(scaled[i - SEQ:i])
            y_all.append(scaled[i, 0])
        model.fit(np.array(X_all), np.array(y_all), epochs=3, batch_size=32, verbose=0)

        yield json.dumps({"type": "progress", "message": f"Running Monte Carlo Simulation ({MC_RUNS} paths) for {ticker}..."}) + "\n"

        # 6. MONTE CARLO DROPOUT PREDICTION
        # Initialize 100 identical parallel universes
        window = scaled[-SEQ:]
        mc_windows = np.repeat(window[np.newaxis, :, :], MC_RUNS, axis=0) # Shape: (100, 60, features)
        mc_future_returns = []

        for _ in range(projection_days):
            # training=True keeps Dropout active, injecting realistic variance!
            preds_scaled = model(mc_windows, training=True).numpy()[:, 0]
            preds_returns = preds_scaled * (c_max - c_min) + c_min
            mc_future_returns.append(preds_returns)

            # Roll windows forward
            next_rows = mc_windows[:, -1, :].copy()
            next_rows[:, 0] = preds_scaled
            mc_windows = np.concatenate([mc_windows[:, 1:, :], next_rows[:, np.newaxis, :]], axis=1)

        # Convert returns shape to (100 paths, projection_days)
        mc_future_returns = np.array(mc_future_returns).T 
        
        # Compound the returns into absolute price paths
        mc_price_paths = current_price * np.cumprod(1 + mc_future_returns, axis=1) 

        ticker_forecasts.append({
            'ticker': ticker,
            'shares': float(share_count),
            'current_price': current_price,
            'mc_price_paths': mc_price_paths,
            'portfolio_value': portfolio_value
        })
        ticker_weights.append(portfolio_value)

    if not ticker_forecasts:
        yield json.dumps({"type": "error", "message": "No tickers had sufficient data."}) + "\n"
        return

    yield json.dumps({"type": "progress", "message": "AGGREGATING PORTFOLIO UNIVERSES..."}) + "\n"
    
    current_total_value = sum(tf['portfolio_value'] for tf in ticker_forecasts)
    
    # Initialize aggregated portfolio paths (100 universes, N days)
    portfolio_mc_paths = np.zeros((MC_RUNS, projection_days))
    
    for t_data in ticker_forecasts:
        # Convert raw prices to monetary value by multiplying by share count
        ticker_monetary_paths = t_data['mc_price_paths'] * t_data['shares']
        portfolio_mc_paths += ticker_monetary_paths

    # 7. EXTRACT PROBABILISTIC BANDS
    # Instead of guessing standard deviations, we just take the percentiles of the 100 simulations
    base_path = np.mean(portfolio_mc_paths, axis=0)
    bull_path = np.percentile(portfolio_mc_paths, 90, axis=0) # 90th percentile (Optimistic)
    bear_path = np.percentile(portfolio_mc_paths, 10, axis=0) # 10th percentile (Pessimistic)

    overall_accuracy = round(float(np.mean(overall_accuracy_scores)), 1) if overall_accuracy_scores else 0.0
    
    yield json.dumps({"type": "progress", "message": f"Simulation complete. (Accuracy: {overall_accuracy}%)"}) + "\n"

    # Send final payload to React
    yield json.dumps({
        "type": "result", 
        "base_path": base_path.tolist(), 
        "bull_path": bull_path.tolist(), 
        "bear_path": bear_path.tolist(), 
        "current_total_value": current_total_value, 
        "overall_accuracy": overall_accuracy
    }) + "\n"
