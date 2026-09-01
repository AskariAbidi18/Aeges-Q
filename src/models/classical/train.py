from pathlib import Path

import joblib

from src.data.loader import load_testing_data, load_training_data
from src.data.preprocessing import (
    build_variant_e_preprocessor,
    split_features_target,
)
from src.data.validation import validate_dataframe
from src.models.classical.random_forest import build_random_forest


PROJECT_ROOT = Path(__file__).resolve().parents[3]
ARTIFACT_DIR = PROJECT_ROOT / "artifacts" / "classical"


def train_final_model():
    """
    Train the final AEGES-Q classical Random Forest pipeline.

    The pipeline uses:
    - Variant E preprocessing
    - Baseline Random Forest configuration
    """

    # Load data
    train_df = load_training_data()
    test_df = load_testing_data()

    # Validate raw datasets
    validate_dataframe(train_df)
    validate_dataframe(test_df)

    # Separate features and target
    X_train, y_train = split_features_target(train_df)
    X_test, y_test = split_features_target(test_df)

    # Build Variant E preprocessor
    preprocessor = build_variant_e_preprocessor()

    # Fit preprocessing ONLY on training data
    X_train_transformed = preprocessor.fit_transform(X_train)

    # Apply the fitted preprocessing to test data
    X_test_transformed = preprocessor.transform(X_test)

    # Build final Random Forest
    model = build_random_forest()

    # Train model
    model.fit(X_train_transformed, y_train)

    # Create artifact directory
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

    # Save preprocessing and model separately
    preprocessor_path = ARTIFACT_DIR / "variant_e_preprocessor.joblib"
    model_path = ARTIFACT_DIR / "random_forest.joblib"

    joblib.dump(preprocessor, preprocessor_path)
    joblib.dump(model, model_path)

    print("Training completed successfully.")
    print(f"Training shape: {X_train_transformed.shape}")
    print(f"Testing shape:  {X_test_transformed.shape}")
    print(f"Preprocessor saved to: {preprocessor_path}")
    print(f"Model saved to:        {model_path}")

    return {
        "model": model,
        "preprocessor": preprocessor,
        "X_test": X_test_transformed,
        "y_test": y_test,
    }


if __name__ == "__main__":
    train_final_model()
    