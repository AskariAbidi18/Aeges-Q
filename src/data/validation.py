from typing import Iterable

import pandas as pd


# Model input features established during the preprocessing experiments.
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

TARGET_COLUMNS = [
    "label",
    "attack_cat",
]

MODEL_FEATURES = NUMERICAL_FEATURES + CATEGORICAL_FEATURES


def get_required_columns() -> list[str]:
    """
    Return all columns required by the AEGES-Q data pipeline.
    """
    return MODEL_FEATURES + TARGET_COLUMNS


def validate_columns(
    df: pd.DataFrame,
    required_columns: Iterable[str] | None = None,
) -> None:
    """
    Validate that all required columns are present.

    Raises:
        ValueError: If one or more required columns are missing.
    """
    if required_columns is None:
        required_columns = get_required_columns()

    required_columns = list(required_columns)

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            "Dataset is missing required columns: "
            + ", ".join(missing_columns)
        )


def validate_dataframe(df: pd.DataFrame) -> None:
    """
    Perform basic structural validation of a raw UNSW-NB15 DataFrame.
    """
    if not isinstance(df, pd.DataFrame):
        raise TypeError("Input must be a pandas DataFrame.")

    if df.empty:
        raise ValueError("Input DataFrame is empty.")

    validate_columns(df)
