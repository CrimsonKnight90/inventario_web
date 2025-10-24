from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from decimal import Decimal

from src.app.db.session import get_session
from src.app.services.alerts import check_alerts
from src.app.core.settings import settings
from src.app.services.notifications.slack_notifier import send_slack_alert
from src.app.schemas.alert import AlertRead

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/stock", response_model=list[AlertRead])
async def stock_alerts(
    product_id: UUID = Query(...),
    batch_id: UUID | None = Query(None),
    location_id: UUID | None = Query(None),
    min_stock: Decimal = Decimal(settings.alerts_min_stock),
    min_coverage_days: int = settings.alerts_min_coverage_days,
    lookback_days: int = settings.alerts_lookback_days,
    session: AsyncSession = Depends(get_session),
):
    """Check stock alerts for a product (low stock, low coverage)."""
    alerts = await check_alerts(
        session,
        product_id,
        batch_id=batch_id,
        location_id=location_id,
        min_stock=min_stock,
        min_coverage_days=min_coverage_days,
        lookback_days=lookback_days,
    )
    return [AlertRead(**a) if not isinstance(a, AlertRead) else a for a in alerts]


@router.post("/stock/notify")
async def stock_alerts_notify(
    product_id: UUID,
    batch_id: UUID | None = None,
    location_id: UUID | None = None,
    min_stock: Decimal = Decimal(settings.alerts_min_stock),
    min_coverage_days: int = settings.alerts_min_coverage_days,
    lookback_days: int = settings.alerts_lookback_days,
    session: AsyncSession = Depends(get_session),
):
    """Check stock alerts and push notification to Slack via Incoming Webhook."""
    alerts = await check_alerts(
        session,
        product_id,
        batch_id=batch_id,
        location_id=location_id,
        min_stock=min_stock,
        min_coverage_days=min_coverage_days,
        lookback_days=lookback_days,
    )
    if not alerts:
        return {"alerts": [], "sent": False}

    webhook = settings.slack_webhook_url
    if not webhook:
        raise HTTPException(status_code=400, detail="Slack webhook URL not configured (APP_SLACK_WEBHOOK_URL)")

    await send_slack_alert(webhook, alerts)
    return {"alerts": alerts, "sent": True}
