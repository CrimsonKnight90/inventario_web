# ============================================================
# Archivo: backend/security/deps.py
# Descripción: Dependencias de seguridad para FastAPI
# Autor: CrimsonKnight90
# ============================================================

from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.usuario import Usuario
from backend.security.auth import verify_token
from backend.i18n.messages import get_message

# 🔑 Ajustado para que coincida con el prefijo /api definido en main.py
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

def get_current_user(
        request: Request,
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
) -> Usuario:
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=get_message("token_invalid", request.state.lang),
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = int(payload["sub"])
    user = db.get(Usuario, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=get_message("user_not_found", request.state.lang)
        )
    return user

def require_admin(
        request: Request,
        current_user: Usuario = Depends(get_current_user)
) -> Usuario:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=get_message("forbidden", request.state.lang)
        )
    return current_user
