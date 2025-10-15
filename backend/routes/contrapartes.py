# ============================================================
# Archivo: backend/routes/contrapartes.py
# Descripción: Rutas CRUD para Contrapartes contables (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.db.session import get_db
from backend.models.contraparte import Contraparte
from backend.schemas.contraparte import ContraparteCreate, ContraparteRead
from backend.security.deps import get_current_user, require_admin
from backend.i18n.messages import get_message

router = APIRouter(prefix="/contrapartes", tags=["Contrapartes"])

@router.post("/", response_model=ContraparteRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def crear_contraparte(payload: ContraparteCreate, db: Session = Depends(get_db)):
    nueva = Contraparte(**payload.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/", response_model=List[ContraparteRead])
def listar_contrapartes(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Contraparte).all()

@router.delete("/{cuentacont}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def eliminar_contraparte(cuentacont: int, db: Session = Depends(get_db), lang: str = "es"):
    contraparte = db.query(Contraparte).get(cuentacont)
    if not contraparte:
        raise HTTPException(status_code=404, detail=get_message("contraparte_no_encontrada", lang))
    db.delete(contraparte)
    db.commit()
    return None
