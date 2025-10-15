# ============================================================
# Archivo: backend/schemas/actividad.py
# Descripción: Schemas Pydantic para Actividades (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional
from backend.i18n.messages import get_message

class ActividadBase(BaseModel):
    nomact: str
    fechaini: Optional[datetime] = None
    fechafin: Optional[datetime] = None
    actcerrada: Optional[bool] = False

    # 🔹 Validaciones con mensajes traducibles
    @field_validator("nomact")
    def validar_nomact(cls, v):
        if not v or not v.strip():
            raise ValueError(get_message("invalid_nomact"))
        return v

    @field_validator("fechafin")
    def validar_rango_fechas(cls, fin, values):
        ini = values.get("fechaini")
        if ini and fin and fin < ini:
            raise ValueError(get_message("invalid_rango_fechas"))
        return fin

class ActividadCreate(ActividadBase):
    pass

class ActividadRead(ActividadBase):
    codact: int
    model_config = {"from_attributes": True}
