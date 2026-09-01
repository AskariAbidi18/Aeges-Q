from src.data.loader import load_training_data
from src.data.preprocessing import (
    build_variant_e_preprocessor,
    prepare_features,
)


def test_variant_e_matches_training_feature_space():
    df = load_training_data()

    X = prepare_features(df)

    preprocessor = build_variant_e_preprocessor()

    X_transformed = preprocessor.fit_transform(X)

    assert X_transformed.shape == (82332, 177)
    