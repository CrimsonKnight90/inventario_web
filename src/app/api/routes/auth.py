from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.db.session import get_session
from src.app.schemas.auth import LoginRequest, TokenResponse, SignupRequest
from src.app.core.security import create_access_token
from src.app.services.auth import authenticate_user, signup_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, session: AsyncSession = Depends(get_session)) -> TokenResponse:
    """Obtain JWT token by username and password."""
    user = await authenticate_user(session, payload.username.strip(), payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=user.username)
    return TokenResponse(access_token=token)


@router.post("/signup", response_model=TokenResponse)
async def signup(payload: SignupRequest, session: AsyncSession = Depends(get_session)) -> TokenResponse:
    """Create user and return token (for bootstrap; restrict in production)."""
    try:
        user = await signup_user(session, payload.username.strip(), payload.email, payload.password, payload.active)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    token = create_access_token(subject=user.username)
    return TokenResponse(access_token=token)
