# ============================================================
# Archivo: backend/schemas/consumo.py
# Descripción: Schemas Pydantic para Consumos (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from backend.i18n.messages import get_message

class ConsumoBase(BaseModel):
    actividad_id: int
    cantpers: int

    @field_validator("actividad_id")
    def validar_actividad_id(cls, v):
        if v <= 0:
            raise ValueError(get_message("invalid_actividad_id"))
        return v

    @field_validator("cantpers")
    def validar_cantpers(cls, v):
        if v <= 0:
            raise ValueError(get_message("invalid_cantpers"))
        return v

class ConsumoCreate(ConsumoBase):
    pass

class ConsumoRead(ConsumoBase):
    id: int

    class Config:
        from_attributes = True
