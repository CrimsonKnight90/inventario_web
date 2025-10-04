from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.empresa import Empresa
from backend.schemas.empresa import EmpresaCreate, EmpresaRead
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario

router = APIRouter(prefix="/empresas", tags=["Empresas"])

# 🔹 Crear empresa (solo admin)
@router.post("/", response_model=EmpresaRead, dependencies=[Depends(require_admin)])
def crear_empresa(empresa: EmpresaCreate, db: Session = Depends(get_db)):
    # Validar duplicados por nombre
    existente = db.query(Empresa).filter(Empresa.nombre == empresa.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe una empresa con ese nombre")

    nueva = Empresa(**empresa.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

# 🔹 Listar empresas (cualquier usuario autenticado)
@router.get("/", response_model=list[EmpresaRead])
def listar_empresas(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    return db.query(Empresa).all()

# 🔹 Actualizar empresa (solo admin)
@router.put("/{empresa_id}", response_model=EmpresaRead, dependencies=[Depends(require_admin)])
def actualizar_empresa(empresa_id: int, datos: EmpresaCreate, db: Session = Depends(get_db)):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")

    # Validar duplicados (si cambia el nombre)
    existente = db.query(Empresa).filter(
        Empresa.nombre == datos.nombre,
        Empresa.id != empresa_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe otra empresa con ese nombre")

    for key, value in datos.dict().items():
        setattr(empresa, key, value)
    db.commit()
    db.refresh(empresa)
    return empresa

# 🔹 Eliminar empresa (solo admin)
@router.delete("/{empresa_id}", dependencies=[Depends(require_admin)])
def eliminar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    db.delete(empresa)
    db.commit()
    return {"detail": "Empresa eliminada correctamente"}
