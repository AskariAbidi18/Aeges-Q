from fastapi import FastAPI

from app.backend.api.routes import router

app = FastAPI(
    title="AEGES-Q API",
    description="Network Intrusion Detection API",
    version="1.0.0",
)

app.include_router(router)