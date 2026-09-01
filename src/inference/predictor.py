from pathlib import Path
from typing import Any

import joblib
import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_DIR = PROJECT_ROOT / "artifacts" / "classical"


class AegesPredictor:
    """
    Production inference interface for the AEGES-Q
    classical machine-learning model.
    """

    def __init__(
        self,
        preprocessor_path: Path | None = None,
        model_path: Path | None = None,
    ):
        self.preprocessor_path = (
            preprocessor_path
            or ARTIFACT_DIR / "variant_e_preprocessor.joblib"
        )

        self.model_path = (
            model_path
            or ARTIFACT_DIR / "random_forest.joblib"
        )

        if not self.preprocessor_path.exists():
            raise FileNotFoundError(
                f"Preprocessor artifact not found: "
                f"{self.preprocessor_path}"
            )

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Model artifact not found: {self.model_path}"
            )

        self.preprocessor = joblib.load(self.preprocessor_path)
        self.model = joblib.load(self.model_path)

    def predict(self, data: pd.DataFrame) -> dict[str, Any]:
        """
        Generate a binary prediction for one or more
        network-flow records.
        """

        if not isinstance(data, pd.DataFrame):
            raise TypeError("Input must be a pandas DataFrame.")

        if data.empty:
            raise ValueError("Input DataFrame is empty.")

        # Apply the already-fitted Variant E preprocessing.
        transformed_data = self.preprocessor.transform(data)

        predictions = self.model.predict(transformed_data)
        probabilities = self.model.predict_proba(transformed_data)[:, 1]

        return {
            "predictions": predictions.tolist(),
            "attack_probabilities": probabilities.tolist(),
        }
    