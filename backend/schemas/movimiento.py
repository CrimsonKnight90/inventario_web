# ============================================================
# Archivo: backend/schemas/movimiento.py
# Descripción: Schemas Pydantic para Movimientos de inventario
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from datetime import datetime
from backend.i18n.messages import get_message

class MovimientoBase(BaseModel):
    tipo: str        # "entrada" o "salida"
    cantidad: int
    producto_id: int

    # 🔹 Validación de tipo
    @field_validator("tipo")
    def validar_tipo(cls, v):
        if v not in ("entrada", "salida"):
            raise ValueError(get_message("invalid_movimiento_tipo"))
        return v

    # 🔹 Validación de cantidad
    @field_validator("cantidad")
    def validar_cantidad(cls, v):
        if v <= 0:
            raise ValueError(get_message("invalid_movimiento_cantidad"))
        return v

class MovimientoCreate(MovimientoBase):
    pass

class MovimientoRead(MovimientoBase):
    id: int
    fecha: datetime

    class Config:
        from_attributes = True
