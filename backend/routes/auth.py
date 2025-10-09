# ============================================================
# Archivo: backend/routes/auth.py
# Descripción: Endpoints de autenticación (login y perfil)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.models.usuario import Usuario
from backend.security.auth import create_access_token, verify_password
from backend.security.deps import get_current_user
from backend.schemas.auth import LoginResponse, UserProfile

router = APIRouter(prefix="/auth", tags=["auth"])

# 🔹 Login: devuelve token JWT
@router.post("/token", response_model=LoginResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Buscar usuario por email (OAuth2 usa "username" para el campo)
    user: Usuario | None = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return LoginResponse(access_token=token, token_type="bearer")

# 🔹 Perfil del usuario autenticado
@router.get("/me", response_model=UserProfile)
def perfil(current_user: Usuario = Depends(get_current_user)):
    return UserProfile(
        id=current_user.id,
        nombre=current_user.nombre,
        email=current_user.email,
        role=current_user.role,
        empresa_id=current_user.empresa_id,
    )
