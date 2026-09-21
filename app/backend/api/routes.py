from fastapi import APIRouter

import base64
import uuid

from fastapi import HTTPException

from app.backend.api.schemas import PredictionRequest
from app.backend.services.classical_service import ClassicalService

import base64
import uuid

from fastapi import APIRouter, HTTPException

from app.backend.api.schemas import (
    PredictionRequest,
    CryptoSessionRequest,
    CryptoSessionResponse,
    CryptoEncryptRequest,
    CryptoEncryptResponse,
)

from app.backend.services.classical_service import ClassicalService

from app.backend.services.crypto_service import (
    ClassicalCryptoService,
)

from app.backend.services.key_exchange import (
    X25519KeyExchange,
)

router = APIRouter()

classical_service = ClassicalService()

crypto_service = ClassicalCryptoService()
key_exchange = X25519KeyExchange()

_crypto_sessions = {}


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model": "Random Forest",
        "variant": "E",
    }


@router.post("/predict")
def predict(request: PredictionRequest):
    return classical_service.predict(request.model_dump())

@router.post(
    "/crypto/session",
    response_model=CryptoSessionResponse,
)
def create_crypto_session(request: CryptoSessionRequest):
    """
    Establish a classical AEGES-Q cryptographic session.

    The client provides its ephemeral X25519 public key.
    The server generates its own ephemeral X25519 key pair,
    derives the shared secret, and uses HKDF-SHA256 to derive
    the session encryption key.

    Private keys and session keys remain server-side.
    """

    try:
        client_public_key_bytes = base64.b64decode(
            request.client_public_key
        )

        client_public_key = (
            key_exchange.deserialize_public_key(
                client_public_key_bytes
            )
        )

        server_key_pair = (
            key_exchange.generate_key_pair()
        )

        session_key = key_exchange.derive_session_key(
            server_key_pair.private_key,
            client_public_key,
        )

        session_id = str(uuid.uuid4())

        _crypto_sessions[session_id] = {
            "session_key": session_key,
        }

        server_public_key = (
            key_exchange.serialize_public_key(
                server_key_pair.public_key
            )
        )

        return CryptoSessionResponse(
            session_id=session_id,
            server_public_key=base64.b64encode(
                server_public_key
            ).decode(),
        )

    except (ValueError, TypeError) as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid client public key: {exc}",
        ) from exc

@router.post(
    "/crypto/encrypt",
    response_model=CryptoEncryptResponse,
)
def encrypt_with_session(
    request: CryptoEncryptRequest,
):
    """
    Encrypt application data using an established
    AEGES-Q classical cryptographic session.
    """

    session = _crypto_sessions.get(
        request.session_id
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Cryptographic session not found",
        )

    plaintext = request.plaintext.encode("utf-8")

    encrypted = crypto_service.encrypt(
        plaintext,
        session["session_key"],
    )

    return CryptoEncryptResponse(
        nonce=base64.b64encode(
            encrypted.nonce
        ).decode(),
        ciphertext=base64.b64encode(
            encrypted.ciphertext
        ).decode(),
    )
