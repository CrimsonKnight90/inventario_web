# ============================================================
# Archivo: backend/schemas/actividad_cerrada.py
# Descripción: Schemas Pydantic para Actividades cerradas (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional
from backend.i18n.messages import get_message

class ActividadCerradaBase(BaseModel):
    codact: Optional[int] = None
    nomact: Optional[str] = None
    fechaini: Optional[datetime] = None
    fechafin: Optional[datetime] = None
    totpers: Optional[int] = 0
    totusd: Optional[int] = 0
    totmn: Optional[int] = 0
    totsm: Optional[int] = 0
    elecusd: Optional[int] = 0
    elecmn: Optional[int] = 0
    salusd: Optional[int] = 0
    salmn: Optional[int] = 0
    transpusd: Optional[int] = 0
    transpmn: Optional[int] = 0
    otrosusd: Optional[int] = 0
    otrosmn: Optional[int] = 0
    porcusd: Optional[int] = 0
    pormn: Optional[int] = 0
    observaciones: Optional[str] = None

    # 🔹 Validaciones con mensajes traducibles
    @field_validator("codact")
    def validar_codact(cls, v):
        if v is not None and v <= 0:
            raise ValueError(get_message("invalid_codact"))
        return v

    @field_validator("nomact")
    def validar_nomact(cls, v):
        if v is not None and not v.strip():
            raise ValueError(get_message("invalid_nomact"))
        return v

    @field_validator("fechafin")
    def validar_fechas(cls, fin, info):
        ini = info.data.get("fechaini")   # 🔹 Pydantic v2 usa info.data
        if ini and fin and fin < ini:
            raise ValueError(get_message("invalid_rango_fechas"))
        return fin

    @field_validator(
        "totpers", "totusd", "totmn", "totsm",
        "elecusd", "elecmn", "salusd", "salmn",
        "transpusd", "transpmn", "otrosusd", "otrosmn",
        "porcusd", "pormn"
    )
    def validar_no_negativos(cls, v, field):
        if v is not None and v < 0:
            raise ValueError(get_message("invalid_monto_no_negativo").format(field=field.name))
        return v

class ActividadCerradaCreate(ActividadCerradaBase):
    pass

class ActividadCerradaRead(ActividadCerradaBase):
    id: int
    model_config = {"from_attributes": True}
