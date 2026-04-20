"""Simple backtesting script that uses model predictions as daily signals.

Strategy:
- If model predicts '1' for next-day up, take a long position at next day's open, close at close (day trading simplistic).
- This is a toy backtest for educational purposes only.
"""
import os
import pandas as pd
from utils import load_model, load_df
from config import TICKER, DATA_DIR, MODEL_DIR, TEST_SIZE
from features import compute_features
from train import time_series_train_test_split

def backtest_model(model, df_feat):
    df = df_feat.copy()
    # Generate features (X) for prediction aligned so that prediction for day t is for next-day direction
    X = df.drop(columns=['target'])
    preds = model.predict(X)
    df['pred'] = preds
    # We will assume entry at next-day Open if pred==1, exit at next-day Close
    # shift pred forward by 1 so today's pred indicates action for next day
    df['signal_next'] = df['pred'].shift(0)  # model already predicted next-day direction
    # For each day where signal_next == 1, we compute return from Open to Close of the next day
    # Align by shifting price columns (we used indicators computed on day t which predicted t+1)
    df['next_open'] = df['Open'].shift(-1)
    df['next_close'] = df['Close'].shift(-1)
    # Mask for valid trades
    trades = df.dropna(subset=['next_open','next_close','signal_next']).copy()
    trades['strategy_ret'] = 0.0
    mask = trades['signal_next'] == 1
    # Return if long: (next_close - next_open) / next_open
    trades.loc[mask, 'strategy_ret'] = (trades.loc[mask, 'next_close'] - trades.loc[mask, 'next_open']) / trades.loc[mask, 'next_open']
    trades['buy_and_hold_ret'] = (trades['next_close'] - trades['Open']) / trades['Open']  # next_close vs today's open baseline
    trades['cum_strategy'] = (1 + trades['strategy_ret']).cumprod()
    trades['cum_bh'] = (1 + trades['buy_and_hold_ret']).cumprod()
    return trades

def main():
    raw_path = f"{DATA_DIR}/{TICKER}.csv"
    if not os.path.exists(raw_path):
        print("Raw data not found. Run data_fetch.py first.")
        return
    df = load_df(raw_path)
    df_feat = compute_features(df)
    _, test_df = time_series_train_test_split(df_feat, test_size=TEST_SIZE)
    # choose model file
    model_path = f"{MODEL_DIR}/xgboost.joblib"
    if not os.path.exists(model_path):
        print("Model not found. Run train.py to create models.")
        return
    model = load_model(model_path)
    trades = backtest_model(model, test_df)
    # Simple performance summary
    strat_ret = trades['strategy_ret'].fillna(0)
    bh_ret = trades['buy_and_hold_ret'].fillna(0)
    print(f"Strategy cumulative return: {trades['cum_strategy'].iloc[-1]:.4f}")
    print(f"Buy & hold cumulative return: {trades['cum_bh'].iloc[-1]:.4f}")
    # Save trades for inspection
    trades.to_csv(f"backtest_results_{TICKER}.csv")
    print("Saved backtest_results_<TICKER>.csv in current folder.")

if __name__ == '__main__':
    main()