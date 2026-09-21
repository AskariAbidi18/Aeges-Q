from app.backend.services.key_exchange import (
    SESSION_KEY_SIZE,
    X25519KeyExchange,
)


def test_x25519_key_generation():
    exchange = X25519KeyExchange()

    key_pair = exchange.generate_key_pair()

    public_key = exchange.serialize_public_key(
        key_pair.public_key
    )

    assert len(public_key) == 32


def test_x25519_shared_session_key_matches():
    exchange = X25519KeyExchange()

    client = exchange.generate_key_pair()
    server = exchange.generate_key_pair()

    client_session_key = exchange.derive_session_key(
        client.private_key,
        server.public_key,
    )

    server_session_key = exchange.derive_session_key(
        server.private_key,
        client.public_key,
    )

    assert client_session_key == server_session_key
    assert len(client_session_key) == SESSION_KEY_SIZE


def test_public_key_serialization_round_trip():
    exchange = X25519KeyExchange()

    key_pair = exchange.generate_key_pair()

    serialized = exchange.serialize_public_key(
        key_pair.public_key
    )

    restored = exchange.deserialize_public_key(
        serialized
    )

    assert (
        exchange.serialize_public_key(restored)
        == serialized
    )


def test_different_exchanges_produce_different_keys():
    exchange = X25519KeyExchange()

    client = exchange.generate_key_pair()
    server = exchange.generate_key_pair()

    another_server = exchange.generate_key_pair()

    first_key = exchange.derive_session_key(
        client.private_key,
        server.public_key,
    )

    second_key = exchange.derive_session_key(
        client.private_key,
        another_server.public_key,
    )

    assert first_key != second_key
    