# backend/schemas/actividad_cerrada.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

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

class ActividadCerradaCreate(ActividadCerradaBase):
    pass

class ActividadCerradaRead(ActividadCerradaBase):
    id: int
    model_config = {"from_attributes": True}

