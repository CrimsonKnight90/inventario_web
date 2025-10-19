# ============================================================
# Archivo: backend/routes/proveedores.py
# Descripción: Rutas CRUD para Proveedores con validaciones, soft delete, filtros y i18n
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.db.session import get_db
from backend.models.proveedor import Proveedor
from backend.schemas.proveedor import ProveedorCreate, ProveedorRead, ProveedorUpdate
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])

@router.post("/", response_model=ProveedorRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def crear_proveedor(
    payload: ProveedorCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
):
    existente = db.query(Proveedor).filter(Proveedor.nombre == payload.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail=get_message("proveedor_existente", lang))

    nuevo = Proveedor(nombre=payload.nombre, activo=True)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=List[ProveedorRead])
def listar_proveedores(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    incluir_inactivos: bool = Query(False, description="Incluir proveedores inactivos"),
    q: Optional[str] = Query(None, description="Buscar por nombre (contiene)"),
    limit: int = Query(100, ge=1, le=500, description="Número máximo de registros"),
    offset: int = Query(0, ge=0, description="Desplazamiento para paginación"),
):
    query = db.query(Proveedor)
    if not incluir_inactivos:
        query = query.filter(Proveedor.activo == True)
    if q:
        # Búsqueda simple por 'contiene'; para PostgreSQL se puede mejorar con ILIKE
        query = query.filter(Proveedor.nombre.contains(q))
    proveedores = (
        query.order_by(Proveedor.id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return proveedores

@router.put("/{proveedor_id}", response_model=ProveedorRead, dependencies=[Depends(require_admin)])
def actualizar_proveedor(
    proveedor_id: int,
    payload: ProveedorUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
):
    proveedor = db.query(Proveedor).get(proveedor_id)
    if not proveedor:
        raise HTTPException(status_code=404, detail=get_message("proveedor_no_encontrado", lang))

    if payload.nombre and payload.nombre != proveedor.nombre:
        existente = db.query(Proveedor).filter(Proveedor.nombre == payload.nombre, Proveedor.id != proveedor_id).first()
        if existente:
            raise HTTPException(status_code=400, detail=get_message("proveedor_existente", lang))

    for k, v in payload.dict(exclude_unset=True, exclude_none=True).items():
        setattr(proveedor, k, v)

    db.commit()
    db.refresh(proveedor)
    return proveedor

@router.delete("/{proveedor_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def eliminar_proveedor(
    proveedor_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
):
    proveedor = db.query(Proveedor).get(proveedor_id)
    if not proveedor:
        raise HTTPException(status_code=404, detail=get_message("proveedor_no_encontrado", lang))
    db.delete(proveedor)
    db.commit()
    return None

@router.patch("/{proveedor_id}/desactivar", dependencies=[Depends(require_admin)])
def desactivar_proveedor(
    proveedor_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
):
    proveedor = db.query(Proveedor).get(proveedor_id)
    if not proveedor:
        raise HTTPException(status_code=404, detail=get_message("proveedor_no_encontrado", lang))
    if not proveedor.activo:
        return {"detail": get_message("proveedor_ya_desactivado", lang)}

    proveedor.activo = False
    db.commit()
    return {"detail": get_message("proveedor_desactivado_ok", lang)}

@router.patch("/{proveedor_id}/reactivar", dependencies=[Depends(require_admin)])
def reactivar_proveedor(
    proveedor_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
):
    proveedor = db.query(Proveedor).get(proveedor_id)
    if not proveedor:
        raise HTTPException(status_code=404, detail=get_message("proveedor_no_encontrado", lang))
    if proveedor.activo:
        return {"detail": get_message("proveedor_ya_activo", lang)}

    proveedor.activo = True
    db.commit()
    return {"detail": get_message("proveedor_reactivado_ok", lang)}
