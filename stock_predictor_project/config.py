# Configuration for the stock prediction project
TICKER = "TSLA"
START_DATE = "2015-01-01"
END_DATE = "2024-12-31"
MODEL_DIR = "models"
DATA_DIR = "data"
RANDOM_STATE = 42
TEST_SIZE = 0.2   # proportion for test split (time-based split used later)
FEATURE_WINDOW = 14