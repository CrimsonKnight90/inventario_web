from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.usuario import Usuario
from backend.schemas.usuario import UsuarioCreate, UsuarioRead

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.post("/", response_model=UsuarioRead)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    nuevo = Usuario(**usuario.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=list[UsuarioRead])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()
