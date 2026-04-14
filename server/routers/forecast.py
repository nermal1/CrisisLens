from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
from ml.lstm_engine import run_lstm_forecast
import datetime
import math

router = APIRouter(prefix="/forecast", tags=["LSTM Forecast"])

def _safe(val: float) -> float:
    f = float(val)
    return 0.0 if (math.isnan(f) or math.isinf(f)) else round(f, 2)

@router.get("/lstm/{portfolio_id}")
async def get_lstm_forecast(portfolio_id: str, timeframe: str = "1M", db: Session = Depends(get_db)):
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    holdings = db.query(models.Holding).filter(models.Holding.portfolio_id == portfolio_id).all()
    if not holdings:
        raise HTTPException(status_code=400, detail="Portfolio has no holdings.")

    tickers = [h.ticker for h in holdings]
    shares = [h.shares for h in holdings]

    days_map = {"1W": 5, "1M": 21, "3M": 63}
    projection_days = days_map.get(timeframe, 21)

    try:
        base, bull, bear, current_value, accuracy = run_lstm_forecast(tickers, shares, projection_days)

        today = datetime.date.today()
        chart_data = [{"date": "Today", "bear": _safe(current_value), "base": _safe(current_value), "bull": _safe(current_value)}]

        step = max(1, projection_days // 8)
        for i in range(step - 1, projection_days, step):
            future_date = today + datetime.timedelta(days=int(i * (365 / 252)))
            chart_data.append({
                "date": future_date.strftime("%b %d"),
                "bear": _safe(bear[i]),
                "base": _safe(base[i]),
                "bull": _safe(bull[i])
            })

        return {
            "chart": chart_data,
            "accuracy": accuracy,
            "current_value": _safe(current_value)
        }

    except Exception as e:
        print(f"LSTM Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
