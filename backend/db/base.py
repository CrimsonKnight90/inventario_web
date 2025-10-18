from backend.db.base_class import Base

# Modelos iniciales
from backend.models.usuario import Usuario
from backend.models.producto import Producto
from backend.models.categoria import Categoria
from backend.models.movimiento import Movimiento
from backend.models.actividad import Actividad
from backend.models.actividad_cerrada import ActividadCerrada

# Nuevos modelos
from backend.models.proveedor import Proveedor
from backend.models.documento import Documento
from backend.models.tipo_documento import TipoDocumento
from backend.models.um import UM
from backend.models.moneda import Moneda
from backend.models.centro_costo import CentroCosto
from backend.models.consumo import Consumo
from backend.models.contraparte import Contraparte
from backend.models.combinacion import Combinacion

# Branding / Configuración de la app
from backend.models.config import Config

# 🔹 Modelos de Auditoría
from backend.auditoria.models.producto_auditoria import ProductoAuditoria
# (en el futuro puedes añadir CategoriaAuditoria, UM_Auditoria, etc.)
