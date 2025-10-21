from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseSettings, Field


class SecuritySettings(BaseSettings):
    """JWT and security settings."""
    jwt_secret: str = Field(default="change-me", description="JWT signing secret")
    jwt_algorithm: str = Field(default="HS256", description="JWT algorithm")
    jwt_access_token_exp_minutes: int = Field(default=30, description="Access token expiry in minutes")

    class Config:
        env_prefix = "APP_"
        case_sensitive = False


security_settings = SecuritySettings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(subject: str, claims: Optional[Dict[str, Any]] = None) -> str:
    """Create a JWT access token.

    Args:
        subject: The subject (user ID or username).
        claims: Extra claims to include (e.g., roles, scopes).

    Returns:
        Encoded JWT string.
    """
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=security_settings.jwt_access_token_exp_minutes)
    payload: Dict[str, Any] = {"sub": subject, "iat": int(now.timestamp()), "exp": int(expire.timestamp())}
    if claims:
        payload.update(claims)
    return jwt.encode(payload, security_settings.jwt_secret, algorithm=security_settings.jwt_algorithm)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Verify a plaintext password against a hash."""
    return pwd_context.verify(plain_password, password_hash)


def hash_password(plain_password: str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(plain_password)
