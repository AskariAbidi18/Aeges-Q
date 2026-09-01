from pathlib import Path

import joblib
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)

from src.data.loader import load_testing_data
from src.data.preprocessing import split_features_target


PROJECT_ROOT = Path(__file__).resolve().parents[3]
ARTIFACT_DIR = PROJECT_ROOT / "artifacts" / "classical"


def evaluate_final_model() -> dict[str, float]:
    """
    Evaluate the saved final Random Forest on the held-out
    UNSW-NB15 testing dataset.
    """

    preprocessor_path = ARTIFACT_DIR / "variant_e_preprocessor.joblib"
    model_path = ARTIFACT_DIR / "random_forest.joblib"

    if not preprocessor_path.exists():
        raise FileNotFoundError(
            f"Preprocessor artifact not found: {preprocessor_path}"
        )

    if not model_path.exists():
        raise FileNotFoundError(
            f"Model artifact not found: {model_path}"
        )

    # Load saved artifacts
    preprocessor = joblib.load(preprocessor_path)
    model = joblib.load(model_path)

    # Load held-out test data
    test_df = load_testing_data()

    X_test, y_test = split_features_target(test_df)

    # Transform using the already-fitted training preprocessor
    X_test_transformed = preprocessor.transform(X_test)

    # Generate predictions
    y_pred = model.predict(X_test_transformed)
    y_prob = model.predict_proba(X_test_transformed)[:, 1]

    # Calculate metrics
    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred),
        "recall": recall_score(y_test, y_pred),
        "f1_score": f1_score(y_test, y_pred),
        "roc_auc": roc_auc_score(y_test, y_prob),
    }

    print("Final Random Forest Evaluation")
    print("-" * 40)

    for metric, value in metrics.items():
        print(f"{metric}: {value:.4f}")

    return metrics


if __name__ == "__main__":
    evaluate_final_model()
    