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


def run_lstm_forecast(tickers: list, shares: list, projection_days: int = 21):
    print(f"\n--- CHECKPOINT 1: LOADING MODEL ---")
    if not os.path.exists(MODEL_PATH):
        raise Exception("Model file not found. Run train_model.py first.")

    model = load_model(MODEL_PATH, custom_objects={'AttentionLayer': AttentionLayer})

    print(f"--- CHECKPOINT 2: FETCHING TICKER DATA ({tickers}) ---")
    ticker_forecasts = []
    ticker_weights = []
    overall_accuracy_scores = []

    for ticker, share_count in zip(tickers, shares):
        df = fetch_ticker_data(ticker)
        if df.empty or len(df) < SEQ + HOLDOUT + 10:
            print(f"  Skipping {ticker} — not enough data")
            continue

        current_price = float(df['Close'].iloc[-1])
        portfolio_value = current_price * float(share_count)

        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled = scaler.fit_transform(df.values)
        c_min, c_max = scaler.data_min_[0], scaler.data_max_[0]

        # Fine-tune on this ticker's data (excluding holdout)
        X_tune, y_tune = [], []
        for i in range(SEQ, len(scaled) - HOLDOUT):
            X_tune.append(scaled[i - SEQ:i])
            y_tune.append(scaled[i, 0])

        if len(X_tune) > 0:
            model.fit(np.array(X_tune), np.array(y_tune),
                      epochs=10, batch_size=32, verbose=0)

        # Accuracy on holdout
        print(f"  {ticker} accuracy:")
        acc = compute_accuracy(model, scaled, scaler)
        overall_accuracy_scores.append(acc)

        # Fine-tune on ALL data now for best predictions
        X_all, y_all = [], []
        for i in range(SEQ, len(scaled)):
            X_all.append(scaled[i - SEQ:i])
            y_all.append(scaled[i, 0])
        model.fit(np.array(X_all), np.array(y_all),
                  epochs=5, batch_size=32, verbose=0)

        # Predict future prices autoregressively
        window = list(scaled[-SEQ:])
        future_prices = []
        for _ in range(projection_days):
            inp = np.array(window[-SEQ:])
            pred_scaled = model(inp[np.newaxis, :, :], training=False).numpy()[0, 0]
            pred_price = _safe(pred_scaled * (c_max - c_min) + c_min)
            future_prices.append(pred_price)

            # Build next row: update Close, recalculate SMA/RSI simply
            next_row = window[-1].copy()
            next_row[0] = pred_scaled
            window.append(next_row)

        ticker_forecasts.append({
            'ticker': ticker,
            'shares': float(share_count),
            'current_price': current_price,
            'future_prices': future_prices,
            'portfolio_value': portfolio_value
        })
        ticker_weights.append(portfolio_value)

    if not ticker_forecasts:
        raise Exception("No tickers had sufficient data for forecasting.")

    print(f"--- CHECKPOINT 3: BUILDING PORTFOLIO FORECAST ---")
    total_weight = sum(ticker_weights)
    base_path = np.zeros(projection_days)

    for t_data, weight in zip(ticker_forecasts, ticker_weights):
        w = weight / total_weight
        normalized = np.array(t_data['future_prices']) / t_data['current_price']
        current_total = sum(
            tf['current_price'] * tf['shares'] for tf in ticker_forecasts
        )
        base_path += w * normalized * current_total

    # Bull/bear bands: ±1.5 std of historical daily returns scaled to projection
    std_factors = []
    for t_data in ticker_forecasts:
        df_temp = fetch_ticker_data(t_data['ticker'], lookback_days=252)
        if not df_temp.empty:
            daily_ret_std = float(df_temp['Close'].pct_change().std())
            std_factors.append(daily_ret_std)
    avg_std = np.mean(std_factors) if std_factors else 0.01
    period_std = avg_std * np.sqrt(np.arange(1, projection_days + 1))

    current_total_value = sum(t['current_price'] * t['shares'] for t in ticker_forecasts)
    bull_path = base_path * (1 + 1.5 * period_std)
    bear_path = base_path * (1 - 1.5 * period_std)

    overall_accuracy = round(float(np.mean(overall_accuracy_scores)), 1) if overall_accuracy_scores else None
    print(f"Overall accuracy: {overall_accuracy}%")
    print(f"Simulation complete.")

    return base_path, bull_path, bear_path, current_total_value, overall_accuracy
