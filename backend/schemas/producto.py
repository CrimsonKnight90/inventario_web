# ============================================================
# Archivo: backend/schemas/producto.py
# Descripción: Schemas Pydantic para Producto
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator, model_validator
from backend.i18n.messages import get_message
from backend.schemas.categoria import CategoriaRead
from backend.schemas.um import UMRead
from backend.schemas.moneda import MonedaRead


class ProductoBase(BaseModel):
    nombre: str
    descripcion: str | None = None
    categoria_id: int | None = None
    um_id: str
    moneda_id: str
    existencia_min: float
    existencia_max: float

    @field_validator("nombre")
    def validar_nombre(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_producto_nombre"))
        return v

    @model_validator(mode="after")
    def validar_existencias(cls, values):
        min_val = values.existencia_min
        max_val = values.existencia_max
        if max_val is None or max_val <= 0:
            raise ValueError(get_message("invalid_producto_existencia_max"))
        if min_val is not None and max_val < min_val:
            raise ValueError(get_message("invalid_producto_existencias"))
        return values


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    categoria_id: int | None = None
    um_id: str | None = None
    moneda_id: str | None = None
    existencia_min: float | None = None
    existencia_max: float | None = None

    @model_validator(mode="after")
    def validar_existencias(cls, values):
        min_val = values.existencia_min
        max_val = values.existencia_max
        if max_val is not None and min_val is not None and max_val < min_val:
            raise ValueError(get_message("invalid_producto_existencias"))
        return values


class ProductoRead(ProductoBase):
    id: int
    activo: bool = True
    categoria: CategoriaRead | None = None
    um: UMRead | None = None
    moneda: MonedaRead | None = None

    class Config:
        from_attributes = True
