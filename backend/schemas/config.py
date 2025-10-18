# ============================================================
# Archivo: backend/schemas/config.py
# Descripción: Schemas Pydantic para configuración de branding
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel
from typing import Optional

class ConfigBase(BaseModel):
    app_name: str
    logo_url: str
    primary_color: str
    secondary_color: str
    background_color: str
    topbar_color: str   # 🔹 Nuevo

class ConfigUpdate(BaseModel):
    app_name: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    background_color: Optional[str] = None
    topbar_color: Optional[str] = None   # 🔹 Nuevo

class ConfigOut(ConfigBase):
    id: int
    class Config:
        from_attributes = True

