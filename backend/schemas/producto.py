# ============================================================
# Archivo: backend/schemas/producto.py
# Descripción: Schemas Pydantic para Producto
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel

class ProductoBase(BaseModel):
    """Campos base compartidos por los esquemas de Producto."""
    nombre: str
    descripcion: str | None = None
    precio: float
    categoria_id: int | None = None
    empresa_id: int
    stock: int | None = None  # opcional

class ProductoCreate(ProductoBase):
    """Datos necesarios para crear un producto."""
    pass

class ProductoUpdate(BaseModel):
    """
    Datos opcionales para actualizar un producto.
    Todos los campos son opcionales para permitir actualizaciones parciales.
    """
    nombre: str | None = None
    descripcion: str | None = None
    precio: float | None = None
    categoria_id: int | None = None
    stock: int | None = None

class ProductoRead(ProductoBase):
    """Datos devueltos al leer un producto."""
    id: int
    empresa_id: int  # visible en lectura

    class Config:
        from_attributes = True
