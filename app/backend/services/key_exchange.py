from __future__ import annotations

from dataclasses import dataclass

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric.x25519 import (
    X25519PrivateKey,
    X25519PublicKey,
)
from cryptography.hazmat.primitives.kdf.hkdf import HKDF


X25519_KEY_SIZE = 32
SESSION_KEY_SIZE = 32

DEFAULT_HKDF_INFO = b"AEGES-Q|CLASSICAL|SESSION-KEY"


@dataclass
class EphemeralKeyPair:
    """
    Ephemeral X25519 key pair.

    The private key must remain internal and must never be exposed
    through an API response or log.
    """

    private_key: X25519PrivateKey
    public_key: X25519PublicKey


class X25519KeyExchange:
    """
    Classical ephemeral key-establishment service.

    X25519 establishes a shared secret.
    HKDF-SHA256 derives the application session key.
    """

    def __init__(
        self,
        hkdf_info: bytes = DEFAULT_HKDF_INFO,
    ):
        self.hkdf_info = hkdf_info

    @staticmethod
    def generate_key_pair() -> EphemeralKeyPair:
        """
        Generate an ephemeral X25519 key pair.
        """

        private_key = X25519PrivateKey.generate()
        public_key = private_key.public_key()

        return EphemeralKeyPair(
            private_key=private_key,
            public_key=public_key,
        )

    @staticmethod
    def serialize_public_key(
        public_key: X25519PublicKey,
    ) -> bytes:
        """
        Serialize an X25519 public key for transmission.
        """

        return public_key.public_bytes_raw()

    @staticmethod
    def deserialize_public_key(
        public_key_bytes: bytes,
    ) -> X25519PublicKey:
        """
        Deserialize a transmitted X25519 public key.
        """

        if len(public_key_bytes) != X25519_KEY_SIZE:
            raise ValueError(
                "X25519 public key must be exactly 32 bytes"
            )

        return X25519PublicKey.from_public_bytes(
            public_key_bytes
        )

    def derive_session_key(
        self,
        private_key: X25519PrivateKey,
        peer_public_key: X25519PublicKey,
    ) -> bytes:
        """
        Perform X25519 agreement and derive a 256-bit session key
        using HKDF-SHA256.
        """

        shared_secret = private_key.exchange(
            peer_public_key
        )

        session_key = HKDF(
            algorithm=hashes.SHA256(),
            length=SESSION_KEY_SIZE,
            salt=None,
            info=self.hkdf_info,
        ).derive(shared_secret)

        return session_key
    