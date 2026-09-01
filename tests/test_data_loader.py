from src.data.loader import load_training_data, load_testing_data

def test_training_data_loads():
    df = load_training_data()

    assert not df.empty
    assert len(df) == 82332


def test_testing_data_loads():
    df = load_testing_data()

    assert not df.empty
    assert len(df) == 175341