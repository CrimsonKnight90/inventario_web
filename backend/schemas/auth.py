# ============================================================
# Archivo: backend/schemas/auth.py
# Descripción: Schemas Pydantic para autenticación y perfil
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, EmailStr

# 🔹 Respuesta estándar de OAuth2
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# 🔹 Datos que se extraen del token JWT
class TokenData(BaseModel):
    user_id: int
    email: EmailStr
    role: str

# 🔹 Respuesta de login (idéntica a Token, pero más explícita)
class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# 🔹 Perfil del usuario autenticado (para /auth/me)
class UserProfile(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True
