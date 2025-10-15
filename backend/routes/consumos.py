# ============================================================
# Archivo: backend/routes/consumos.py
# Descripción: Rutas CRUD para Consumos (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.db.session import get_db
from backend.models.consumo import Consumo
from backend.schemas.consumo import ConsumoCreate, ConsumoRead
from backend.security.deps import get_current_user, require_admin
from backend.i18n.messages import get_message

router = APIRouter(prefix="/consumos", tags=["Consumos"])

@router.post("/", response_model=ConsumoRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def crear_consumo(payload: ConsumoCreate, db: Session = Depends(get_db)):
    nuevo = Consumo(**payload.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=List[ConsumoRead])
def listar_consumos(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Consumo).all()
