# ============================================================
# Archivo: backend/crud/config.py
# Descripción: Lógica CRUD para la configuración de branding
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy.orm import Session
from backend.models.config import Config
from backend.schemas.config import ConfigUpdate

def get_config(db: Session) -> Config:
    config = db.query(Config).first()
    if not config:
        config = Config()
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

def update_config(db: Session, config_in: ConfigUpdate) -> Config:
    config = get_config(db)
    for field, value in config_in.dict(exclude_unset=True).items():
        if value is not None:
            setattr(config, field, value)
    db.add(config)
    db.commit()
    db.refresh(config)
    return config
