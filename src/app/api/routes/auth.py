from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.db.session import get_session
from src.app.schemas.auth import TokenResponse
from src.app.core.security import create_access_token
from src.app.services.auth import authenticate_user, signup_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    user = await authenticate_user(session, form_data.username.strip(), form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=user.username)
    return TokenResponse(access_token=token, token_type="bearer")


@router.post("/signup", response_model=TokenResponse)
async def signup(
    payload: dict,
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    try:
        user = await signup_user(session, payload["username"].strip(), payload["email"], payload["password"], payload.get("active", True))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    token = create_access_token(subject=user.username)
    return TokenResponse(access_token=token, token_type="bearer")
