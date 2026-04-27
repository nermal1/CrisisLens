from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from config import settings
import json

router = APIRouter(prefix="/ai", tags=["AI Summary"])

class SummarizeRequest(BaseModel):
    type: str  # "lstm", "news", "scenario"
    data: dict

PROMPTS = {
    "lstm": """You are a financial analyst explaining an AI stock forecast to a regular person with no finance background.
Write exactly one paragraph (4-6 sentences) in plain, simple English.
Be specific with the numbers provided. Explain what the bull, base, and bear cases mean in practical terms (e.g. dollar amounts and percentages).
Mention the accuracy score and briefly explain what it means. End with one sentence of practical takeaway.
Do not use jargon. Do not use bullet points. Return only the paragraph, nothing else.""",

    "news": """You are a financial analyst summarizing portfolio news sentiment for a regular person with no finance background.
Write exactly one paragraph (4-6 sentences) in plain, simple English.
Start with the overall portfolio sentiment trend. Then highlight the 2-3 most notable tickers with specific percentages.
Explain what the sentiment score means practically. End with one sentence about what this might mean for the portfolio.
Do not use jargon. Do not use bullet points. Return only the paragraph, nothing else.""",

    "scenario": """You are a financial analyst explaining a crisis scenario analysis to a regular person with no finance background.
Write exactly one paragraph (5-7 sentences) in plain, simple English.
Explain how the portfolio performed during the scenario compared to the S&P 500.
Explain max drawdown, volatility, and Sharpe ratio in plain English using the actual numbers.
Mention the risk gauge score and what it means. Reference the sector that was most impacted.
End with one practical takeaway about what this analysis reveals about the portfolio.
Do not use jargon. Do not use bullet points. Return only the paragraph, nothing else."""
}

@router.post("/summarize")
async def summarize_results(request: SummarizeRequest):
    if not settings.GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set.")

    if request.type not in PROMPTS:
        raise HTTPException(status_code=400, detail=f"Invalid type. Must be one of: {list(PROMPTS.keys())}")

    client = OpenAI(
        api_key=settings.GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1"
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": PROMPTS[request.type]},
            {"role": "user", "content": f"Here is the data to summarize:\n{json.dumps(request.data, indent=2)}"}
        ],
        temperature=0.5,
        max_tokens=300,
    )

    summary = response.choices[0].message.content.strip()
    return {"summary": summary}
