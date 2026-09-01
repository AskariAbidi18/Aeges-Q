from sklearn.ensemble import RandomForestClassifier

def build_random_forest() -> RandomForestClassifier:
    """
    Build the final AEGES-Q Random Forest classifier.

    Configuration corresponds to the selected baseline model
    from the model-development experiments.
    """

    return RandomForestClassifier(
        n_estimators = 200,
        random_state = 42,
        n_jobs = -1,
    )
