# ============================================================
# Archivo: backend/routes/categorias.py
# Descripción: Rutas CRUD para Categorías (con i18n, soft delete, validaciones)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.categoria import Categoria
from backend.models.producto import Producto   # 🔹 Necesario para validar dependencias
from backend.schemas.categoria import CategoriaCreate, CategoriaRead, CategoriaUpdate
from backend.security.deps import get_current_user, require_admin
from backend.i18n.messages import get_message

router = APIRouter(prefix="/categorias", tags=["Categorías"])

# Crear
@router.post("/", response_model=CategoriaRead, dependencies=[Depends(require_admin)])
def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    existente = db.query(Categoria).filter(Categoria.nombre == categoria.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail=get_message("categoria_existente", "es"))
    nueva = Categoria(nombre=categoria.nombre, descripcion=categoria.descripcion)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

# Listar (activas por defecto, opcional incluir inactivas)
@router.get("/", response_model=list[CategoriaRead])
def listar_categorias(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    incluir_inactivos: bool = Query(False, description="Incluir categorías inactivas")
):
    query = db.query(Categoria)
    if not incluir_inactivos:
        query = query.filter(Categoria.activo == True)
    return query.all()

# Actualizar (bloquea cambio de nombre si hay productos asociados)
@router.put("/{categoria_id}", response_model=CategoriaRead, dependencies=[Depends(require_admin)])
def actualizar_categoria(categoria_id: int, datos: CategoriaUpdate, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail=get_message("categoria_no_encontrada", "es"))

    # 🔹 Si intenta cambiar el nombre y la categoría tiene productos asociados → bloquear
    if datos.nombre and datos.nombre != categoria.nombre:
        productos_asociados = db.query(Producto).filter(Producto.categoria_id == categoria_id).count()
        if productos_asociados > 0:
            raise HTTPException(
                status_code=400,
                detail=get_message("categoria_no_edit_nombre_asociada", "es")
            )

        # Validar duplicados de nombre
        existente = db.query(Categoria).filter(
            Categoria.nombre == datos.nombre,
            Categoria.id != categoria_id
        ).first()
        if existente:
            raise HTTPException(status_code=400, detail=get_message("categoria_existente_otro", "es"))

    # Aplicar cambios (solo campos presentes)
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(categoria, key, value)

    db.commit()
    db.refresh(categoria)
    return categoria

# Desactivar (soft delete)
@router.patch("/{categoria_id}/desactivar", response_model=CategoriaRead, dependencies=[Depends(require_admin)])
def desactivar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail=get_message("categoria_no_encontrada", "es"))
    categoria.activo = False
    db.commit()
    db.refresh(categoria)
    return categoria

# Reactivar
@router.patch("/{categoria_id}/reactivar", response_model=CategoriaRead, dependencies=[Depends(require_admin)])
def reactivar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail=get_message("categoria_no_encontrada", "es"))
    categoria.activo = True
    db.commit()
    db.refresh(categoria)
    return categoria
