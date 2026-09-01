from sklearn.ensemble import RandomForestClassifier

from src.models.classical.random_forest import build_random_forest


def test_random_forest_configuration():
    model = build_random_forest()

    assert isinstance(model, RandomForestClassifier)
    assert model.n_estimators == 200
    assert model.random_state == 42
    assert model.n_jobs == -1
    