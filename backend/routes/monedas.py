# ============================================================
# Archivo: backend/routes/monedas.py
# Descripción: Rutas CRUD para Monedas (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.db.session import get_db
from backend.models.moneda import Moneda
from backend.schemas.moneda import MonedaCreate, MonedaRead
from backend.security.deps import get_current_user, require_admin
from backend.i18n.messages import get_message

router = APIRouter(prefix="/monedas", tags=["Monedas"])

@router.post("/", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def crear_moneda(payload: MonedaCreate, db: Session = Depends(get_db), lang: str = "es"):
    existente = db.query(Moneda).filter(Moneda.nombre == payload.nombre).first()
    if existente:
        if not existente.activo:
            existente.activo = True
            db.commit()
            db.refresh(existente)
            return {"status": "reactivated", "data": existente}
        raise HTTPException(status_code=400, detail=get_message("moneda_existente_activa", lang))
    nueva = Moneda(**payload.dict(), activo=True)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return {"status": "created", "data": nueva}

@router.get("/", response_model=List[MonedaRead])
def listar_monedas(
    incluir_inactivos: Optional[bool] = Query(False, description="Incluir registros inactivos"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(Moneda)
    if not incluir_inactivos:
        query = query.filter(Moneda.activo == True)
    return query.order_by(Moneda.nombre.asc()).all()

@router.patch("/{nombre}/desactivar", status_code=status.HTTP_200_OK, dependencies=[Depends(require_admin)])
def desactivar_moneda(nombre: str, db: Session = Depends(get_db), lang: str = "es"):
    moneda = db.query(Moneda).filter(Moneda.nombre == nombre).first()
    if not moneda:
        raise HTTPException(status_code=404, detail=get_message("moneda_no_encontrada", lang))
    if not moneda.activo:
        return {"detail": get_message("moneda_ya_desactivada", lang).format(nombre=nombre)}
    moneda.activo = False
    db.commit()
    return {"detail": get_message("moneda_desactivada_ok", lang).format(nombre=nombre)}

@router.patch("/{nombre}/reactivar", status_code=status.HTTP_200_OK, dependencies=[Depends(require_admin)])
def reactivar_moneda(nombre: str, db: Session = Depends(get_db), lang: str = "es"):
    moneda = db.query(Moneda).filter(Moneda.nombre == nombre).first()
    if not moneda:
        raise HTTPException(status_code=404, detail=get_message("moneda_no_encontrada", lang))
    if moneda.activo:
        return {"detail": get_message("moneda_ya_activa", lang).format(nombre=nombre)}
    moneda.activo = True
    db.commit()
    db.refresh(moneda)
    return {"status": "reactivated", "data": moneda}
