import pytest

from cryptography.exceptions import InvalidTag

from app.backend.services.crypto_service import (
    AES_KEY_SIZE,
    AES_NONCE_SIZE,
    ClassicalCryptoService,
    EncryptedPayload,
)


def test_aes_key_generation():
    service = ClassicalCryptoService()

    key = service.generate_key()

    assert isinstance(key, bytes)
    assert len(key) == AES_KEY_SIZE


def test_encrypt_decrypt_round_trip():
    service = ClassicalCryptoService()

    key = service.generate_key()
    plaintext = b"AEGES-Q protected network payload"

    encrypted = service.encrypt(
        plaintext,
        key,
    )

    decrypted = service.decrypt(
        encrypted,
        key,
    )

    assert decrypted == plaintext
    assert len(encrypted.nonce) == AES_NONCE_SIZE


def test_each_encryption_uses_fresh_nonce():
    service = ClassicalCryptoService()

    key = service.generate_key()
    plaintext = b"AEGES-Q test payload"

    first = service.encrypt(plaintext, key)
    second = service.encrypt(plaintext, key)

    assert first.nonce != second.nonce


def test_tampered_ciphertext_is_rejected():
    service = ClassicalCryptoService()

    key = service.generate_key()
    plaintext = b"AEGES-Q integrity test"

    encrypted = service.encrypt(
        plaintext,
        key,
    )

    tampered = bytearray(encrypted.ciphertext)
    tampered[0] ^= 0x01

    tampered_payload = EncryptedPayload(
        nonce=encrypted.nonce,
        ciphertext=bytes(tampered),
    )

    with pytest.raises(InvalidTag):
        service.decrypt(
            tampered_payload,
            key,
        )


def test_wrong_key_is_rejected():
    service = ClassicalCryptoService()

    key = service.generate_key()
    wrong_key = service.generate_key()

    plaintext = b"AEGES-Q wrong key test"

    encrypted = service.encrypt(
        plaintext,
        key,
    )

    with pytest.raises(InvalidTag):
        service.decrypt(
            encrypted,
            wrong_key,
        )


def test_invalid_key_size_is_rejected():
    service = ClassicalCryptoService()

    with pytest.raises(ValueError):
        service.encrypt(
            b"test",
            b"short-key",
        )
        