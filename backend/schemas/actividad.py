# backend/schemas/actividad.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ActividadBase(BaseModel):
    nomact: str
    fechaini: Optional[datetime] = None
    fechafin: Optional[datetime] = None
    actcerrada: Optional[bool] = False

class ActividadCreate(ActividadBase):
    pass

class ActividadRead(ActividadBase):
    codact: int

    model_config = {"from_attributes": True}

