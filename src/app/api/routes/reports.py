from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from decimal import Decimal
from datetime import datetime

from src.app.db.session import get_session
from src.app.services import reports_service
from src.app.schemas.report import ReportSummary, ReportHistoryItem, ReportForecast

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/stock_summary", response_model=ReportSummary)
async def stock_summary(
    product_id: UUID | None = Query(None),
    batch_id: UUID | None = Query(None),
    location_id: UUID | None = Query(None),
    session: AsyncSession = Depends(get_session),
):
    return await reports_service.get_stock_summary(session, product_id, batch_id, location_id)


@router.get("/stock_history", response_model=list[ReportHistoryItem])
async def stock_history(
    product_id: UUID = Query(...),
    session: AsyncSession = Depends(get_session),
    batch_id: UUID | None = Query(None),
    location_id: UUID | None = Query(None),
    start_date: datetime | None = Query(None),
    end_date: datetime | None = Query(None),
):
    history = await reports_service.get_stock_history(session, product_id, batch_id, location_id, start_date, end_date)
    # convert dict entries to schema objects
    return [ReportHistoryItem(date=h["date"], balance=h["balance"]) for h in history]


@router.get("/stock_forecast", response_model=ReportForecast)
async def stock_forecast(
    product_id: UUID = Query(...),
    session: AsyncSession = Depends(get_session),
    batch_id: UUID | None = Query(None),
    location_id: UUID | None = Query(None),
    lookback_days: int = Query(30, ge=7, le=365),
):
    try:
        forecast = await reports_service.get_stock_forecast(session, product_id, batch_id, location_id, lookback_days)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # normalize depletion_date to datetime or None
    depletion_date = forecast.get("depletion_date")
    if depletion_date and isinstance(depletion_date, str):
        # in service we returned datetime object for depletion_date; ensure Pydantic accepts it
        depletion_date = depletion_date

    return ReportForecast(
        stock=forecast["stock"],
        avg_daily_consumption=forecast["avg_daily_consumption"],
        coverage_days=forecast["coverage_days"],
        depletion_date=forecast["depletion_date"],
    )
