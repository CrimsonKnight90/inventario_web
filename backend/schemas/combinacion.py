# ============================================================
# Archivo: backend/schemas/combinacion.py
# Descripción: Schemas Pydantic para Combinaciones (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from backend.i18n.messages import get_message

class CombinacionBase(BaseModel):
    cc: str
    cont: str
    cl: str

    @field_validator("cc")
    def validar_cc(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_cc"))
        return v

    @field_validator("cont")
    def validar_cont(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_cont"))
        return v

    @field_validator("cl")
    def validar_cl(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_cl"))
        return v

class CombinacionCreate(CombinacionBase):
    pass

class CombinacionRead(CombinacionBase):
    class Config:
        from_attributes = True
