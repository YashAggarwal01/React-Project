"""End-to-end training script.

Steps:
- Load raw data (run data_fetch.py first or ensure data/Csv exists)
- Create features and labels
- Split time-wise into train/test
- Train three models and save them
"""
import os
import pandas as pd
from datetime import datetime
from config import TICKER, DATA_DIR, MODEL_DIR, TEST_SIZE, RANDOM_STATE
from features import compute_features
from models import build_logistic, build_random_forest, build_xgboost, evaluate_model
from utils import save_df, save_model, ensure_dir, load_df
from sklearn.model_selection import train_test_split

def time_series_train_test_split(df, test_size=0.2):
    # time-based split: last test_size proportion of data used for testing
    n = len(df)
    split = int(n * (1 - test_size))
    train = df.iloc[:split]
    test = df.iloc[split:]
    return train, test

def main():
    ensure_dir(MODEL_DIR)
    raw_path = f"{DATA_DIR}/{TICKER}.csv"
    if not os.path.exists(raw_path):
        print("Raw data not found. Please run data_fetch.py to download price data first.")
        return
    df = load_df(raw_path)
    df_feat = compute_features(df)
    # Keep only feature columns and target
    X = df_feat.drop(columns=['target'])
    y = df_feat['target']
    train_df, test_df = time_series_train_test_split(df_feat, test_size=TEST_SIZE)
    X_train = train_df.drop(columns=['target'])
    y_train = train_df['target']
    X_test = test_df.drop(columns=['target'])
    y_test = test_df['target']
    print(f"Training samples: {len(X_train)}, Testing samples: {len(X_test)}")
    # Models
    log = build_logistic(random_state=RANDOM_STATE)
    rf = build_random_forest(random_state=RANDOM_STATE)
    xgb = build_xgboost(random_state=RANDOM_STATE)
    # Fit models
    print("Training Logistic Regression...")
    log.fit(X_train, y_train)
    print("Training Random Forest...")
    rf.fit(X_train, y_train)
    print("Training XGBoost...")
    xgb.fit(X_train, y_train)
    # Evaluate and save
    for name, model in [('logistic', log), ('random_forest', rf), ('xgboost', xgb)]:
        metrics, preds = evaluate_model(model, X_test, y_test)
        print(f"Model: {name} -> accuracy={metrics['accuracy']:.4f}, f1={metrics['f1']:.4f}, roc_auc={metrics.get('roc_auc')}")
        save_model(model, f"{MODEL_DIR}/{name}.joblib")
    # Save processed dataset for reproducibility
    save_df(df_feat, f"{DATA_DIR}/{TICKER}_features.csv")
    print("Training complete. Models saved in models/ and features saved in data/.")

if __name__ == '__main__':
    main()