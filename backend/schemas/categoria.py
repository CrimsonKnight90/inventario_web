# ============================================================
# Archivo: backend/schemas/categoria.py
# Descripción: Schemas Pydantic para Categoría (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from typing import Optional
from backend.i18n.messages import get_message

class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    activo: Optional[bool] = True   # 🔹 Soft delete

    @field_validator("nombre")
    def validar_nombre(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_categoria_nombre"))
        return v

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = None   # 🔹 Permitir reactivar/desactivar

class CategoriaRead(CategoriaBase):
    id: int
    tieneProductos: bool   # 🔹 Nuevo campo para advertencia en frontend

    class Config:
        from_attributes = True
