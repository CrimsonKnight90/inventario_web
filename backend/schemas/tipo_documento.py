# ============================================================
# Archivo: backend/schemas/tipo_documento.py
# Descripción: Schemas Pydantic para Tipos de Documento
# Autor: CrimsonKnight90
# ============================================================

from typing import Optional
from pydantic import BaseModel, field_validator
from backend.i18n.messages import get_message

class TipoDocumentoBase(BaseModel):
    clave: str
    nombre: str
    factor: int = 1

    @field_validator("clave")
    def validar_clave(cls, v):
        if not v.isalpha() or not v.isupper():
            raise ValueError(get_message("invalid_clave"))
        return v

    @field_validator("factor")
    def validar_factor(cls, v):
        if v not in (-1, 1):
            raise ValueError(get_message("invalid_factor"))
        return v

class TipoDocumentoCreate(TipoDocumentoBase):
    pass

# Lectura incluye 'activo' para que el frontend pinte bien el estado
class TipoDocumentoRead(TipoDocumentoBase):
    activo: bool

    class Config:
        from_attributes = True

# Schema flexible para reactivación (acepta payload parcial)
class TipoDocumentoReactivar(BaseModel):
    clave: str
    nombre: Optional[str] = None
    factor: Optional[int] = None

    @field_validator("clave")
    def validar_clave(cls, v):
        if not v.isalpha() or not v.isupper():
            raise ValueError(get_message("invalid_clave"))
        return v

    @field_validator("factor")
    def validar_factor(cls, v):
        if v is None:
            return v
        if v not in (-1, 1):
            raise ValueError(get_message("invalid_factor"))
        return v
