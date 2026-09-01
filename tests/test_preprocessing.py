import pandas as pd

from src.data.preprocessing import (
    CATEGORICAL_FEATURES,
    FEATURES_TO_DROP,
    NUMERICAL_FEATURES,
    REDUCED_NUMERICAL_FEATURES,
    build_variant_e_preprocessor,
    prepare_features,
    split_features_target,
)


def make_sample_dataframe():
    columns = NUMERICAL_FEATURES + CATEGORICAL_FEATURES + [
        "label",
        "attack_cat",
    ]

    data = {}

    for column in NUMERICAL_FEATURES:
        data[column] = [1.0, 2.0, 3.0]

    for column in CATEGORICAL_FEATURES:
        data[column] = ["tcp", "udp", "tcp"]

    data["label"] = [0, 1, 0]
    data["attack_cat"] = ["Normal", "DoS", "Normal"]

    return pd.DataFrame(data)


def test_variant_e_feature_reduction():
    assert len(NUMERICAL_FEATURES) == 39
    assert len(FEATURES_TO_DROP) == 13
    assert len(REDUCED_NUMERICAL_FEATURES) == 26


def test_prepare_features():
    df = make_sample_dataframe()

    X = prepare_features(df)

    assert X.shape == (3, 29)
    assert list(X.columns) == (
        REDUCED_NUMERICAL_FEATURES + CATEGORICAL_FEATURES
    )


def test_split_features_target():
    df = make_sample_dataframe()

    X, y = split_features_target(df)

    assert X.shape == (3, 29)
    assert y.shape == (3,)
    assert list(y) == [0, 1, 0]


def test_variant_e_preprocessor():
    df = make_sample_dataframe()

    X = prepare_features(df)

    preprocessor = build_variant_e_preprocessor()

    transformed = preprocessor.fit_transform(X)

    assert transformed.shape[0] == 3
    assert transformed.shape[1] >= 29


def test_variant_e_handles_missing_values():
    df = make_sample_dataframe()

    df.loc[0, "sbytes"] = None
    df.loc[1, "proto"] = None

    X = prepare_features(df)

    preprocessor = build_variant_e_preprocessor()

    transformed = preprocessor.fit_transform(X)

    assert transformed.shape[0] == 3
    