from fastapi import APIRouter

from app.backend.api.schemas import PredictionRequest
from app.backend.services.classical_service import ClassicalService

router = APIRouter()

classical_service = ClassicalService()


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
