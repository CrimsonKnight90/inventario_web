# ============================================================
# Archivo: backend/auditoria/schemas/proveedor_auditoria.py
# Descripción: Schemas Pydantic para auditoría de proveedores
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel
from datetime import datetime

class ProveedorAuditoriaBase(BaseModel):
    proveedor_id: int
    usuario_id: int | None = None
    accion: str
    valores_anteriores: dict | None = None
    valores_nuevos: dict | None = None

class ProveedorAuditoriaCreate(ProveedorAuditoriaBase):
    pass

class ProveedorAuditoriaRead(ProveedorAuditoriaBase):
    id: int
    fecha: datetime

    class Config:
        from_attributes = True
