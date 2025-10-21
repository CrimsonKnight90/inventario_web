from pydantic import BaseModel, EmailStr, Field


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
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
