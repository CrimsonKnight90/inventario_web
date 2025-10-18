# ============================================================
# Archivo: backend/routes/productos.py
# Descripción: Rutas de gestión de productos con validaciones de negocio y auditoría
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from backend.db.session import get_db
from backend.models.producto import Producto
from backend.models.um import UM
from backend.models.moneda import Moneda
from backend.models.categoria import Categoria
from backend.schemas.producto import ProductoCreate, ProductoRead, ProductoUpdate
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message
from backend.auditoria.utils import registrar_auditoria

router = APIRouter(prefix="/productos", tags=["Productos"])

# Crear
@router.post("/", response_model=ProductoRead, dependencies=[Depends(require_admin)])
def crear_producto(
    producto: ProductoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
) -> Producto:
    existente = db.query(Producto).filter(Producto.nombre == producto.nombre).first()
    if existente:
        raise HTTPException(400, detail=get_message("producto_existente", lang))

    um = db.query(UM).filter(UM.um == producto.um_id, UM.activo == True).first()
    if not um:
        raise HTTPException(400, detail=get_message("um_no_valida", lang))

    moneda = db.query(Moneda).filter(Moneda.nombre == producto.moneda_id, Moneda.activo == True).first()
    if not moneda:
        raise HTTPException(400, detail=get_message("moneda_no_valida", lang))

    if producto.categoria_id:
        categoria = db.query(Categoria).filter(Categoria.id == producto.categoria_id, Categoria.activo == True).first()
        if not categoria:
            raise HTTPException(400, detail=get_message("categoria_no_valida", lang))

    if producto.existencia_min < 0 or producto.existencia_max <= 0 or producto.existencia_max < producto.existencia_min:
        raise HTTPException(400, detail=get_message("producto_existencias_invalidas", lang))

    nuevo = Producto(**producto.dict(), activo=True)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    # 🔹 Auditoría
    registrar_auditoria(
        db=db,
        producto_id=nuevo.id,
        usuario_id=current_user.id,
        accion="crear",
        valores_nuevos=producto.dict()
    )

    return nuevo

# Listar
@router.get("/", response_model=list[ProductoRead])
def listar_productos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    incluir_inactivos: bool = Query(False, description="Incluir productos inactivos")
) -> list[Producto]:
    query = db.query(Producto).options(
        joinedload(Producto.categoria),
        joinedload(Producto.um),
        joinedload(Producto.moneda)
    )
    if not incluir_inactivos:
        query = query.filter(Producto.activo == True)
    return query.all()

# Obtener uno
@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(
    producto_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
) -> Producto:
    producto = db.query(Producto).options(
        joinedload(Producto.categoria),
        joinedload(Producto.um),
        joinedload(Producto.moneda)
    ).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(404, detail=get_message("producto_no_encontrado", lang))
    return producto

# Actualizar
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
        raise HTTPException(404, detail=get_message("producto_no_encontrado", lang))

    if datos.nombre and datos.nombre != producto.nombre:
        existente = db.query(Producto).filter(Producto.nombre == datos.nombre, Producto.id != producto_id).first()
        if existente:
            raise HTTPException(400, detail=get_message("producto_existente", lang))

    if datos.um_id:
        um = db.query(UM).filter(UM.um == datos.um_id, UM.activo == True).first()
        if not um:
            raise HTTPException(400, detail=get_message("um_no_valida", lang))

    if datos.moneda_id:
        moneda = db.query(Moneda).filter(Moneda.nombre == datos.moneda_id, Moneda.activo == True).first()
        if not moneda:
            raise HTTPException(400, detail=get_message("moneda_no_valida", lang))

    if datos.categoria_id:
        categoria = db.query(Categoria).filter(Categoria.id == datos.categoria_id, Categoria.activo == True).first()
        if not categoria:
            raise HTTPException(400, detail=get_message("categoria_no_valida", lang))

    nueva_min = datos.existencia_min if datos.existencia_min is not None else producto.existencia_min
    nueva_max = datos.existencia_max if datos.existencia_max is not None else producto.existencia_max

    if nueva_min < 0 or nueva_max <= 0 or nueva_max < nueva_min:
        raise HTTPException(400, detail=get_message("producto_existencias_invalidas", lang))

    valores_anteriores = {
        "nombre": producto.nombre,
        "existencia_min": producto.existencia_min,
        "existencia_max": producto.existencia_max,
        "um_id": producto.um_id,
        "moneda_id": producto.moneda_id,
        "categoria_id": producto.categoria_id,
    }

    for key, value in datos.dict(exclude_unset=True, exclude_none=True).items():
        setattr(producto, key, value)

    db.commit()
    db.refresh(producto)

    # 🔹 Auditoría
    registrar_auditoria(
        db=db,
        producto_id=producto.id,
        usuario_id=current_user.id,
        accion="actualizar",
        valores_anteriores=valores_anteriores,
        valores_nuevos=datos.dict(exclude_unset=True, exclude_none=True)
    )

    return producto

# Desactivar
@router.patch("/{producto_id}/desactivar", dependencies=[Depends(require_admin)])
def desactivar_producto(
    producto_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
) -> dict:
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(404, detail=get_message("producto_no_encontrado", lang))
    if not producto.activo:
        return {"detail": get_message("producto_ya_desactivado", lang)}

    producto.activo = False
    db.commit()

    # 🔹 Auditoría
    registrar_auditoria(
        db=db,
        producto_id=producto.id,
        usuario_id=current_user.id,
        accion="desactivar",
        valores_anteriores={"activo": True},
        valores_nuevos={"activo": False}
    )

    return {"detail": get_message("producto_desactivado_ok", lang)}

# Reactivar
@router.patch("/{producto_id}/reactivar", dependencies=[Depends(require_admin)])
def reactivar_producto(
    producto_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
) -> dict:
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(404, detail=get_message("producto_no_encontrado", lang))
    if producto.activo:
        return {"detail": get_message("producto_ya_activo", lang)}

    if not producto.um.activo:
        raise HTTPException(400, detail=get_message("um_inactiva", lang))
    if not producto.moneda.activo:
        raise HTTPException(400, detail=get_message("moneda_inactiva", lang))
    if producto.categoria_id and not producto.categoria.activo:
        raise HTTPException(400, detail=get_message("categoria_inactiva", lang))

    producto.activo = True
    db.commit()

    # 🔹 Auditoría
    registrar_auditoria(
        db=db,
        producto_id=producto.id,
        usuario_id=current_user.id,
        accion="reactivar",
        valores_anteriores={"activo": False},
        valores_nuevos={"activo": True}
    )

    return {"detail": get_message("producto_reactivado_ok", lang)}
