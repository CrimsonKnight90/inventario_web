# ============================================================
# Archivo: backend/schemas/usuario.py
# Descripción: Schemas Pydantic para Usuario
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, EmailStr, conint
from typing import Optional, Literal

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    password: str
    role: Literal["empleado", "admin"] = "empleado"  # ✅ restringido
    empresa_id: conint(gt=0)  # ✅ no permite negativos ni cero

class UsuarioRead(UsuarioBase):
    id: int
    role: str
    empresa_id: int
    empresa_nombre: Optional[str] = None  # ✅ ahora opcional con default
    class Config:
        from_attributes = True

class UsuarioUpdateRole(BaseModel):
    role: Literal["empleado", "admin"]  # ✅ restringido

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Literal["empleado", "admin"]] = None
    empresa_id: Optional[conint(gt=0)] = None
