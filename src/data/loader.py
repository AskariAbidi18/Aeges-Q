from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DATA_DIR = PROJECT_ROOT / "data" / "raw"

def load_training_data() -> pd.DataFrame:
    """
    Load the UNSW-NB15 training dataset.
    """
    path = RAW_DATA_DIR / "UNSW_NB15_training-set.csv"

    if not path.exists():
        raise FileNotFoundError(f"Training dataset not found: {path}")

    return pd.read_csv(path)


def load_testing_data() -> pd.DataFrame:
    """
    Load the UNSW-NB15 testing dataset.
    """
    path = RAW_DATA_DIR / "UNSW_NB15_testing-set.csv"

    if not path.exists():
        raise FileNotFoundError(f"Testing dataset not found: {path}")

    return pd.read_csv(path)
