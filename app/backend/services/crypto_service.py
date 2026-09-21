from __future__ import annotations

import os
from dataclasses import dataclass

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


AES_KEY_SIZE = 32          # 256 bits
AES_NONCE_SIZE = 12        # 96 bits, recommended for GCM
AES_TAG_SIZE = 16          # 128-bit authentication tag

DEFAULT_AAD = b"AEGES-Q|CLASSICAL|AES-256-GCM"


@dataclass(frozen=True)
class EncryptedPayload:
    """
    Authenticated AES-256-GCM ciphertext envelope.

    The nonce is stored separately from the ciphertext because
    the nonce is required for decryption but is not secret.
    """

    nonce: bytes
    ciphertext: bytes


class ClassicalCryptoService:
    """
    Production AES-256-GCM service for AEGES-Q.

    Responsibilities:
    - Generate AES-256 session keys
    - Encrypt application data
    - Decrypt authenticated ciphertext
    - Enforce correct nonce handling
    - Reject tampered ciphertext
    """

    def __init__(self, associated_data: bytes = DEFAULT_AAD):
        self.associated_data = associated_data

    @staticmethod
    def generate_key() -> bytes:
        """
        Generate a fresh 256-bit AES key.

        Key material is returned to the caller and is never logged
        or persisted by this service.
        """
        return AESGCM.generate_key(bit_length=256)

    @staticmethod
    def _validate_key(key: bytes) -> None:
        if not isinstance(key, bytes):
            raise TypeError("AES key must be bytes")

        if len(key) != AES_KEY_SIZE:
            raise ValueError("AES key must be exactly 32 bytes")

    def encrypt(
        self,
        plaintext: bytes,
        key: bytes,
    ) -> EncryptedPayload:
        """
        Encrypt plaintext using AES-256-GCM.

        A fresh 96-bit nonce is generated for every encryption.
        """

        if not isinstance(plaintext, bytes):
            raise TypeError("Plaintext must be bytes")

        self._validate_key(key)

        nonce = os.urandom(AES_NONCE_SIZE)

        aesgcm = AESGCM(key)

        ciphertext = aesgcm.encrypt(
            nonce,
            plaintext,
            self.associated_data,
        )

        return EncryptedPayload(
            nonce=nonce,
            ciphertext=ciphertext,
        )

    def decrypt(
        self,
        payload: EncryptedPayload,
        key: bytes,
    ) -> bytes:
        """
        Decrypt and authenticate an AES-256-GCM payload.

        Invalid or tampered ciphertext raises InvalidTag.
        """

        self._validate_key(key)

        if not isinstance(payload, EncryptedPayload):
            raise TypeError("payload must be EncryptedPayload")

        if len(payload.nonce) != AES_NONCE_SIZE:
            raise ValueError("Nonce must be exactly 12 bytes")

        aesgcm = AESGCM(key)

        try:
            return aesgcm.decrypt(
                payload.nonce,
                payload.ciphertext,
                self.associated_data,
            )
        except InvalidTag:
            raise InvalidTag(
                "AES-GCM authentication failed"
            ) from None
            