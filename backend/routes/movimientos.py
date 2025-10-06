# ============================================================
# Archivo: backend/routes/movimientos.py
# Descripción: Rutas para gestión de movimientos de inventario.
#              Incluye creación, listado, actualización y eliminación,
#              con impacto directo en el stock de productos.
# Autor: CrimsonKnight90
# Tecnologías: FastAPI, SQLAlchemy, Alembic
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

router = APIRouter(prefix="/movimientos", tags=["Movimientos"])


# 🔹 Crear movimiento (solo admin)
@router.post("/", response_model=MovimientoRead, dependencies=[Depends(require_admin)])
def crear_movimiento(
    mov: MovimientoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    producto = db.query(Producto).filter(Producto.id == mov.producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if producto.empresa_id != current_user.empresa_id:
        raise HTTPException(status_code=403, detail="No puede mover stock de otra empresa")

    if mov.tipo == "salida" and producto.stock < mov.cantidad:
        raise HTTPException(status_code=400, detail="Stock insuficiente para realizar la salida")

    if mov.tipo == "entrada":
        producto.stock += mov.cantidad
    elif mov.tipo == "salida":
        producto.stock -= mov.cantidad
    else:
        raise HTTPException(status_code=400, detail="Tipo de movimiento inválido (use 'entrada' o 'salida')")

    nuevo = Movimiento(**mov.dict(), fecha=datetime.utcnow())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    db.refresh(producto)
    return nuevo



# 🔹 Listar movimientos (cualquier usuario autenticado)
@router.get("/", response_model=list[MovimientoRead])
def listar_movimientos(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    """
    Lista todos los movimientos registrados en el sistema.
    """
    return db.query(Movimiento).all()


# 🔹 Actualizar movimiento (solo admin)
@router.put("/{movimiento_id}", response_model=MovimientoRead, dependencies=[Depends(require_admin)])
def actualizar_movimiento(
    movimiento_id: int,
    datos: MovimientoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    movimiento = db.query(Movimiento).filter(Movimiento.id == movimiento_id).first()
    if not movimiento:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")

    prev_producto = db.query(Producto).filter(Producto.id == movimiento.producto_id).first()
    if not prev_producto:
        raise HTTPException(status_code=404, detail="Producto original no encontrado")

    new_producto = db.query(Producto).filter(Producto.id == datos.producto_id).first()
    if not new_producto:
        raise HTTPException(status_code=404, detail="Producto nuevo no encontrado")

    # Validar empresa en ambos
    if prev_producto.empresa_id != current_user.empresa_id or new_producto.empresa_id != current_user.empresa_id:
        raise HTTPException(status_code=403, detail="Movimiento entre productos de otra empresa no permitido")

    # Revertir impacto anterior en el producto original
    if movimiento.tipo == "entrada":
        prev_producto.stock -= movimiento.cantidad
    elif movimiento.tipo == "salida":
        prev_producto.stock += movimiento.cantidad

    # Aplicar nuevo impacto en el producto nuevo
    if datos.tipo == "entrada":
        new_producto.stock += datos.cantidad
    elif datos.tipo == "salida":
        if new_producto.stock < datos.cantidad:
            raise HTTPException(status_code=400, detail="Stock insuficiente para actualizar la salida")
        new_producto.stock -= datos.cantidad
    else:
        raise HTTPException(status_code=400, detail="Tipo de movimiento inválido (use 'entrada' o 'salida')")

    # Actualizar registro del movimiento (incluyendo cambio de producto)
    movimiento.tipo = datos.tipo
    movimiento.cantidad = datos.cantidad
    movimiento.producto_id = datos.producto_id
    movimiento.fecha = datetime.utcnow()

    db.commit()
    db.refresh(movimiento)
    db.refresh(prev_producto)
    db.refresh(new_producto)
    return movimiento



# 🔹 Eliminar movimiento (solo admin)
@router.delete("/{movimiento_id}", dependencies=[Depends(require_admin)])
def eliminar_movimiento(movimiento_id: int, db: Session = Depends(get_db)):
    """
    Elimina un movimiento y revierte su impacto en el stock del producto asociado.
    """
    movimiento = db.query(Movimiento).filter(Movimiento.id == movimiento_id).first()
    if not movimiento:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")

    producto = db.query(Producto).filter(Producto.id == movimiento.producto_id).first()
    if producto:
        if movimiento.tipo == "entrada":
            producto.stock -= movimiento.cantidad
        elif movimiento.tipo == "salida":
            producto.stock += movimiento.cantidad

    db.delete(movimiento)
    db.commit()
    return {"detail": "Movimiento eliminado y stock revertido"}
