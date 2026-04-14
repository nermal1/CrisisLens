import numpy as np
import pandas as pd
import os
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Bidirectional, Layer, Input
from tensorflow.keras.saving import register_keras_serializable

@register_keras_serializable()
class AttentionLayer(Layer):
    def __init__(self, **kwargs):
        super(AttentionLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        self.W = self.add_weight(name="att_weight", shape=(input_shape[-1], 1), initializer="normal")
        self.b = self.add_weight(name="att_bias", shape=(input_shape[1], 1), initializer="zeros")
        super(AttentionLayer, self).build(input_shape)

    def call(self, x):
        e = tf.nn.tanh(tf.matmul(x, self.W) + self.b)
        a = tf.nn.softmax(e, axis=1)
        output = x * a
        return tf.reduce_sum(output, axis=1)

    def get_config(self):
        return super(AttentionLayer, self).get_config()


# Features used — Close is the target (index 0)
FEATURES = ['Close', 'SMA_20', 'SMA_50', 'RSI']

def add_indicators(df: pd.DataFrame) -> pd.DataFrame:
    close = df['Close'].squeeze()
    df['SMA_20'] = close.rolling(20).mean()
    df['SMA_50'] = close.rolling(50).mean()
    delta = close.diff()
    gain = delta.where(delta > 0, 0).rolling(14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
    df['RSI'] = 100 - (100 / (1 + gain / loss))
    return df.dropna()


def pretrain_base_model():
    print("--- BUILDING BASE MODEL (SPY 10yr) ---")
    spy_df = yf.download("SPY", period="10y", progress=False, auto_adjust=True)
    spy_df = add_indicators(spy_df)
    data = spy_df[FEATURES].values

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled = scaler.fit_transform(data)

    SEQ = 60
    X, y = [], []
    for i in range(SEQ, len(scaled)):
        X.append(scaled[i - SEQ:i])
        y.append(scaled[i, 0])  # Predict next Close (index 0)

    X, y = np.array(X), np.array(y)
    print(f"Training samples: {len(X)}")

    model = Sequential([
        Input(shape=(SEQ, len(FEATURES))),
        Bidirectional(LSTM(128, return_sequences=True)),
        Dropout(0.2),
        LSTM(64, return_sequences=True),
        AttentionLayer(),
        Dense(32, activation='relu'),
        Dropout(0.2),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')

    print("Training...")
    model.fit(X, y, batch_size=64, epochs=20, validation_split=0.1, verbose=1)

    path = os.path.join(os.path.dirname(__file__), "portfolio_lstm.keras")
    model.save(path)
    print(f"Model saved to {path}")


if __name__ == "__main__":
    pretrain_base_model()
