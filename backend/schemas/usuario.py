from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioRead(UsuarioBase):
    id: int

    class Config:
        from_attributes = True
