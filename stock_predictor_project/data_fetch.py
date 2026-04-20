"""Download historical OHLCV data for a ticker using yfinance.

Outputs a CSV in data/<TICKER>.csv
"""
import yfinance as yf
import pandas as pd
from config import TICKER, START_DATE, END_DATE, DATA_DIR
from utils import ensure_dir, save_df

def fetch_price_data(ticker: str = TICKER, start=START_DATE, end=END_DATE):
    print(f"Downloading {ticker} from {start} to {end}...")
    data = yf.download(ticker, start=start, end=end, progress=False, auto_adjust=False)
    if data.empty:
        raise RuntimeError("No data downloaded - check ticker and internet connection.")
    # keep standard column names
    data.index = pd.to_datetime(data.index)
    ensure_dir(DATA_DIR)
    path = f"{DATA_DIR}/{ticker}.csv"
    save_df(data, path)
    print(f"Saved raw data to {path}")
    return data

if __name__ == '__main__':
    fetch_price_data()