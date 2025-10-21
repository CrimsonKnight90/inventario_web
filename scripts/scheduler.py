"""
Periodic alert scheduler using APScheduler.

Run locally:
    APP_SLACK_WEBHOOK_URL="https://hooks.slack.com/services/XXX/YYY/ZZZ" \
    APP_ALERTS_MIN_STOCK=10 APP_ALERTS_MIN_COVERAGE_DAYS=7 APP_ALERTS_LOOKBACK_DAYS=30 \
    python scripts/scheduler.py
"""
import asyncio
import os
import uuid
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from src.app.core.settings import settings
from src.app.services.alerts import check_alerts
from src.app.services.notifications.slack_notifier import send_slack_alert

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost:5432/inventory_db")
engine = create_async_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def job_check_and_notify() -> None:
    """Scheduled job to check alerts for critical SKUs and notify Slack."""
    async with SessionLocal() as session:
        # TODO: fetch product_ids from a config table or top-N consumed SKUs; for demo use a fixed UUID list.
        critical_products = [uuid.UUID("00000000-0000-0000-0000-000000000001")]
        for pid in critical_products:
            alerts = await check_alerts(
                session,
                product_id=pid,
                batch_id=None,
                location_id=None,
                min_stock=settings.alerts_min_stock,
                min_coverage_days=settings.alerts_min_coverage_days,
                lookback_days=settings.alerts_lookback_days,
            )
            if alerts and settings.slack_webhook_url:
                await send_slack_alert(str(settings.slack_webhook_url), alerts)
        print(f"[{datetime.utcnow().isoformat()}] Alerts checked.")


def main() -> None:
    scheduler = AsyncIOScheduler()
    # Run every 15 minutes
    scheduler.add_job(job_check_and_notify, CronTrigger(minute="*/15"))
    scheduler.start()
    try:
        asyncio.get_event_loop().run_forever()
    except (KeyboardInterrupt, SystemExit):
        pass


if __name__ == "__main__":
    main()
