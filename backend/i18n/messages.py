# ============================================================
# Archivo: backend/i18n/messages.py
# Descripción: Diccionario centralizado de mensajes traducibles
# Autor: CrimsonKnight90
# ============================================================

MESSAGES = {
    "es": {
        # core (main.py, deps.py, auth)
        "welcome": "Bienvenido al sistema de Inventario Web 🚀",
        "db_ok": "Conexión a la base de datos exitosa",
        "invalid_credentials": "Credenciales inválidas",
        "user_not_found": "Usuario no encontrado",
        "token_invalid": "Token inválido o expirado",
        "forbidden": "Acceso restringido a administradores",

        # scripts/cierre_periodo.py
        "cierre_tipo_no_existe": "TipoDocumento 'CIERRE' no existe. Ejecute seed.py",
        "no_docs_periodo": "⚠️ No hay documentos en este periodo",
        "cierre_generado": "✅ Cierre generado para {year}-{month:02d}",
        "totales": "   Total USD: {total_usd}, Total MN: {total_mn}",

        # schemas/usuario.py
        "invalid_role": "Rol inválido. Solo se permite 'empleado' o 'admin'.",

        # schemas/um.py
        "invalid_factor": "El factor debe ser -1 o 1",

        # schemas/tipo_documento.py
        "invalid_clave": "La clave debe contener solo letras mayúsculas (A-Z)",

        # schemas/proveedor.py
        "invalid_proveedor_nombre": "El nombre del proveedor no puede estar vacío",

        # schemas/producto.py
        "invalid_producto_nombre": "El nombre del producto no puede estar vacío",
        "invalid_producto_existencias": "La existencia mínima no puede ser mayor que la máxima",
        "invalid_producto_existencia_max": "La existencia máxima debe ser mayor que 0",

        # schemas/movimiento.py
        "invalid_movimiento_tipo": "El tipo de movimiento debe ser 'entrada' o 'salida'",
        "invalid_movimiento_cantidad": "La cantidad debe ser mayor que 0",

        # schemas/moneda.py
        "invalid_moneda_nombre": "El nombre de la moneda no puede estar vacío",

        # schemas/documento.py
        "invalid_importe_usd": "El importe en USD no puede ser negativo",
        "invalid_importe_mn": "El importe en MN no puede ser negativo",

        # schemas/contraparte.py
        "invalid_cuentacont": "La cuenta contable debe ser un entero positivo",
        "invalid_nomcont": "El nombre de la contraparte no puede estar vacío",

        # schemas/consumo.py
        "invalid_actividad_id": "El identificador de la actividad debe ser un entero positivo",
        "invalid_cantpers": "La cantidad de personas debe ser mayor que 0",

        # schemas/combinacion.py
        "invalid_cc": "El centro de costo (cc) no puede estar vacío",
        "invalid_cont": "La cuenta contable (cont) no puede estar vacía",
        "invalid_cl": "La clasificación (cl) no puede estar vacía",

        # schemas/centro_costo.py
        "invalid_cuentacc": "La cuenta de costo no puede estar vacía",
        "invalid_nomcc": "El nombre del centro de costo no puede estar vacío",

        # schemas/categoria.py
        "invalid_categoria_nombre": "El nombre de la categoría no puede estar vacío",

        # schemas/actividad.py y actividad_cerrada.py
        "invalid_codact": "El código de la actividad debe ser un entero positivo",
        "invalid_nomact": "El nombre de la actividad no puede estar vacío",
        "invalid_rango_fechas": "La fecha de fin no puede ser anterior a la fecha de inicio",
        "invalid_monto_no_negativo": "El campo '{field}' no puede ser negativo",

        # routes/usuarios.py
        "usuario_existente": "El usuario ya existe",

        # routes/um.py
        "um_existente_activa": "Ya existe una UM activa con esa clave",
        "um_no_encontrada": "Unidad no encontrada",
        "um_ya_desactivada": "Unidad '{um_id}' ya estaba desactivada",
        "um_desactivada_ok": "Unidad '{um_id}' desactivada correctamente",
        "um_ya_activa": "Unidad '{um_id}' ya está activa",

        # routes/tipos_documentos.py
        "tipo_doc_conflicto_reactivacion": "El tipo de documento '{clave}' existe desactivado con valores distintos. Debe crear uno nuevo con otra clave.",
        "tipo_doc_existente_activo": "Ya existe un tipo de documento activo con esa clave",
        "tipo_doc_no_encontrado": "Tipo de documento no encontrado",
        "tipo_doc_ya_desactivado": "Tipo de documento '{clave}' ya estaba desactivado",
        "tipo_doc_desactivado_ok": "Tipo de documento '{clave}' desactivado correctamente",
        "tipo_doc_ya_activo": "El tipo de documento '{clave}' ya está activo",

        # routes/proveedores.py
        "proveedor_no_encontrado": "Proveedor no encontrado",
        "proveedor_existente": "Ya existe un proveedor con ese nombre",
        "proveedor_ya_desactivado": "El proveedor ya estaba desactivado",
        "proveedor_desactivado_ok": "Proveedor desactivado correctamente",
        "proveedor_ya_activo": "El proveedor ya está activo",
        "proveedor_reactivado_ok": "Proveedor reactivado correctamente",

        # routes/productos.py
        "producto_existente": "Ya existe un producto con ese nombre en la empresa",
        "producto_no_encontrado": "Producto no encontrado",
        "producto_eliminado_ok": "Producto eliminado correctamente",
        "producto_existencias_invalidas": "Existencia mínima y máxima deben ser valores válidos",

        # routes/centros_costo.py
        "centro_costo_existente": "Ya existe un centro de costo con esa cuenta",
        "centro_costo_no_encontrado": "Centro de costo no encontrado",
        "centro_costo_ya_desactivado": "El centro de costo ya estaba desactivado",
        "centro_costo_desactivado_ok": "Centro de costo desactivado correctamente",
        "centro_costo_ya_activo": "El centro de costo ya está activo",
        "centro_costo_reactivado_ok": "Centro de costo reactivado correctamente",

        # routes/movimientos.py
        "movimiento_tipo_invalido": "Tipo de movimiento inválido (use 'entrada' o 'salida')",
        "movimiento_no_encontrado": "Movimiento no encontrado",
        "producto_original_no_encontrado": "Producto original no encontrado",
        "producto_nuevo_no_encontrado": "Producto nuevo no encontrado",

        # routes/monedas.py
        "moneda_existente_activa": "Ya existe una moneda activa con ese nombre",
        "moneda_no_encontrada": "Moneda no encontrada",
        "moneda_ya_desactivada": "Moneda '{nombre}' ya estaba desactivada",
        "moneda_desactivada_ok": "Moneda '{nombre}' desactivada correctamente",
        "moneda_ya_activa": "Moneda '{nombre}' ya está activa",

        # routes/documentos.py
        "documento_no_encontrado": "Documento no encontrado",

        # routes/contrapartes.py
        "contraparte_no_encontrada": "Contraparte no encontrada",

        # routes/combinaciones.py
        "combinacion_no_encontrada": "Combinación no encontrada",

        # routes/categorias.py
        "categoria_existente": "Ya existe una categoría con ese nombre",
        "categoria_existente_otro": "Ya existe otra categoría con ese nombre",
        "categoria_no_encontrada": "Categoría no encontrada",
        "categoria_eliminada_ok": "Categoría eliminada correctamente",

        # routes/actividades_cerradas.py
        "actividad_cerrada_no_encontrada": "Actividad cerrada no encontrada",

        # routes/actividades.py
        "actividad_no_encontrada": "Actividad no encontrada",
        "actividad_ya_cerrada": "La actividad ya está cerrada",
    },

   

def get_message(key: str, lang: str = "es") -> str:
    """
    Devuelve el mensaje traducido según la clave y el idioma.
    Si no existe el idioma, usa español por defecto.
    Si no existe la clave, devuelve la clave literal.
    """
    return MESSAGES.get(lang, MESSAGES["es"]).get(key, key)
