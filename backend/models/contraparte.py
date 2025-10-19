# // ============================================================
# // Archivo: backend/models/contraparte.py
# // Descripción: Modelo SQLAlchemy para contrapartes contables con formato, unicidad y soft delete
# // Autor: CrimsonKnight90
# // ============================================================

from sqlalchemy import Column, String, Boolean, CheckConstraint, UniqueConstraint
from backend.db.base_class import Base

class Contraparte(Base):
    __tablename__ = "contrapartes"

    # Formato 000-00-00-00 (13 caracteres)
    cuentacont = Column(String(13), primary_key=True, index=True)
    nomcont = Column(String(100), nullable=False, unique=True)
    activo = Column(Boolean, default=True, nullable=False)

    __table_args__ = (
        CheckConstraint("cuentacont ~ '^[0-9]{3}-[0-9]{2}-[0-9]{2}-[0-9]{2}$'", name="ck_contraparte_cuentacont_formato"),
        UniqueConstraint("nomcont", name="uq_contraparte_nomcont"),
    )
