# ============================================================
# Archivo: backend/schemas/usuario.py
# Descripción: Schemas Pydantic para Usuario
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Literal
from backend.i18n.messages import get_message

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    password: str
    role: Literal["empleado", "admin"] = "empleado"  # ✅ restringido

    # 🔹 Validación con mensajes traducibles
    @field_validator("role")
    def validar_role(cls, v):
        if v not in ("empleado", "admin"):
            # Mensaje traducible
            raise ValueError(get_message("invalid_role"))
        return v

class UsuarioRead(UsuarioBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class UsuarioUpdateRole(BaseModel):
    role: Literal["empleado", "admin"]  # ✅ restringido

    @field_validator("role")
    def validar_role(cls, v):
        if v not in ("empleado", "admin"):
            raise ValueError(get_message("invalid_role"))
        return v

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Literal["empleado", "admin"]] = None

    @field_validator("role")
    def validar_role(cls, v):
        if v is not None and v not in ("empleado", "admin"):
            raise ValueError(get_message("invalid_role"))
        return v
