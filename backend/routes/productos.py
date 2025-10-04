from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.producto import Producto
from backend.schemas.producto import ProductoCreate, ProductoRead
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario

router = APIRouter(prefix="/productos", tags=["Productos"])

# 🔹 Crear producto (solo admin)
@router.post("/", response_model=ProductoRead, dependencies=[Depends(require_admin)])
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    # Validar duplicados por nombre dentro de la misma empresa
    existente = db.query(Producto).filter(
        Producto.nombre == producto.nombre,
        Producto.empresa_id == producto.empresa_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe un producto con ese nombre en la empresa")

    # Validar precio y stock positivos
    if producto.precio < 0 or producto.stock < 0:
        raise HTTPException(status_code=400, detail="Precio y stock deben ser valores positivos")

    nuevo = Producto(**producto.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# 🔹 Listar productos (cualquier usuario autenticado)
@router.get("/", response_model=list[ProductoRead])
def listar_productos(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    return db.query(Producto).all()

# 🔹 Actualizar producto (solo admin)
@router.put("/{producto_id}", response_model=ProductoRead, dependencies=[Depends(require_admin)])
def actualizar_producto(producto_id: int, datos: ProductoCreate, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # Validar duplicados (si cambia el nombre)
    existente = db.query(Producto).filter(
        Producto.nombre == datos.nombre,
        Producto.empresa_id == datos.empresa_id,
        Producto.id != producto_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe otro producto con ese nombre en la empresa")

    # Validar precio y stock positivos
    if datos.precio < 0 or datos.stock < 0:
        raise HTTPException(status_code=400, detail="Precio y stock deben ser valores positivos")

    for key, value in datos.dict().items():
        setattr(producto, key, value)
    db.commit()
    db.refresh(producto)
    return producto

# 🔹 Eliminar producto (solo admin)
@router.delete("/{producto_id}", dependencies=[Depends(require_admin)])
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(producto)
    db.commit()
    return {"detail": "Producto eliminado correctamente"}
