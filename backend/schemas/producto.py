from pydantic import BaseModel

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str | None = None
    precio: float
    categoria_id: int | None = None

class ProductoCreate(ProductoBase):
    pass

class ProductoRead(ProductoBase):
    id: int

    class Config:
        orm_mode = True
