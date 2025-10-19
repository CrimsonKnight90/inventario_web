# ============================================================
# Archivo: backend/routes/centros_costo.py
# Descripción: Rutas CRUD para Centros de Costo con validaciones,
#              soft delete, i18n y auditoría
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from backend.db.session import get_db
from backend.models.centro_costo import CentroCosto
from backend.schemas.centro_costo import CentroCostoCreate, CentroCostoRead, CentroCostoUpdate
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message
from backend.auditoria.utils_centro_costo import registrar_auditoria_centro_costo

router = APIRouter(prefix="/centros-costo", tags=["Centros de Costo"])


# Crear
@router.post("/", response_model=CentroCostoRead, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_admin)])
def crear_centro_costo(
        payload: CentroCostoCreate,
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        lang: str = "es"
):
    existente = db.query(CentroCosto).filter(CentroCosto.cuentacc == payload.cuentacc).first()
    if existente:
        raise HTTPException(
            400,
            detail={
                "code": "centro_costo_existente",
                "message": get_message("centro_costo_existente", lang)
            }
        )

    nuevo = CentroCosto(**payload.dict(), activo=True)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo


# Listar
@router.get("/", response_model=List[CentroCostoRead])
def listar_centros_costo(
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        incluir_inactivos: bool = Query(False, description="Incluir centros de costo inactivos")
):
    query = db.query(CentroCosto)
    if not incluir_inactivos:
        query = query.filter(CentroCosto.activo == True)
    return query.order_by(CentroCosto.cuentacc.asc()).all()


# Actualizar
@router.put("/{cuentacc}", response_model=CentroCostoRead, dependencies=[Depends(require_admin)])
def actualizar_centro_costo(
        cuentacc: str,
        payload: CentroCostoUpdate,
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        lang: str = "es"
):
    centro = db.query(CentroCosto).filter(CentroCosto.cuentacc == cuentacc).first()
    if not centro:
        raise HTTPException(404, detail=get_message("centro_costo_no_encontrado", lang))

    if payload.nomcc and payload.nomcc != centro.nomcc:
        existente = db.query(CentroCosto).filter(CentroCosto.nomcc == payload.nomcc).first()
        if existente:
            raise HTTPException(400, detail=get_message("centro_costo_existente", lang))

    valores_anteriores = {"nomcc": centro.nomcc}

    for k, v in payload.dict(exclude_unset=True, exclude_none=True).items():
        setattr(centro, k, v)

    db.commit()
    db.refresh(centro)

    # 🔹 Auditoría
    registrar_auditoria_centro_costo(
        db=db,
        cuentacc=centro.cuentacc,
        usuario_id=current_user.id,
        accion="actualizar",
        valores_anteriores=valores_anteriores,
        valores_nuevos=payload.dict(exclude_unset=True, exclude_none=True)
    )

    return centro


# Desactivar
@router.patch("/{cuentacc}/desactivar", dependencies=[Depends(require_admin)])
def desactivar_centro_costo(
        cuentacc: str,
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        lang: str = "es"
):
    centro = db.query(CentroCosto).filter(CentroCosto.cuentacc == cuentacc).first()
    if not centro:
        raise HTTPException(404, detail=get_message("centro_costo_no_encontrado", lang))
    if not centro.activo:
        return {"detail": get_message("centro_costo_ya_desactivado", lang)}

    centro.activo = False
    db.commit()

    # 🔹 Auditoría
    registrar_auditoria_centro_costo(
        db=db,
        cuentacc=centro.cuentacc,
        usuario_id=current_user.id,
        accion="desactivar",
        valores_anteriores={"activo": True},
        valores_nuevos={"activo": False}
    )

    return {"detail": get_message("centro_costo_desactivado_ok", lang)}


# Reactivar
@router.patch("/{cuentacc}/reactivar", dependencies=[Depends(require_admin)])
def reactivar_centro_costo(
        cuentacc: str,
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        lang: str = "es"
):
    centro = db.query(CentroCosto).filter(CentroCosto.cuentacc == cuentacc).first()
    if not centro:
        raise HTTPException(404, detail=get_message("centro_costo_no_encontrado", lang))
    if centro.activo:
        return {"detail": get_message("centro_costo_ya_activo", lang)}

    centro.activo = True
    db.commit()

    # 🔹 Auditoría
    registrar_auditoria_centro_costo(
        db=db,
        cuentacc=centro.cuentacc,
        usuario_id=current_user.id,
        accion="reactivar",
        valores_anteriores={"activo": False},
        valores_nuevos={"activo": True}
    )

    return {"detail": get_message("centro_costo_reactivado_ok", lang)}


# Verificar existencia (solo cuentacc, para validación en tiempo real)
@router.get("/check")
def check_centro_costo(
        cuentacc: str = Query(..., description="Cuenta del centro de costo"),
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        lang: str = "es"
):
    """
    Verifica si ya existe un centro de costo con la cuenta indicada.
    Devuelve {"exists": true/false}
    """
    existente = db.query(CentroCosto).filter(CentroCosto.cuentacc == cuentacc).first()
    if existente:
        return {
            "exists": True,
            "field": "cuentacc",
            "message": get_message("centro_costo_existente", lang)
        }
    return {"exists": False}
