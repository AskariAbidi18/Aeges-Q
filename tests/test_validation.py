import pandas as pd
import pytest

from src.data.validation import (
    CATEGORICAL_FEATURES,
    NUMERICAL_FEATURES,
    TARGET_COLUMNS,
    get_required_columns,
    validate_columns,
    validate_dataframe,
)


def make_valid_dataframe():
    columns = get_required_columns()

    return pd.DataFrame(
        {
            column: [0]
            for column in columns
        }
    )


def test_required_columns_are_defined():
    required_columns = get_required_columns()

    assert len(NUMERICAL_FEATURES) == 39
    assert len(CATEGORICAL_FEATURES) == 3
    assert TARGET_COLUMNS == ["label", "attack_cat"]

    assert len(required_columns) == 44


def test_valid_dataframe_passes_validation():
    df = make_valid_dataframe()

    validate_dataframe(df)


def test_missing_column_raises_error():
    df = make_valid_dataframe()

    df = df.drop(columns=["sbytes"])

    with pytest.raises(ValueError, match="sbytes"):
        validate_dataframe(df)


def test_empty_dataframe_raises_error():
    df = pd.DataFrame(columns=get_required_columns())

    with pytest.raises(ValueError, match="empty"):
        validate_dataframe(df)


def test_non_dataframe_raises_error():
    with pytest.raises(TypeError, match="pandas DataFrame"):
        validate_dataframe(["not", "a", "dataframe"])
        