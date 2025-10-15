# ============================================================
# Archivo: backend/scripts/cierre_periodo.py
# Descripción: Script para generar un Documento de tipo CIERRE
#              consolidando todos los vales de un periodo (mes).
# Autor: CrimsonKnight90
# ============================================================

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.db.session import SessionLocal
from backend.models.documento import Documento
from backend.models.tipo_documento import TipoDocumento
from backend.i18n.messages import get_message

def generar_cierre_periodo(year: int, month: int, lang: str = "es"):
    """
    Genera un Documento de tipo CIERRE consolidando todos los vales
    (Documentos) en el mes indicado.
    lang: idioma de salida ("es" o "en")
    """

    db: Session = SessionLocal()
    try:
        # Verificar que exista el tipo de documento CIERRE
        cierre_tipo = db.query(TipoDocumento).filter(TipoDocumento.clave == "CIERRE").first()
        if not cierre_tipo:
            raise ValueError(get_message("cierre_tipo_no_existe", lang))

        # Calcular rango de fechas
        fecha_inicio = datetime(year, month, 1)
        if month == 12:
            fecha_fin = datetime(year + 1, 1, 1) - timedelta(seconds=1)
        else:
            fecha_fin = datetime(year, month + 1, 1) - timedelta(seconds=1)

        # Obtener documentos del periodo (excepto cierres previos)
        docs = db.query(Documento).filter(
            Documento.fecha >= fecha_inicio,
            Documento.fecha <= fecha_fin,
            Documento.tipo_doc_id != "CIERRE"
        ).all()

        if not docs:
            print(get_message("no_docs_periodo", lang))
            return None

        # Consolidar importes
        total_usd = sum(d.importe_usd for d in docs)
        total_mn = sum(d.importe_mn for d in docs)

        # Crear documento de cierre
        cierre = Documento(
            fecha=datetime.utcnow(),
            tipo_doc_id="CIERRE",
            importe_usd=total_usd,
            importe_mn=total_mn
        )
        db.add(cierre)
        db.commit()
        db.refresh(cierre)

        print(get_message("cierre_generado", lang).format(year=year, month=month))
        print(get_message("totales", lang).format(total_usd=total_usd, total_mn=total_mn))
        return cierre

    finally:
        db.close()


# Ejemplo de ejecución directa
if __name__ == "__main__":
    # Generar cierre de septiembre 2025 en español
    generar_cierre_periodo(year=2025, month=9, lang="es")
    # Generar cierre de septiembre 2025 en inglés
    generar_cierre_periodo(year=2025, month=9, lang="en")
