from pydantic import BaseModel
from datetime import datetime

class MovimientoBase(BaseModel):
    tipo: str        # "entrada" o "salida"
    cantidad: int
    producto_id: int

class MovimientoCreate(MovimientoBase):
    pass

class MovimientoRead(MovimientoBase):
    id: int
    fecha: datetime

    class Config:
        from_attributes = True
