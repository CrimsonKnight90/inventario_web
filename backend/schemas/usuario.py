# ============================================================
# Archivo: backend/schemas/usuario.py
# Descripción: Schemas Pydantic para Usuario
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    password: str
    role: str
    empresa_id: int

class UsuarioRead(UsuarioBase):
    id: int
    role: str
    empresa_id: int

    class Config:
        from_attributes = True
