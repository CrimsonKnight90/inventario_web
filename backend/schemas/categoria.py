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
    descripcion: Optional[str] = None   # 🔹 coincide con el modelo

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
    empresa_id: Optional[int] = None

    @field_validator("nombre")
    def validar_nombre(cls, v):
        if v is not None and not v.strip():
            raise ValueError(get_message("invalid_categoria_nombre"))
        return v

class CategoriaRead(CategoriaBase):
    id: int

    class Config:
        from_attributes = True
