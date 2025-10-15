# ============================================================
# Archivo: backend/schemas/centro_costo.py
# Descripción: Schemas Pydantic para Centros de Costo (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from backend.i18n.messages import get_message

class CentroCostoBase(BaseModel):
    cuentacc: str
    nomcc: str

    @field_validator("cuentacc")
    def validar_cuentacc(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_cuentacc"))
        return v

    @field_validator("nomcc")
    def validar_nomcc(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_nomcc"))
        return v

class CentroCostoCreate(CentroCostoBase):
    pass

class CentroCostoRead(CentroCostoBase):
    class Config:
        from_attributes = True
