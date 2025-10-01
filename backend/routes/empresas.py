from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.empresa import Empresa
from backend.schemas.empresa import EmpresaCreate, EmpresaRead

router = APIRouter(prefix="/empresas", tags=["Empresas"])

@router.post("/", response_model=EmpresaRead)
def crear_empresa(empresa: EmpresaCreate, db: Session = Depends(get_db)):
    nueva = Empresa(**empresa.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/", response_model=list[EmpresaRead])
def listar_empresas(db: Session = Depends(get_db)):
    return db.query(Empresa).all()
