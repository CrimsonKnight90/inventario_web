# ============================================================
# Archivo: backend/schemas/producto.py
# Descripción: Schemas Pydantic para Producto
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str | None = None
    precio: float
    categoria_id: int | None = None
    empresa_id: int
    stock: int

class ProductoCreate(ProductoBase):
    """Datos necesarios para crear/actualizar un producto."""
    pass

class ProductoRead(ProductoBase):
    id: int

    class Config:
        from_attributes = True
