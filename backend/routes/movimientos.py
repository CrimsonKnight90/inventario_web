# ============================================================
# Archivo: backend/routes/movimientos.py
# Descripción: Rutas para gestión de movimientos de inventario (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.db.session import get_db
from backend.models.movimiento import Movimiento
from backend.models.producto import Producto
from backend.schemas.movimiento import MovimientoCreate, MovimientoRead
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message

router = APIRouter(prefix="/movimientos", tags=["Movimientos"])

@router.post("/", response_model=MovimientoRead, dependencies=[Depends(require_admin)])
def crear_movimiento(
    mov: MovimientoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
):
    producto = db.query(Producto).filter(Producto.id == mov.producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail=get_message("producto_no_encontrado", lang))

    if mov.tipo == "salida" and producto.stock < mov.cantidad:
        raise HTTPException(status_code=400, detail=get_message("stock_insuficiente_salida", lang))

    if mov.tipo == "entrada":
        producto.stock += mov.cantidad
    elif mov.tipo == "salida":
        producto.stock -= mov.cantidad
    else:
        raise HTTPException(status_code=400, detail=get_message("movimiento_tipo_invalido", lang))

    nuevo = Movimiento(**mov.dict(), fecha=datetime.utcnow())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    db.refresh(producto)
    return nuevo

@router.get("/", response_model=list[MovimientoRead])
def listar_movimientos(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    return db.query(Movimiento).all()

@router.put("/{movimiento_id}", response_model=MovimientoRead, dependencies=[Depends(require_admin)])
def actualizar_movimiento(
    movimiento_id: int,
    datos: MovimientoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
):
    movimiento = db.query(Movimiento).filter(Movimiento.id == movimiento_id).first()
    if not movimiento:
        raise HTTPException(status_code=404, detail=get_message("movimiento_no_encontrado", lang))

    prev_producto = db.query(Producto).filter(Producto.id == movimiento.producto_id).first()
    if not prev_producto:
        raise HTTPException(status_code=404, detail=get_message("producto_original_no_encontrado", lang))

    new_producto = db.query(Producto).filter(Producto.id == datos.producto_id).first()
    if not new_producto:
        raise HTTPException(status_code=404, detail=get_message("producto_nuevo_no_encontrado", lang))

    if movimiento.tipo == "entrada":
        prev_producto.stock -= movimiento.cantidad
    elif movimiento.tipo == "salida":
        prev_producto.stock += movimiento.cantidad

    if datos.tipo == "entrada":
        new_producto.stock += datos.cantidad
    elif datos.tipo == "salida":
        if new_producto.stock < datos.cantidad:
            raise HTTPException(status_code=400, detail=get_message("stock_insuficiente_actualizar", lang))
        new_producto.stock -= datos.cantidad
    else:
        raise HTTPException(status_code=400, detail=get_message("movimiento_tipo_invalido", lang))

    movimiento.tipo = datos.tipo
    movimiento.cantidad = datos.cantidad
    movimiento.producto_id = datos.producto_id
    movimiento.fecha = datetime.utcnow()

    db.commit()
    db.refresh(movimiento)
    db.refresh(prev_producto)
    db.refresh(new_producto)
    return movimiento

@router.delete("/{movimiento_id}", dependencies=[Depends(require_admin)])
def eliminar_movimiento(movimiento_id: int, db: Session = Depends(get_db), lang: str = "es"):
    movimiento = db.query(Movimiento).filter(Movimiento.id == movimiento_id).first()
    if not movimiento:
        raise HTTPException(status_code=404, detail=get_message("movimiento_no_encontrado", lang))

    producto = db.query(Producto).filter(Producto.id == movimiento.producto_id).first()
    if producto:
        if movimiento.tipo == "entrada":
            producto.stock -= movimiento.cantidad
        elif movimiento.tipo == "salida":
            producto.stock += movimiento.cantidad

    db.delete(movimiento)
    db.commit()
    return {"detail": get_message("movimiento_eliminado_ok", lang)}
