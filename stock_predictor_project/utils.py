import os, joblib
import pandas as pd

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path, exist_ok=True)

def save_model(model, path):
    ensure_dir(os.path.dirname(path))
    joblib.dump(model, path)

def load_model(path):
    return joblib.load(path)

def save_df(df, path):
    ensure_dir(os.path.dirname(path))
    df.to_csv(path, index=True)

def load_df(path):
    return pd.read_csv(path, index_col=0, parse_dates=True)