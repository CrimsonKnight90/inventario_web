# ============================================================
# Archivo: backend/schemas/empresa.py
# Descripción: Schemas Pydantic para Empresa
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel
from typing import List, Optional
from backend.schemas.usuario import UsuarioRead  # ✅ importamos el schema de usuario

class EmpresaBase(BaseModel):
    nombre: str
    direccion: Optional[str] = None
    telefono: Optional[str] = None

class EmpresaCreate(EmpresaBase):
    pass

class EmpresaRead(EmpresaBase):
    id: int
    usuarios: List[UsuarioRead] = []  # ✅ lista de usuarios asociados

    class Config:
        from_attributes = True
