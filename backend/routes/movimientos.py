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
def crear_movimiento(mov: MovimientoCreate, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == mov.producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # Validar stock en salidas
    if mov.tipo == "salida" and producto.stock < mov.cantidad:
        raise HTTPException(status_code=400, detail="Stock insuficiente para realizar la salida")

    # Ajustar stock
    if mov.tipo == "entrada":
        producto.stock += mov.cantidad
    elif mov.tipo == "salida":
        producto.stock -= mov.cantidad
    else:
        raise HTTPException(status_code=400, detail="Tipo de movimiento inválido (use 'entrada' o 'salida')")

    nuevo = Movimiento(
        **mov.dict(),
        fecha=datetime.utcnow()
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# 🔹 Listar movimientos (cualquier usuario autenticado)
@router.get("/", response_model=list[MovimientoRead])
def listar_movimientos(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    return db.query(Movimiento).all()

# 🔹 Actualizar movimiento (solo admin)
@router.put("/{movimiento_id}", response_model=MovimientoRead, dependencies=[Depends(require_admin)])
def actualizar_movimiento(movimiento_id: int, datos: MovimientoCreate, db: Session = Depends(get_db)):
    movimiento = db.query(Movimiento).filter(Movimiento.id == movimiento_id).first()
    if not movimiento:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")

    producto = db.query(Producto).filter(Producto.id == datos.producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # ⚠️ Nota: actualizar un movimiento histórico puede ser delicado.
    # Aquí se recalcula el stock según el nuevo movimiento.
    if datos.tipo == "salida" and producto.stock < datos.cantidad:
        raise HTTPException(status_code=400, detail="Stock insuficiente para actualizar la salida")

    for key, value in datos.dict().items():
        setattr(movimiento, key, value)
    movimiento.fecha = datetime.utcnow()

    db.commit()
    db.refresh(movimiento)
    return movimiento

# 🔹 Eliminar movimiento (solo admin)
@router.delete("/{movimiento_id}", dependencies=[Depends(require_admin)])
def eliminar_movimiento(movimiento_id: int, db: Session = Depends(get_db)):
    movimiento = db.query(Movimiento).filter(Movimiento.id == movimiento_id).first()
    if not movimiento:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")

    # ⚠️ Nota: eliminar un movimiento no revierte el stock automáticamente.
    # Si quieres que al eliminar se ajuste el stock, habría que recalcularlo.
    db.delete(movimiento)
    db.commit()
    return {"detail": "Movimiento eliminado correctamente"}
