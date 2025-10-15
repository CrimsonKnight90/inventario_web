# ============================================================
# Archivo: backend/routes/combinaciones.py
# Descripción: Rutas CRUD para Combinaciones contables (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.db.session import get_db
from backend.models.combinacion import Combinacion
from backend.schemas.combinacion import CombinacionCreate, CombinacionRead
from backend.security.deps import get_current_user, require_admin
from backend.i18n.messages import get_message

router = APIRouter(prefix="/combinaciones", tags=["Combinaciones"])

@router.post("/", response_model=CombinacionRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def crear_combinacion(payload: CombinacionCreate, db: Session = Depends(get_db)):
    nueva = Combinacion(**payload.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/", response_model=List[CombinacionRead])
def listar_combinaciones(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Combinacion).all()

@router.delete("/{cc}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def eliminar_combinacion(cc: str, db: Session = Depends(get_db), lang: str = "es"):
    combinacion = db.query(Combinacion).get(cc)
    if not combinacion:
        raise HTTPException(status_code=404, detail=get_message("combinacion_no_encontrada", lang))
    db.delete(combinacion)
    db.commit()
    return None
