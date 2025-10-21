from pydantic import BaseSettings, AnyHttpUrl, Field
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    app_name: str = Field(default="Enterprise Inventory", description="Human-readable app name")
    slack_webhook_url: Optional[AnyHttpUrl] = Field(
        default=None, description="Slack Incoming Webhook URL for alerts"
    )
    alerts_min_stock: int = Field(default=10, description="Default minimum stock threshold")
    alerts_min_coverage_days: int = Field(default=7, description="Default minimum coverage days")
    alerts_lookback_days: int = Field(default=30, description="Default lookback period for forecast (days)")

    class Config:
        env_prefix = "APP_"
        case_sensitive = False


settings = Settings()
