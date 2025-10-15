# ============================================================
# Archivo: backend/routes/proveedores.py
# Descripción: Rutas CRUD para Proveedores (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.db.session import get_db
from backend.models.proveedor import Proveedor
from backend.schemas.proveedor import ProveedorCreate, ProveedorRead
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])

@router.post("/", response_model=ProveedorRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def crear_proveedor(payload: ProveedorCreate, db: Session = Depends(get_db)):
    nuevo = Proveedor(**payload.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=List[ProveedorRead])
def listar_proveedores(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return db.query(Proveedor).all()

@router.put("/{proveedor_id}", response_model=ProveedorRead, dependencies=[Depends(require_admin)])
def actualizar_proveedor(proveedor_id: int, payload: ProveedorCreate, db: Session = Depends(get_db), lang: str = "es"):
    proveedor = db.query(Proveedor).get(proveedor_id)
    if not proveedor:
        raise HTTPException(status_code=404, detail=get_message("proveedor_no_encontrado", lang))
    for k, v in payload.dict().items():
        setattr(proveedor, k, v)
    db.commit()
    db.refresh(proveedor)
    return proveedor

@router.delete("/{proveedor_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def eliminar_proveedor(proveedor_id: int, db: Session = Depends(get_db), lang: str = "es"):
    proveedor = db.query(Proveedor).get(proveedor_id)
    if not proveedor:
        raise HTTPException(status_code=404, detail=get_message("proveedor_no_encontrado", lang))
    db.delete(proveedor)
    db.commit()
    return None
