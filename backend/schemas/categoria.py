# ============================================================
# Archivo: backend/schemas/categoria.py
# Descripción: Schemas Pydantic para Categoría
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel

class CategoriaBase(BaseModel):
    nombre: str
    empresa_id: int

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaRead(CategoriaBase):
    id: int

    class Config:
        from_attributes = True
