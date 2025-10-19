# // ============================================================
# // Archivo: backend/schemas/contraparte.py
# // Descripción: Schemas Pydantic para Contrapartes (con i18n y validaciones de formato)
# // Autor: CrimsonKnight90
# // ============================================================

from pydantic import BaseModel, field_validator
import re
from backend.i18n.messages import get_message

class ContraparteBase(BaseModel):
    cuentacont: str
    nomcont: str

    @field_validator("cuentacont")
    def validar_cuentacont(cls, v):
        if not re.match(r"^\d{3}-\d{2}-\d{2}-\d{2}$", v):
            raise ValueError(get_message("invalid_cuentacont"))
        return v

    @field_validator("nomcont")
    def validar_nomcont(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_nomcont"))
        return v

class ContraparteCreate(ContraparteBase):
    pass

class ContraparteUpdate(BaseModel):
    nomcont: str | None = None

    @field_validator("nomcont")
    def validar_nomcont(cls, v):
        if v is not None and not v.strip():
            raise ValueError(get_message("invalid_nomcont"))
        return v

class ContraparteRead(ContraparteBase):
    activo: bool = True

    class Config:
        from_attributes = True
