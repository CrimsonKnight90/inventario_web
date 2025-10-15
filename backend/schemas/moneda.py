# ============================================================
# Archivo: backend/schemas/moneda.py
# Descripción: Schemas Pydantic para Monedas
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from backend.i18n.messages import get_message

class MonedaBase(BaseModel):
    nombre: str

    # 🔹 Validación con mensajes traducibles
    @field_validator("nombre")
    def validar_nombre(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_moneda_nombre"))
        return v

class MonedaCreate(MonedaBase):
    pass

class MonedaRead(MonedaBase):
    activo: bool

    class Config:
        from_attributes = True
