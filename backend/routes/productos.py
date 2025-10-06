# ============================================================
# Archivo: backend/routes/productos.py
# Descripción: Rutas de gestión de productos (crear, leer, listar,
#              actualizar y eliminar) con seguridad por roles y
#              asignación automática de empresa_id desde el usuario autenticado.
# Autor: CrimsonKnight90
# Tecnologías: FastAPI, SQLAlchemy, Pydantic
# ============================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.producto import Producto
from backend.schemas.producto import ProductoCreate, ProductoRead, ProductoUpdate
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario

router = APIRouter(prefix="/productos", tags=["Productos"])

# ------------------------------------------------------------
# Crear producto (solo admin)
# ------------------------------------------------------------

@router.post("/", response_model=ProductoRead, dependencies=[Depends(require_admin)])
def crear_producto(
    producto: ProductoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Producto:
    """
    Crea un nuevo producto dentro de la empresa del usuario autenticado.
    - Valida duplicados por nombre dentro de la empresa.
    - Valida precio y stock no negativos.
    - Asigna automáticamente empresa_id desde current_user.
    """
    existente = db.query(Producto).filter(
        Producto.nombre == producto.nombre,
        Producto.empresa_id == current_user.empresa_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe un producto con ese nombre en la empresa")

    if producto.precio < 0 or producto.stock < 0:
        raise HTTPException(status_code=400, detail="Precio y stock deben ser valores positivos")

    nuevo = Producto(
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio=producto.precio,
        stock=producto.stock if producto.stock is not None else 0,
        categoria_id=producto.categoria_id,
        empresa_id=current_user.empresa_id
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# ------------------------------------------------------------
# Listar productos (cualquier usuario autenticado)
# ------------------------------------------------------------

@router.get("/", response_model=list[ProductoRead])
def listar_productos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> list[Producto]:
    """
    Lista todos los productos visibles para el usuario autenticado.
    Nota: actualmente devuelve todos los productos; se puede filtrar
    por empresa si se requiere.
    """
    return db.query(Producto).all()

# ------------------------------------------------------------
# Obtener producto por ID (cualquier usuario autenticado)
# ------------------------------------------------------------

@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(
    producto_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Producto:
    """
    Obtiene un producto por su ID.
    - Responde 404 si el producto no existe.
    """
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

# ------------------------------------------------------------
# Actualizar producto (solo admin)
# ------------------------------------------------------------

@router.put("/{producto_id}", response_model=ProductoRead, dependencies=[Depends(require_admin)])
def actualizar_producto(
    producto_id: int,
    datos: ProductoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
) -> Producto:
    """
    Actualiza un producto existente dentro de la empresa del usuario autenticado.
    - Valida duplicados por nombre (antes de aplicar cambios).
    - Valida precio y stock no negativos.
    - Fuerza empresa_id al de current_user para evitar inconsistencias.
    """
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # ✅ Validar duplicados ANTES de aplicar cambios
    if datos.nombre and datos.nombre != producto.nombre:
        existente = db.query(Producto).filter(
            Producto.nombre == datos.nombre,
            Producto.empresa_id == current_user.empresa_id,
            Producto.id != producto_id   # excluimos explícitamente el mismo producto
        ).first()
        if existente:
            raise HTTPException(status_code=400, detail="Ya existe otro producto con ese nombre en la empresa")

    # Validar precio y stock si se envían
    if datos.precio is not None and datos.precio < 0:
        raise HTTPException(status_code=400, detail="El precio debe ser positivo")
    if datos.stock is not None and datos.stock < 0:
        raise HTTPException(status_code=400, detail="El stock debe ser positivo")

    # ✅ Aplicar cambios solo después de validar
    for key, value in datos.dict(exclude_unset=True, exclude_none=True).items():
        setattr(producto, key, value)

    producto.empresa_id = current_user.empresa_id

    db.commit()
    db.refresh(producto)
    return producto

# ------------------------------------------------------------
# Eliminar producto (solo admin)
# ------------------------------------------------------------

@router.delete("/{producto_id}", dependencies=[Depends(require_admin)])
def eliminar_producto(
    producto_id: int,
    db: Session = Depends(get_db)
) -> dict:
    """
    Elimina un producto por ID.
    - Responde 404 si el producto no existe.
    """
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(producto)
    db.commit()
    return {"detail": "Producto eliminado correctamente"}
