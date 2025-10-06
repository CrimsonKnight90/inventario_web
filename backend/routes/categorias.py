from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.categoria import Categoria
from backend.schemas.categoria import CategoriaCreate, CategoriaRead, CategoriaUpdate
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario

router = APIRouter(prefix="/categorias", tags=["Categorías"])

# 🔹 Crear categoría (solo admin)
@router.post("/", response_model=CategoriaRead, dependencies=[Depends(require_admin)])
def crear_categoria(
    categoria: CategoriaCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    existente = db.query(Categoria).filter(
        Categoria.nombre == categoria.nombre,
        Categoria.empresa_id == current_user.empresa_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe una categoría con ese nombre en la empresa")

    nueva = Categoria(
        nombre=categoria.nombre,
        descripcion=categoria.descripcion,
        empresa_id=current_user.empresa_id
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
    return db.query(Categoria).filter(Categoria.empresa_id == current_user.empresa_id).all()

@router.put("/{categoria_id}", response_model=CategoriaRead, dependencies=[Depends(require_admin)])
def actualizar_categoria(
    categoria_id: int,
    datos: CategoriaUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    # Garantizar ámbito de empresa
    if categoria.empresa_id != current_user.empresa_id:
        raise HTTPException(status_code=403, detail="Acceso denegado a categoría de otra empresa")

    # Validar duplicados si cambia nombre
    if datos.nombre and datos.nombre != categoria.nombre:
        existente = db.query(Categoria).filter(
            Categoria.nombre == datos.nombre,
            Categoria.empresa_id == current_user.empresa_id,
            Categoria.id != categoria_id
        ).first()
        if existente:
            raise HTTPException(status_code=400, detail="Ya existe otra categoría con ese nombre en la empresa")

    # Aplicar cambios (solo campos presentes)
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(categoria, key, value)

    db.commit()
    db.refresh(categoria)
    return categoria

# 🔹 Eliminar categoría (solo admin)
@router.delete("/{categoria_id}", dependencies=[Depends(require_admin)])
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.delete(categoria)
    db.commit()
    return {"detail": "Categoría eliminada correctamente"}
