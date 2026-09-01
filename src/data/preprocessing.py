from typing import Tuple

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


# Original numerical feature set established during experimentation.
NUMERICAL_FEATURES = [
    "dur",
    "spkts",
    "dpkts",
    "sbytes",
    "dbytes",
    "rate",
    "sttl",
    "dttl",
    "sload",
    "dload",
    "sloss",
    "dloss",
    "sinpkt",
    "dinpkt",
    "sjit",
    "djit",
    "swin",
    "stcpb",
    "dtcpb",
    "dwin",
    "tcprtt",
    "synack",
    "ackdat",
    "smean",
    "dmean",
    "trans_depth",
    "response_body_len",
    "ct_srv_src",
    "ct_state_ttl",
    "ct_dst_ltm",
    "ct_dst_sport_ltm",
    "ct_src_dport_ltm",
    "ct_src_ltm",
    "ct_srv_dst",
    "ct_dst_src_ltm",
    "is_ftp_login",
    "ct_ftp_cmd",
    "ct_flw_http_mthd",
    "is_sm_ips_ports",
]

CATEGORICAL_FEATURES = [
    "proto",
    "service",
    "state",
]


# Variant E removes the redundant members of the highly correlated groups.
FEATURES_TO_DROP = [
    "ct_dst_ltm",
    "ct_dst_src_ltm",
    "ct_ftp_cmd",
    "ct_src_dport_ltm",
    "ct_src_ltm",
    "ct_srv_src",
    "dloss",
    "dpkts",
    "dwin",
    "is_sm_ips_ports",
    "sloss",
    "spkts",
    "tcprtt",
]


REDUCED_NUMERICAL_FEATURES = [
    feature
    for feature in NUMERICAL_FEATURES
    if feature not in FEATURES_TO_DROP
]


def build_variant_e_preprocessor() -> ColumnTransformer:
    """
    Build the preprocessing pipeline used by Variant E.

    Variant E:
    - removes redundant correlated numerical features
    - median-imputes numerical features
    - standardizes numerical features
    - most-frequent imputes categorical features
    - one-hot encodes categorical features
    """

    numerical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            (
                "encoder",
                OneHotEncoder(handle_unknown="ignore"),
            ),
        ]
    )

    return ColumnTransformer(
        transformers=[
            (
                "numeric",
                numerical_transformer,
                REDUCED_NUMERICAL_FEATURES,
            ),
            (
                "categorical",
                categorical_transformer,
                CATEGORICAL_FEATURES,
            ),
        ]
    )


def prepare_features(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Remove target/metadata columns and redundant numerical features.

    Returns the raw feature DataFrame that is passed to the
    Variant E preprocessor.
    """

    feature_columns = (
        REDUCED_NUMERICAL_FEATURES
        + CATEGORICAL_FEATURES
    )

    return df[feature_columns].copy()


def split_features_target(
    df: pd.DataFrame,
) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Split a raw UNSW-NB15 DataFrame into model features and target.

    The binary `label` column is used as the prediction target.
    """

    X = prepare_features(df)
    y = df["label"].copy()

    return X, y
