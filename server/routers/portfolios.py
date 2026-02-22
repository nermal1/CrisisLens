from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import joinedload
from typing import List
import uuid

from dependencies import CurrentUser, DBSession
from models import Portfolio, Holding


router = APIRouter(
    prefix="/portfolios",
    tags=["portfolios"]
)


# Pydantic schemas for request/response
class HoldingCreate(BaseModel):
    ticker: str
    shares: float
    avg_price_paid: float | None = None


class PortfolioCreate(BaseModel):
    name: str
    description: str | None = None


from uuid import UUID
from datetime import datetime

class HoldingResponse(BaseModel):
    id: UUID
    ticker: str
    shares: float
    avg_price_paid: float | None
    
    class Config:
        from_attributes = True


class PortfolioResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    description: str | None
    created_at: datetime
    holdings: List[HoldingResponse] = []
    
    class Config:
        from_attributes = True



@router.get("/", response_model=List[PortfolioResponse])
async def get_user_portfolios(
    user: CurrentUser,
    db: DBSession
):
    """
    Get all portfolios for the authenticated user.
    """
    portfolios = db.query(Portfolio).filter(
        Portfolio.user_id == user["user_id"]
    ).options(joinedload(Portfolio.holdings)).all()
    
    return portfolios


@router.post("/", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
async def create_portfolio(
    portfolio_data: PortfolioCreate,
    user: CurrentUser,
    db: DBSession
):
    """
    Create a new portfolio for the authenticated user.
    The user_id is automatically set from the JWT token.
    """
    new_portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user["user_id"],  # Automatically assign from authenticated user
        name=portfolio_data.name,
        description=portfolio_data.description
    )
    
    db.add(new_portfolio)
    db.commit()
    db.refresh(new_portfolio)
    
    return new_portfolio


@router.get("/{portfolio_id}", response_model=PortfolioResponse)
async def get_portfolio(
    portfolio_id: str,
    user: CurrentUser,
    db: DBSession
):
    """
    Get a specific portfolio by ID.
    Only returns if the portfolio belongs to the authenticated user.
    """
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == user["user_id"]  # Ownership check
    ).options(joinedload(Portfolio.holdings)).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found or you don't have access"
        )
    
    return portfolio


@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio(
    portfolio_id: str,
    user: CurrentUser,
    db: DBSession
):
    """
    Delete a portfolio.
    Only allows deletion if the portfolio belongs to the authenticated user.
    """
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == user["user_id"]  # Ownership check
    ).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found or you don't have access"
        )
    
    db.delete(portfolio)
    db.commit()
    
    return None

@router.post("/{portfolio_id}/holdings", status_code=status.HTTP_201_CREATED)
async def add_holdings(
    portfolio_id: str,
    holdings_data: List[HoldingCreate],
    user: CurrentUser,
    db: DBSession
):
    """
    Add holdings to a portfolio.
    Only allows if the portfolio belongs to the authenticated user.
    """
    # Verify portfolio ownership
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == user["user_id"]
    ).first()

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found or you don't have access"
        )

    new_holdings = []
    for h in holdings_data:
        holding = Holding(
            id=uuid.uuid4(),
            portfolio_id=portfolio_id,
            ticker=h.ticker,
            shares=h.shares,
            avg_price_paid=h.avg_price_paid
        )
        db.add(holding)
        new_holdings.append(holding)

    db.commit()
    return {"message": f"Added {len(new_holdings)} holdings"}
