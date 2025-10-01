from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.producto import Producto
from backend.schemas.producto import ProductoCreate, ProductoRead

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.post("/", response_model=ProductoRead)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    nuevo = Producto(**producto.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=list[ProductoRead])
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()
