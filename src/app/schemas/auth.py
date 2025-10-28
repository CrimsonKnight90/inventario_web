# src/app/schemas/auth.py

from pydantic import BaseModel, EmailStr, Field
from src.app.schemas.user import UserRead  # mantiene coherencia con UserRead existente


class LoginRequest(BaseModel):
    """Login payload."""
    username: str = Field(min_length=3, max_length=64)
    password: str = Field(min_length=6, max_length=128)


class SignupRequest(BaseModel):
    """Signup payload (admin-only in production)."""
    username: str = Field(min_length=3, max_length=64)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    active: bool = True


class TokenResponse(BaseModel):
    """JWT token response, alineado con el frontend."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int | None = None
    refresh_token: str | None = None
    user: UserRead | None = None
