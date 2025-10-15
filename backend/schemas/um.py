# ============================================================
# Archivo: backend/schemas/um.py
# Descripción: Schemas Pydantic para Unidades de Medida
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from backend.i18n.messages import get_message

class UMBase(BaseModel):
    um: str
    factor: int = 1

    # 🔹 Validación de factor con mensajes traducibles
    @field_validator("factor")
    def validar_factor(cls, v):
        if v not in (-1, 1):
            raise ValueError(get_message("invalid_factor"))
        return v

class UMCreate(UMBase):
    pass

class UMRead(UMBase):
    activo: bool

    class Config:
        from_attributes = True
