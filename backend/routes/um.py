# ============================================================
# Archivo: backend/routes/um.py
# Descripción: Rutas CRUD para UM (activación/desactivación) con i18n
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.db.session import get_db
from backend.models.um import UM
from backend.schemas.um import UMCreate, UMRead
from backend.security.deps import get_current_user, require_admin
from backend.i18n.messages import get_message

router = APIRouter(prefix="/um", tags=["Unidades de Medida"])

@router.post("/", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def crear_um(payload: UMCreate, db: Session = Depends(get_db), lang: str = "es"):
    existente = db.query(UM).filter(UM.um == payload.um).first()
    if existente:
        if not existente.activo:
            existente.activo = True
            db.commit()
            db.refresh(existente)
            return {"status": "reactivated", "data": existente}
        raise HTTPException(status_code=400, detail=get_message("um_existente_activa", lang))
    nueva = UM(**payload.dict(), activo=True)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return {"status": "created", "data": nueva}

@router.get("/", response_model=List[UMRead])
def listar_um(
    incluir_inactivos: Optional[bool] = Query(False, description="Incluir registros inactivos"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(UM)
    if not incluir_inactivos:
        query = query.filter(UM.activo == True)
    return query.order_by(UM.um.asc()).all()

@router.patch("/{um_id}/desactivar", status_code=status.HTTP_200_OK, dependencies=[Depends(require_admin)])
def desactivar_um(um_id: str, db: Session = Depends(get_db), lang: str = "es"):
    um = db.query(UM).filter(UM.um == um_id).first()
    if not um:
        raise HTTPException(status_code=404, detail=get_message("um_no_encontrada", lang))
    if not um.activo:
        return {"detail": get_message("um_ya_desactivada", lang).format(um_id=um_id)}
    um.activo = False
    db.commit()
    return {"detail": get_message("um_desactivada_ok", lang).format(um_id=um_id)}

@router.patch("/{um_id}/reactivar", status_code=status.HTTP_200_OK, dependencies=[Depends(require_admin)])
def reactivar_um(um_id: str, db: Session = Depends(get_db), lang: str = "es"):
    um = db.query(UM).filter(UM.um == um_id).first()
    if not um:
        raise HTTPException(status_code=404, detail=get_message("um_no_encontrada", lang))
    if um.activo:
        return {"detail": get_message("um_ya_activa", lang).format(um_id=um_id)}
    um.activo = True
    db.commit()
    db.refresh(um)
    return {"status": "reactivated", "data": um}
