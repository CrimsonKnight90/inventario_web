# ============================================================
# Archivo: backend/routes/categorias.py
# Descripción: Rutas CRUD para Categorías (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.categoria import Categoria
from backend.schemas.categoria import CategoriaCreate, CategoriaRead, CategoriaUpdate
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message

router = APIRouter(prefix="/categorias", tags=["Categorías"])

# 🔹 Crear categoría (solo admin)
@router.post("/", response_model=CategoriaRead, dependencies=[Depends(require_admin)])
def crear_categoria(
    categoria: CategoriaCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
):
    existente = db.query(Categoria).filter(
        Categoria.nombre == categoria.nombre,
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail=get_message("categoria_existente", lang))

    nueva = Categoria(
        nombre=categoria.nombre,
        descripcion=categoria.descripcion,
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


# 🔹 Listar categorías (cualquier usuario autenticado)
@router.get("/", response_model=list[CategoriaRead])
def listar_categorias(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return db.query(Categoria).all()


# 🔹 Actualizar categoría (solo admin)
@router.put("/{categoria_id}", response_model=CategoriaRead, dependencies=[Depends(require_admin)])
def actualizar_categoria(
    categoria_id: int,
    datos: CategoriaUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail=get_message("categoria_no_encontrada", lang))

    # Validar duplicados si cambia nombre
    if datos.nombre and datos.nombre != categoria.nombre:
        existente = db.query(Categoria).filter(
            Categoria.nombre == datos.nombre,
            Categoria.id != categoria_id
        ).first()
        if existente:
            raise HTTPException(status_code=400, detail=get_message("categoria_existente_otro", lang))

    # Aplicar cambios (solo campos presentes)
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(categoria, key, value)

    db.commit()
    db.refresh(categoria)
    return categoria


# 🔹 Eliminar categoría (solo admin)
@router.delete("/{categoria_id}", dependencies=[Depends(require_admin)])
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db), lang: str = "es"):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail=get_message("categoria_no_encontrada", lang))
    db.delete(categoria)
    db.commit()
    return {"detail": get_message("categoria_eliminada_ok", lang)}
