"""
Dynamic premium pricing service.
Uses XGBoost if model artifact exists, falls back to rule-based.
Premium range: ₹20 – ₹50 per worker per week.
"""
import os, math

MIN_PREMIUM = 20
MAX_PREMIUM = 50

try:
    import xgboost as xgb
    import pickle
    MODEL_PATH = "app/artifacts/xgboost_pricing.pkl"
    _model = pickle.load(open(MODEL_PATH, "rb")) if os.path.exists(MODEL_PATH) else None
except Exception:
    _model = None


def calculate_premium(data: dict) -> dict:
    """
    data keys:
      zone_id, season, zone_disruption_rate (0-1),
      forecast_rainfall_next_7_days (mm),
      aqi_avg_last_week (0-500),
      worker_claims_last_4_weeks (int),
      worker_tenure_months (int)
    """
    if _model:
        import pandas as pd
        df = pd.DataFrame([data])
        raw = float(_model.predict(df)[0])
    else:
        raw = _rule_based(data)

    premium = max(MIN_PREMIUM, min(MAX_PREMIUM, round(raw)))
    return {
        "weekly_premium": premium,
        "model": "xgboost" if _model else "rule_based",
        "breakdown": _explain(data, premium),
    }


def _rule_based(d: dict) -> float:
    base = 35.0
    base += d.get("zone_disruption_rate", 0.2) * 40
    rain = d.get("forecast_rainfall_next_7_days", 0)
    if rain > 60:  base += 8
    aqi = d.get("aqi_avg_last_week", 100)
    if aqi > 350: base += 6
    claims = d.get("worker_claims_last_4_weeks", 0)
    base += claims * 2
    if d.get("worker_tenure_months", 0) >= 12: base -= 4
    season = d.get("season", "normal")
    multipliers = {"monsoon": 1.3, "delhi_aqi": 1.2, "heatwave": 1.15, "normal": 1.0}
    base *= multipliers.get(season, 1.0)
    return base


def _explain(d: dict, premium: int) -> str:
    return (
        f"zone_risk={d.get('zone_disruption_rate',0.2):.0%} | "
        f"rain={d.get('forecast_rainfall_next_7_days',0):.0f}mm | "
        f"aqi={d.get('aqi_avg_last_week',100)} | "
        f"season={d.get('season','normal')} → ₹{premium}/week"
    )
