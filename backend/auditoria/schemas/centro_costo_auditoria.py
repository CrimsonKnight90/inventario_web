# ============================================================
# Archivo: backend/auditoria/schemas/centro_costo_auditoria.py
# Descripción: Schemas Pydantic para auditoría de Centros de Costo
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel
from datetime import datetime

class CentroCostoAuditoriaBase(BaseModel):
    cuentacc: str
    usuario_id: int | None = None
    accion: str
    valores_anteriores: dict | None = None
    valores_nuevos: dict | None = None

class CentroCostoAuditoriaCreate(CentroCostoAuditoriaBase):
    pass

class CentroCostoAuditoriaRead(CentroCostoAuditoriaBase):
    id: int
    fecha: datetime

    class Config:
        from_attributes = True
