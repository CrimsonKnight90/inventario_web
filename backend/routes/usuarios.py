from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.usuario import Usuario
from backend.schemas.usuario import UsuarioCreate, UsuarioRead
from backend.security.deps import get_current_user, require_admin
from backend.security.auth import hash_password

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# 🔹 Crear usuario (solo admin)
@router.post("/", response_model=UsuarioRead, dependencies=[Depends(require_admin)])
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    # Validar email duplicado
    existente = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe un usuario con ese email")

    # Hashear contraseña antes de guardar
    nuevo = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password=hash_password(usuario.password),
        role=usuario.role,
        empresa_id=usuario.empresa_id
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# 🔹 Listar usuarios (solo admin)
@router.get("/", response_model=list[UsuarioRead], dependencies=[Depends(require_admin)])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

# 🔹 Ver perfil propio (cualquier usuario autenticado)
@router.get("/me", response_model=UsuarioRead)
def leer_mi_perfil(current_user: Usuario = Depends(get_current_user)):
    return current_user

# 🔹 Actualizar usuario (solo admin)
@router.put("/{usuario_id}", response_model=UsuarioRead, dependencies=[Depends(require_admin)])
def actualizar_usuario(usuario_id: int, datos: UsuarioCreate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Validar email duplicado (si cambia)
    existente = db.query(Usuario).filter(
        Usuario.email == datos.email,
        Usuario.id != usuario_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe otro usuario con ese email")

    usuario.nombre = datos.nombre
    usuario.email = datos.email
    usuario.role = datos.role
    usuario.empresa_id = datos.empresa_id
    usuario.password = hash_password(datos.password)  # siempre re-hashear

    db.commit()
    db.refresh(usuario)
    return usuario

# 🔹 Eliminar usuario (solo admin)
@router.delete("/{usuario_id}", dependencies=[Depends(require_admin)])
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()
    return {"detail": "Usuario eliminado correctamente"}
