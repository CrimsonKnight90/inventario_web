# ============================================================
# Archivo: backend/auditoria/schemas/producto_auditoria.py
# Descripción: Schemas Pydantic para auditoría de productos
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel
from datetime import datetime

class ProductoAuditoriaBase(BaseModel):
    producto_id: int
    usuario_id: int | None = None
    accion: str
    valores_anteriores: dict | None = None
    valores_nuevos: dict | None = None

class ProductoAuditoriaCreate(ProductoAuditoriaBase):
    pass

class ProductoAuditoriaRead(ProductoAuditoriaBase):
    id: int
    fecha: datetime

    class Config:
        from_attributes = True
