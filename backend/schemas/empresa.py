from pydantic import BaseModel

class EmpresaBase(BaseModel):
    nombre: str
    direccion: str | None = None
    telefono: str | None = None

class EmpresaCreate(EmpresaBase):
    pass

class EmpresaRead(EmpresaBase):
    id: int

    class Config:
        from_attributes = True
