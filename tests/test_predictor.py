import pandas as pd

from src.data.preprocessing import (
    CATEGORICAL_FEATURES,
    REDUCED_NUMERICAL_FEATURES,
)
from src.inference.predictor import AegesPredictor


def make_prediction_input():
    data = {}

    for feature in REDUCED_NUMERICAL_FEATURES:
        data[feature] = [1.0]

    for feature in CATEGORICAL_FEATURES:
        data[feature] = ["tcp"]

    return pd.DataFrame(data)


def test_predictor_loads_artifacts():
    predictor = AegesPredictor()

    assert predictor.preprocessor is not None
    assert predictor.model is not None


def test_predictor_returns_prediction():
    predictor = AegesPredictor()

    data = make_prediction_input()

    result = predictor.predict(data)

    assert "predictions" in result
    assert "attack_probabilities" in result

    assert len(result["predictions"]) == 1
    assert len(result["attack_probabilities"]) == 1

    assert result["predictions"][0] in [0, 1]

    assert 0.0 <= result["attack_probabilities"][0] <= 1.0
    