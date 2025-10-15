# ============================================================
# Archivo: backend/schemas/contraparte.py
# Descripción: Schemas Pydantic para Contrapartes (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from backend.i18n.messages import get_message

class ContraparteBase(BaseModel):
    cuentacont: int
    nomcont: str

    @field_validator("cuentacont")
    def validar_cuentacont(cls, v):
        if v <= 0:
            raise ValueError(get_message("invalid_cuentacont"))
        return v

    @field_validator("nomcont")
    def validar_nomcont(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_nomcont"))
        return v

class ContraparteCreate(ContraparteBase):
    pass

class ContraparteRead(ContraparteBase):
    class Config:
        from_attributes = True
