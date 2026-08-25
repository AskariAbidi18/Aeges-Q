import pandas as pd

from pandas.api.types import is_numeric_dtype

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder

class UNSWPreprocessor:

    def __init__(self):
        self.id_column = "id"
        self.target_column = "label"
        self.attack_category_column = "attack_cat"
        self.numerical_features = None
        self.categorical_features = None
        self.transformer = None

    def split_features_and_target(self, df):
        # copy df
        df_copy = df.copy()

        # extract y
        y = df_copy[self.target_column]

        # extract attack metadata
        attack_metadata = df_copy[self.attack_category_column]

        # drop id, label, attack_cat
        X = df_copy.drop(columns=[self.id_column, self.target_column, self.attack_category_column])

        # return X, y, attack_metadata
        return X, y, attack_metadata

    def identify_feature_types(self, X):
        self.categorical_features = []
        self.numerical_features = []
        
        for i in X.columns:
            if is_numeric_dtype(X[i]):
                self.numerical_features.append(i)
            else:
                self.categorical_features.append(i)

        return self.numerical_features, self.categorical_features

    def fit(self, X):
        # Identify and store feature types
        self.identify_feature_types(X)

        # NUMERIC PIPELINE
        numeric_transformer = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(strategy="median")
                )
            ]
        )

        # CATEGORICAL PIPELINE
        categorical_transformer = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(strategy="most_frequent")
                ),

                (
                    "encoder",
                    OneHotEncoder(
                        handle_unknown="ignore"
                    )
                )
            ]
        )

        # COMBINE BOTH PIPELINES
        self.transformer = ColumnTransformer(
            transformers=[
                (
                    "numeric",
                    numeric_transformer,
                    self.numerical_features
                ),

                (
                    "categorical",
                    categorical_transformer,
                    self.categorical_features
                )
            ]
        )

        # FIT ONLY ON TRAINING DATA
        self.transformer.fit(X)

        return self

    def transform(self, X):
        return self.transformer.transform(X)

    def fit_transform(self, X):
        return self.fit(X).transform(X)
