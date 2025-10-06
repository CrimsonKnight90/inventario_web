# ============================================================
# Archivo: backend/schemas/categoria.py
# Descripción: Schemas Pydantic para Categoría
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel
from typing import Optional

class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None   # 🔹 coincide con el modelo
    # empresa_id se asigna automáticamente desde current_user
    # empresa_id: int

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    empresa_id: Optional[int] = None

class CategoriaRead(CategoriaBase):
    id: int

    class Config:
        from_attributes = True
