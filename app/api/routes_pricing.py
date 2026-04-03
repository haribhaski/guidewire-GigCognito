from fastapi import APIRouter
from pydantic import BaseModel
from app.services.pricing_service import calculate_premium

router = APIRouter(prefix="/pricing", tags=["pricing"])

class PricingRequest(BaseModel):
    zone_id:                     str
    season:                      str = "normal"
    zone_disruption_rate:        float = 0.2
    forecast_rainfall_next_7_days: float = 0.0
    aqi_avg_last_week:           float = 100.0
    worker_claims_last_4_weeks:  int   = 0
    worker_tenure_months:        int   = 0

@router.post("/quote")
def get_quote(req: PricingRequest):
    return calculate_premium(req.model_dump())
