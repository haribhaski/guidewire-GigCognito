from fastapi import FastAPI
from app.api.routes_pricing import router as pricing_router

app = FastAPI(title="GigShield ML Service", version="1.0.0")

app.include_router(pricing_router)

@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-service"}
