import pandas as pd

from src.inference.predictor import AegesPredictor


class ClassicalService:
    def __init__(self) -> None:
        self.predictor = AegesPredictor()

    def predict(self, features: dict) -> dict:
        data = pd.DataFrame([features])

        return self.predictor.predict(data)
    