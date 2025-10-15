# ============================================================
# Archivo: backend/routes/centros_costo.py
# Descripción: Rutas CRUD para Centros de Costo (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.db.session import get_db
from backend.models.centro_costo import CentroCosto
from backend.schemas.centro_costo import CentroCostoCreate, CentroCostoRead
from backend.security.deps import get_current_user, require_admin
from backend.i18n.messages import get_message

router = APIRouter(prefix="/centros-costo", tags=["Centros de Costo"])

@router.post("/", response_model=CentroCostoRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def crear_centro_costo(payload: CentroCostoCreate, db: Session = Depends(get_db)):
    nuevo = CentroCosto(**payload.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=List[CentroCostoRead])
def listar_centros_costo(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(CentroCosto).all()
