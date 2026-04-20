"""Feature engineering: technical indicators and labels.

Produces features dataframe with label 'target' indicating next-day direction:
1 -> price up (next close > close), 0 -> down or equal.
"""
import pandas as pd
import numpy as np

def compute_features(df: pd.DataFrame, window: int = 14) -> pd.DataFrame:
    # Convert all relevant columns to numeric
    for col in ['Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    # Drop rows with missing or invalid data
    df = df.dropna()

    # Now compute features
    df['return'] = df['Close'].pct_change()
    df['vol_mean_10'] = df['Volume'].rolling(10).mean()
    df['vol_std_10'] = df['Volume'].rolling(10).std()
    ...

    df = df.copy()
    # Basic returns
    df['Close'] = pd.to_numeric(df['Close'], errors='coerce')

    df['return'] = df['Close'].pct_change()
    df['log_return'] = np.log(df['Close'] / df['Close'].shift(1))
    # Moving averages
    df['ma5'] = df['Close'].rolling(5).mean()
    df['ma10'] = df['Close'].rolling(10).mean()
    df['ma20'] = df['Close'].rolling(20).mean()
    df['ema12'] = df['Close'].ewm(span=12, adjust=False).mean()
    df['ema26'] = df['Close'].ewm(span=26, adjust=False).mean()
    df['macd'] = df['ema12'] - df['ema26']
    # Volatility and momentum
    df['volatility_10'] = df['return'].rolling(10).std()
    df['volatility_20'] = df['return'].rolling(20).std()
    # RSI
    delta = df['Close'].diff()
    up = delta.clip(lower=0)
    down = -1 * delta.clip(upper=0)
    ma_up = up.ewm(com=window-1, adjust=False).mean()
    ma_down = down.ewm(com=window-1, adjust=False).mean()
    rs = ma_up / (ma_down + 1e-9)
    df['rsi'] = 100 - (100 / (1 + rs))
    # Bollinger Bands
    df['bb_mid'] = df['Close'].rolling(window).mean()
    df['bb_std'] = df['Close'].rolling(window).std()
    df['bb_upper'] = df['bb_mid'] + 2 * df['bb_std']
    df['bb_lower'] = df['bb_mid'] - 2 * df['bb_std']
    # Volume-based features
    df['vol_mean_10'] = df['Volume'].rolling(10).mean()
    df['vol_ratio'] = df['Volume'] / (df['vol_mean_10'] + 1e-9)
    # Lag features
    for lag in range(1, 6):
        df[f'lag_close_{lag}'] = df['Close'].shift(lag)
        df[f'lag_return_{lag}'] = df['return'].shift(lag)
    # Label: next day direction (1 if next close > today's close)
    df['target'] = (df['Close'].shift(-1) > df['Close']).astype(int)
    # Drop rows with NaNs that resulted from indicators
    df = df.dropna().copy()
    return df

if __name__ == '__main__':
    import pandas as pd
    # quick smoke test
    s = pd.Series([1,2,3,4,5,6,7,8,9,10], name='Close')
    df = pd.DataFrame({'Close': s*10, 'Volume': [100]*10, 'Open': s, 'High': s, 'Low': s})
    feat = compute_features(df)
    print(feat.columns.tolist())