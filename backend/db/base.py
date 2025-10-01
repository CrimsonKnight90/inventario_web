from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Importa todos los modelos aquí para que Alembic los detecte
from backend.models.usuario import Usuario
from backend.models.producto import Producto
from backend.models.categoria import Categoria
from backend.models.movimiento import Movimiento
from backend.models.empresa import Empresa
