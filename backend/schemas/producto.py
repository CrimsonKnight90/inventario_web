# ============================================================
# Archivo: backend/schemas/producto.py
# Descripción: Schemas Pydantic para Producto
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from backend.i18n.messages import get_message

class ProductoBase(BaseModel):
    """Campos base compartidos por los esquemas de Producto."""
    nombre: str
    descripcion: str | None = None
    precio: float
    categoria_id: int | None = None
    stock: int | None = None  # opcional

    # 🔹 Validaciones con mensajes traducibles
    @field_validator("nombre")
    def validar_nombre(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_producto_nombre"))
        return v

    @field_validator("precio")
    def validar_precio(cls, v):
        if v is None or v <= 0:
            raise ValueError(get_message("invalid_producto_precio"))
        return v

    @field_validator("stock")
    def validar_stock(cls, v):
        if v is not None and v < 0:
            raise ValueError(get_message("invalid_producto_stock"))
        return v

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

    @field_validator("precio")
    def validar_precio(cls, v):
        if v is not None and v <= 0:
            raise ValueError(get_message("invalid_producto_precio"))
        return v

    @field_validator("stock")
    def validar_stock(cls, v):
        if v is not None and v < 0:
            raise ValueError(get_message("invalid_producto_stock"))
        return v

class ProductoRead(ProductoBase):
    """Datos devueltos al leer un producto."""
    id: int

    class Config:
        from_attributes = True
