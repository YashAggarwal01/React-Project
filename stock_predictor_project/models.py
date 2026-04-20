"""Model definitions, training and evaluation functions."""
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix, classification_report, roc_auc_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import xgboost as xgb
import numpy as np

def build_logistic(random_state=42):
    pipe = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', LogisticRegression(random_state=random_state, max_iter=1000))
    ])
    return pipe

def build_random_forest(random_state=42, n_estimators=200):
    rf = RandomForestClassifier(n_estimators=n_estimators, random_state=random_state, n_jobs=-1)
    return rf

def build_xgboost(random_state=42, n_estimators=200):
    clf = xgb.XGBClassifier(n_estimators=n_estimators, use_label_encoder=False, eval_metric='logloss', random_state=random_state)
    return clf

def evaluate_model(clf, X, y):
    preds = clf.predict(X)
    probs = None
    try:
        probs = clf.predict_proba(X)[:,1]
    except:
        try:
            probs = clf.decision_function(X)
        except:
            probs = None
    metrics = {
        'accuracy': float(accuracy_score(y, preds)),
        'f1': float(f1_score(y, preds)),
        'confusion_matrix': confusion_matrix(y, preds).tolist(),
    }
    if probs is not None:
        try:
            metrics['roc_auc'] = float(roc_auc_score(y, probs))
        except:
            metrics['roc_auc'] = None
    return metrics, preds