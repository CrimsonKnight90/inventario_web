# // ============================================================
# // Archivo: backend/auditoria/schemas/contraparte_auditoria.py
# // Descripción: Schemas Pydantic para auditoría de contrapartes
# // Autor: CrimsonKnight90
# // ============================================================

from pydantic import BaseModel
from datetime import datetime

class ContraparteAuditoriaBase(BaseModel):
    cuentacont: str
    usuario_id: int | None = None
    accion: str
    valores_anteriores: dict | None = None
    valores_nuevos: dict | None = None

class ContraparteAuditoriaCreate(ContraparteAuditoriaBase):
    pass

class ContraparteAuditoriaRead(ContraparteAuditoriaBase):
    id: int
    fecha: datetime

    class Config:
        from_attributes = True
