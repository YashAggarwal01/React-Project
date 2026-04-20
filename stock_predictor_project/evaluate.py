"""Load saved models and evaluate on test set, produce simple plots."""
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from utils import load_model, load_df
from config import TICKER, DATA_DIR, MODEL_DIR, TEST_SIZE
from features import compute_features
from train import time_series_train_test_split
from models import evaluate_model

def plot_confusion_matrix(cm, title='Confusion Matrix'):
    import numpy as np
    cm = np.array(cm)
    plt.figure(figsize=(4,3))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title(title)
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.tight_layout()

def main():
    raw_path = f"{DATA_DIR}/{TICKER}.csv"
    if not os.path.exists(raw_path):
        print("Raw data not found. Run data_fetch.py first.")
        return
    df = load_df(raw_path)
    df_feat = compute_features(df)
    train_df, test_df = time_series_train_test_split(df_feat, test_size=TEST_SIZE)
    X_test = test_df.drop(columns=['target'])
    y_test = test_df['target']
    models = {}
    for fname in ['logistic', 'random_forest', 'xgboost']:
        path = f"{MODEL_DIR}/{fname}.joblib"
        if not os.path.exists(path):
            print(f"Model not found: {path}")
            continue
        models[fname] = load_model(path)
    for name, model in models.items():
        metrics, preds = evaluate_model(model, X_test, y_test)
        print(f"== {name} ==")
        print(metrics)
        plot_confusion_matrix(metrics['confusion_matrix'], title=f"{name} confusion matrix")
        plt.show()

if __name__ == '__main__':
    main()