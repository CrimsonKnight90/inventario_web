# ============================================================
# Archivo: backend/routes/productos.py
# Descripción: Rutas de gestión de productos (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.producto import Producto
from backend.schemas.producto import ProductoCreate, ProductoRead, ProductoUpdate
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.post("/", response_model=ProductoRead, dependencies=[Depends(require_admin)])
def crear_producto(
    producto: ProductoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
) -> Producto:
    existente = db.query(Producto).filter(
        Producto.nombre == producto.nombre,
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail=get_message("producto_existente", lang))

    if producto.precio < 0 or producto.stock < 0:
        raise HTTPException(status_code=400, detail=get_message("producto_precio_stock_invalidos", lang))

    nuevo = Producto(
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio=producto.precio,
        stock=producto.stock if producto.stock is not None else 0,
        categoria_id=producto.categoria_id,
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=list[ProductoRead])
def listar_productos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> list[Producto]:
    return db.query(Producto).all()

@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(
    producto_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
) -> Producto:
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail=get_message("producto_no_encontrado", lang))
    return producto

@router.put("/{producto_id}", response_model=ProductoRead, dependencies=[Depends(require_admin)])
def actualizar_producto(
    producto_id: int,
    datos: ProductoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
) -> Producto:
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail=get_message("producto_no_encontrado", lang))

    if datos.nombre and datos.nombre != producto.nombre:
        existente = db.query(Producto).filter(
            Producto.nombre == datos.nombre,
            Producto.empresa_id == current_user.empresa_id,
            Producto.id != producto_id
        ).first()
        if existente:
            raise HTTPException(status_code=400, detail=get_message("producto_existente", lang))

    if datos.precio is not None and datos.precio < 0:
        raise HTTPException(status_code=400, detail=get_message("producto_precio_invalido", lang))
    if datos.stock is not None and datos.stock < 0:
        raise HTTPException(status_code=400, detail=get_message("producto_stock_invalido", lang))

    for key, value in datos.dict(exclude_unset=True, exclude_none=True).items():
        setattr(producto, key, value)

    producto.empresa_id = current_user.empresa_id

    db.commit()
    db.refresh(producto)
    return producto

@router.delete("/{producto_id}", dependencies=[Depends(require_admin)])
def eliminar_producto(
    producto_id: int,
    db: Session = Depends(get_db),
    lang: str = "es"
) -> dict:
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail=get_message("producto_no_encontrado", lang))
    db.delete(producto)
    db.commit()
    return {"detail": get_message("producto_eliminado_ok", lang)}
