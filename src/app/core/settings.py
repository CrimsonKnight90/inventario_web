from pydantic import BaseSettings, AnyHttpUrl, Field, EmailStr
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # --- App config ---
    app_name: str = Field(default="Enterprise Inventory", description="Human-readable app name")
    slack_webhook_url: Optional[AnyHttpUrl] = Field(
        default=None, description="Slack Incoming Webhook URL for alerts"
    )
    alerts_min_stock: int = Field(default=10, description="Default minimum stock threshold")
    alerts_min_coverage_days: int = Field(default=7, description="Default minimum coverage days")
    alerts_lookback_days: int = Field(default=30, description="Default lookback period for forecast (days)")

    # --- Database config ---
    db_user: str = "postgres"
    db_password: str = "postgres"
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "inventario_db"

    @property
    def database_url(self) -> str:
        """Build async SQLAlchemy URL for asyncpg driver."""
        return (
            f"postgresql+asyncpg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    # --- Security config ---
    jwt_secret: str = Field(default="change-me", description="JWT signing secret")
    jwt_algorithm: str = Field(default="HS256", description="JWT algorithm")
    jwt_access_token_exp_minutes: int = Field(default=30, description="Access token expiry in minutes")

    class Config:
        env_file = ".env"
        env_prefix = "APP_"
        case_sensitive = False


settings = Settings()
