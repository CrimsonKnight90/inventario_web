# ============================================================
# Archivo: backend/schemas/centro_costo.py
# Descripción: Schemas Pydantic para Centros de Costo (con i18n y validaciones)
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
import re
from backend.i18n.messages import get_message

class CentroCostoBase(BaseModel):
    cuentacc: str
    nomcc: str

    @field_validator("cuentacc")
    def validar_cuentacc(cls, v):
        if not re.match(r"^\d{3}-\d{2}-\d{2}-\d{2}$", v):
            raise ValueError(get_message("invalid_cuentacc"))
        return v

    @field_validator("nomcc")
    def validar_nomcc(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_nomcc"))
        return v

class CentroCostoCreate(CentroCostoBase):
    pass

class CentroCostoUpdate(BaseModel):
    nomcc: str | None = None

    @field_validator("nomcc")
    def validar_nomcc(cls, v):
        if v is not None and not v.strip():
            raise ValueError(get_message("invalid_nomcc"))
        return v

class CentroCostoRead(CentroCostoBase):
    activo: bool = True

    class Config:
        from_attributes = True
