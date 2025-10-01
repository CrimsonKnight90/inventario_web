from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.movimiento import Movimiento
from backend.schemas.movimiento import MovimientoCreate, MovimientoRead

router = APIRouter(prefix="/movimientos", tags=["Movimientos"])

@router.post("/", response_model=MovimientoRead)
def crear_movimiento(mov: MovimientoCreate, db: Session = Depends(get_db)):
    nuevo = Movimiento(**mov.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=list[MovimientoRead])
def listar_movimientos(db: Session = Depends(get_db)):
    return db.query(Movimiento).all()
