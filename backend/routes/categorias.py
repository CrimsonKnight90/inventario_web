from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.categoria import Categoria
from backend.schemas.categoria import CategoriaCreate, CategoriaRead

router = APIRouter(prefix="/categorias", tags=["Categorías"])

@router.post("/", response_model=CategoriaRead)
def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    nueva = Categoria(**categoria.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/", response_model=list[CategoriaRead])
def listar_categorias(db: Session = Depends(get_db)):
    return db.query(Categoria).all()
