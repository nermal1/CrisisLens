from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from openai import OpenAI
from config import settings

router = APIRouter(prefix="/chaos", tags=["Chaos Agent"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChaosRequest(BaseModel):
    messages: list[ChatMessage]
    portfolios: list[dict] = []
    current_dashboard: dict | None = None

@router.post("/simulate")
async def run_chaos_simulation(request: ChaosRequest):
    if not settings.GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set.")

    client = OpenAI(
        api_key=settings.GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1"
    )

    # Format portfolio holdings so the model knows what's actually in each portfolio
    portfolio_lines = []
    for p in request.portfolios:
        holdings = p.get("holdings", [])
        if holdings:
            ticker_str = ", ".join([
                f"{h.get('ticker', '?')} ({h.get('shares', 0)} shares{', ' + h.get('sector') if h.get('sector') else ''})"
                for h in holdings
            ])
            portfolio_lines.append(f"  - {p.get('name', 'Unknown')}: {ticker_str}")
        else:
            portfolio_lines.append(f"  - {p.get('name', 'Unknown')}: (no holdings)")

    portfolio_context = "\n".join(portfolio_lines) if portfolio_lines else "No portfolios found."
    dashboard_context = json.dumps(request.current_dashboard, indent=2) if request.current_dashboard else "None"

    system_prompt = f"""You are 'Chaos Agent', an expert financial risk analyst AI. You help users simulate Black Swan events, understand their market impact, and have in-depth conversations about the results.

USER'S PORTFOLIOS (with actual holdings):
{portfolio_context}

CURRENTLY DISPLAYED DASHBOARD:
{dashboard_context}

You always output valid JSON with exactly this structure:
{{
    "agentMessage": "your response here",
    "uiAction": {{"type": "none" | "options", "choices": [...]}},
    "dashboardData": null or {{...}}
}}

YOU OPERATE IN THREE MODES — choose based on the user's message:

MODE 1 - NEW SCENARIO (user describes a crisis you need one clarification on):
Use this only if the scenario is genuinely unclear. Ask ONE question with up to 4 choices.
{{
    "agentMessage": "Interesting scenario. To focus the analysis — which angle matters most to you?",
    "uiAction": {{
        "type": "options",
        "choices": [
            {{"id": "A", "label": "Broad Market & Index Impact"}},
            {{"id": "B", "label": "Specific Sector Vulnerabilities"}},
            {{"id": "C", "label": "My Portfolio Exposure"}},
            {{"id": "D", "label": "Global Contagion & Macro Effects"}}
        ]
    }},
    "dashboardData": null
}}

MODE 2 - GENERATE ANALYSIS (you have enough info — use this as often as possible):
Generate the dashboard AND write a rich explanation. agentMessage must be 4-6 sentences covering: what triggers the shock, which sectors are hit and WHY, the transmission mechanism, and any historical parallel.
For recommendations: scan the user's actual portfolio holdings and give a specific action for each relevant ticker. Actions must be exactly one of: "reduce", "hold", or "increase". Only include tickers from the user's portfolios. Give 3-6 recommendations max. Base them on each stock's sector exposure to this specific event.
{{
    "agentMessage": "Detailed explanation here — not a template. Explain the economics.",
    "uiAction": {{"type": "none", "choices": []}},
    "dashboardData": {{
        "title": "Punchy event title",
        "projectedLoss": "-18.5%",
        "recoveryTime": "14 Months",
        Include 5-7 impactedSectors covering the most relevant sectors for this event. Not all need to be negative — some sectors benefit from certain crises (e.g. Defense during geopolitical events, Energy during supply shocks).
        "impactedSectors": [
            {{"name": "Sector", "change": "-24%", "status": "critical"}},
            {{"name": "Sector", "change": "+3%", "status": "positive"}},
            {{"name": "Sector", "change": "-8%", "status": "negative"}}
        ],
        "summary": "2-3 sentence economic explanation shown on the dashboard card.",
        "recommendations": [
            {{"ticker": "AAPL", "action": "reduce", "reason": "Heavy reliance on Taiwan semiconductors creates direct supply chain exposure."}},
            {{"ticker": "XOM", "action": "hold", "reason": "Energy sector benefits from supply shocks driving oil prices higher."}}
        ]
    }}
}}

MODE 3 - CONVERSATION (follow-up questions, requests to explain, portfolio-specific questions):
Do NOT regenerate the dashboard. Keep dashboardData as null. Have a real conversation.
Reference the currently displayed dashboard if relevant. Use the actual portfolio holdings to give specific advice.
{{
    "agentMessage": "Detailed conversational response — explain mechanics, give historical context, reference specific tickers from their portfolio, answer their question fully.",
    "uiAction": {{"type": "none", "choices": []}},
    "dashboardData": null
}}

DECISION RULE:
- New crisis description with no prior context → MODE 1 or 2
- User picks an option or gives more detail → MODE 2
- User asks "why", "explain", "what does this mean", "what about my portfolio", "how does X affect Y" → MODE 3
- User references the dashboard results → MODE 3

Output ONLY valid JSON. No markdown, no text outside the JSON."""

    formatted_messages = [{"role": "system", "content": system_prompt}]
    for msg in request.messages:
        formatted_messages.append({"role": msg.role, "content": msg.content})

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=formatted_messages,
            response_format={"type": "json_object"},
            temperature=0.7
        )

        raw_content = response.choices[0].message.content

        try:
            ai_result = json.loads(raw_content)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="AI returned malformed response. Please rephrase and try again.")

        if "agentMessage" not in ai_result:
            raise HTTPException(status_code=500, detail="Unexpected response format from AI.")

        return ai_result

    except HTTPException:
        raise
    except Exception as e:
        print(f"Chaos Agent Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to reach the Chaos Agent. Check your GROQ_API_KEY.")

