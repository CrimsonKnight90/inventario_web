# ============================================================
# Archivo: backend/schemas/proveedor.py
# Descripción: Schemas Pydantic para Proveedores con validaciones e i18n
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from backend.i18n.messages import get_message

class ProveedorBase(BaseModel):
    nombre: str

    @field_validator("nombre")
    def validar_nombre(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_proveedor_nombre"))
        return v

class ProveedorCreate(ProveedorBase):
    """Datos necesarios para crear un proveedor."""
    pass

class ProveedorUpdate(BaseModel):
    nombre: str | None = None

    @field_validator("nombre")
    def validar_nombre(cls, v):
        if v is not None and not v.strip():
            raise ValueError(get_message("invalid_proveedor_nombre"))
        return v

class ProveedorRead(ProveedorBase):
    id: int
    activo: bool = True

    class Config:
        from_attributes = True
