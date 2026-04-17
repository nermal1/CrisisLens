from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
import models
from ml.lstm_engine import run_lstm_forecast
import datetime
import math
import json

router = APIRouter(prefix="/forecast", tags=["LSTM Forecast"])

def _safe(val: float) -> float:
    f = float(val)
    return 0.0 if (math.isnan(f) or math.isinf(f)) else round(f, 2)

# Notice we removed 'async' here so FastAPI runs this in a background thread!
@router.get("/lstm/{portfolio_id}")
def get_lstm_forecast(portfolio_id: str, timeframe: str = "1M", db: Session = Depends(get_db)):
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

    # This generator catches the yields from your LSTM engine and streams them
    def event_generator():
        try:
            for chunk in run_lstm_forecast(tickers, shares, projection_days):
                # Parse the yielded JSON string from the engine
                data = json.loads(chunk)
                
                if data.get("type") == "result":
                    # Format the final chart payload once the AI is done
                    today = datetime.date.today()
                    curr_val = data["current_total_value"]
                    chart_data = [{"date": "Today", "bear": _safe(curr_val), "base": _safe(curr_val), "bull": _safe(curr_val)}]
                    
                    step = max(1, projection_days // 8)
                    for i in range(step - 1, projection_days, step):
                        future_date = today + datetime.timedelta(days=int(i * (365 / 252)))
                        chart_data.append({
                            "date": future_date.strftime("%b %d"),
                            "bear": _safe(data["bear_path"][i]),
                            "base": _safe(data["base_path"][i]),
                            "bull": _safe(data["bull_path"][i])
                        })
                    
                    yield json.dumps({
                        "type": "result", 
                        "chart": chart_data, 
                        "accuracy": data["overall_accuracy"], 
                        "current_value": _safe(curr_val)
                    }) + "\n"
                else:
                    # Pass progress updates straight through to the frontend terminal
                    yield chunk
                    
        except Exception as e:
            print(f"LSTM Error: {e}")
            yield json.dumps({"type": "error", "message": str(e)}) + "\n"

    # Return the stream!
    return StreamingResponse(event_generator(), media_type="application/x-ndjson")