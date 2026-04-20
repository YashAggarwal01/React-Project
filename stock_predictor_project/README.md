# Stock Direction Prediction System (Graduation Project)

This project predicts daily **stock market direction** (up/down) using machine learning.
It includes data retrieval, feature engineering, model training (Logistic Regression, Random Forest, XGBoost),
evaluation, and a simple backtester to see hypothetical trading performance.

## Contents
- `data_fetch.py` - download historical OHLCV data (uses `yfinance`).
- `features.py` - feature engineering (returns, moving averages, RSI, MACD, Bollinger Bands).
- `models.py` - model training, evaluation, and persistence (scikit-learn + xgboost).
- `train.py` - full end-to-end training pipeline (configurable).
- `evaluate.py` - evaluate saved models on a test set and produce metrics/plots.
- `backtest.py` - simple backtest of daily predictions (long-only).
- `utils.py` - helper functions for date handling, saving/loading.
- `requirements.txt` - required packages.
- `config.py` - default configuration.

## How to run
1. Create a Python 3.9+ virtual environment.
2. Install requirements: `pip install -r requirements.txt`
3. Run training: `python train.py`
4. Evaluate: `python evaluate.py`
5. Backtest: `python backtest.py`

## Notes
- This is meant as a complete, runnable baseline for a graduation project. 
- You should tune features, models, and backtesting logic for research/experiments.