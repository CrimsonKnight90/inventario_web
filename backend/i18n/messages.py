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
        "stock_insuficiente_salida": "Stock insuficiente para realizar la salida",
        "movimiento_tipo_invalido": "Tipo de movimiento inválido (use 'entrada' o 'salida')",
        "movimiento_no_encontrado": "Movimiento no encontrado",
        "producto_original_no_encontrado": "Producto original no encontrado",
        "producto_nuevo_no_encontrado": "Producto nuevo no encontrado",
        "stock_insuficiente_actualizar": "Stock insuficiente para actualizar la salida",
        "movimiento_eliminado_ok": "Movimiento eliminado y stock revertido",

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

    "en": {
        # core (main.py, deps.py, auth)
        "welcome": "Welcome to the Inventory Web System 🚀",
        "db_ok": "Database connection successful",
        "invalid_credentials": "Invalid credentials",
        "user_not_found": "User not found",
        "token_invalid": "Invalid or expired token",
        "forbidden": "Access restricted to administrators",

        # scripts/cierre_periodo.py
        "cierre_tipo_no_existe": "Document type 'CIERRE' does not exist. Run seed.py",
        "no_docs_periodo": "⚠️ No documents found in this period",
        "cierre_generado": "✅ Closing document generated for {year}-{month:02d}",
        "totales": "   Total USD: {total_usd}, Total MN: {total_mn}",

        # schemas/usuario.py
        "invalid_role": "Invalid role. Only 'employee' or 'admin' are allowed.",

        # schemas/um.py
        "invalid_factor": "Factor must be -1 or 1",

        # schemas/tipo_documento.py
        "invalid_clave": "The key must contain only uppercase letters (A-Z)",

        # schemas/proveedor.py
        "invalid_proveedor_nombre": "Supplier name cannot be empty",

        # schemas/producto.py
        "invalid_producto_nombre": "Product name cannot be empty",
        "invalid_producto_existencias": "Minimum stock cannot be greater than maximum",
        "invalid_producto_existencia_max": "Maximum stock must be greater than 0",

        # routes/centros_costo.py
        "centro_costo_existente": "A cost center with this account or name already exists",
        "centro_costo_no_encontrado": "Cost center not found",
        "centro_costo_ya_desactivado": "The cost center was already deactivated",
        "centro_costo_desactivado_ok": "Cost center successfully deactivated",
        "centro_costo_ya_activo": "The cost center is already active",
        "centro_costo_reactivado_ok": "Cost center successfully reactivated",

        # schemas/movimiento.py
        "invalid_movimiento_tipo": "Movement type must be 'entrada' or 'salida'",
        "invalid_movimiento_cantidad": "Quantity must be greater than 0",

        # schemas/moneda.py
        "invalid_moneda_nombre": "Currency name cannot be empty",

        # schemas/documento.py
        "invalid_importe_usd": "USD amount cannot be negative",
        "invalid_importe_mn": "MN amount cannot be negative",

        # schemas/contraparte.py
        "invalid_cuentacont": "Accounting account must be a positive integer",
        "invalid_nomcont": "Counterparty name cannot be empty",

        # schemas/consumo.py
        "invalid_actividad_id": "Activity identifier must be a positive integer",
        "invalid_cantpers": "People count must be greater than 0",

        # schemas/combinacion.py
        "invalid_cc": "Cost center (cc) cannot be empty",
        "invalid_cont": "Accounting account (cont) cannot be empty",
        "invalid_cl": "Classification (cl) cannot be empty",

        # schemas/centro_costo.py
        "invalid_cuentacc": "Cost account cannot be empty",
        "invalid_nomcc": "Cost center name cannot be empty",

        # schemas/categoria.py
        "invalid_categoria_nombre": "Category name cannot be empty",

        # schemas/actividad.py y actividad_cerrada.py
        "invalid_codact": "Activity code must be a positive integer",
        "invalid_nomact": "Activity name cannot be empty",
        "invalid_rango_fechas": "End date cannot be earlier than start date",
        "invalid_monto_no_negativo": "Field '{field}' cannot be negative",

        # routes/usuarios.py
        "usuario_existente": "User already exists",

        # routes/um.py
        "um_existente_activa": "An active UM with this key already exists",
        "um_no_encontrada": "Unit not found",
        "um_ya_desactivada": "Unit '{um_id}' was already deactivated",
        "um_desactivada_ok": "Unit '{um_id}' successfully deactivated",
        "um_ya_activa": "Unit '{um_id}' is already active",

        # routes/tipos_documentos.py
        "tipo_doc_conflicto_reactivacion": "The document type '{clave}' exists deactivated with different values. You must create a new one with another key.",
        "tipo_doc_existente_activo": "An active document type with this key already exists",
        "tipo_doc_no_encontrado": "Document type not found",
        "tipo_doc_ya_desactivado": "Document type '{clave}' was already deactivated",
        "tipo_doc_desactivado_ok": "Document type '{clave}' successfully deactivated",
        "tipo_doc_ya_activo": "Document type '{clave}' is already active",

        # routes/proveedores.py
        "proveedor_no_encontrado": "Supplier not found",
        "proveedor_existente": "A supplier with this name already exists",
        "proveedor_ya_desactivado": "Supplier was already deactivated",
        "proveedor_desactivado_ok": "Supplier successfully deactivated",
        "proveedor_ya_activo": "Supplier is already active",
        "proveedor_reactivado_ok": "Supplier successfully reactivated",

        # routes/productos.py
        "producto_existente": "A product with this name already exists in the company",
        "producto_no_encontrado": "Product not found",
        "producto_eliminado_ok": "Product successfully deleted",
        "producto_existencias_invalidas": "Minimum and maximum stock must be valid values",

        # routes/movimientos.py
        "stock_insuficiente_salida": "Insufficient stock to perform the output",
        "movimiento_tipo_invalido": "Invalid movement type (use 'entrada' or 'salida')",
        "movimiento_no_encontrado": "Movement not found",
        "producto_original_no_encontrado": "Original product not found",
        "producto_nuevo_no_encontrado": "New product not found",
        "stock_insuficiente_actualizar": "Insufficient stock to update the output",
        "movimiento_eliminado_ok": "Movement deleted and stock reverted",

        # routes/monedas.py
        "moneda_existente_activa": "An active currency with this name already exists",
        "moneda_no_encontrada": "Currency not found",
        "moneda_ya_desactivada": "Currency '{nombre}' was already deactivated",
        "moneda_desactivada_ok": "Currency '{nombre}' successfully deactivated",
        "moneda_ya_activa": "Currency '{nombre}' is already active",

        # routes/documentos.py
        "documento_no_encontrado": "Document not found",

        # routes/contrapartes.py
        "contraparte_no_encontrada": "Counterparty not found",

        # routes/combinaciones.py
        "combinacion_no_encontrada": "Combination not found",

        # routes/categorias.py
        "categoria_existente": "A category with this name already exists",
        "categoria_existente_otro": "Another category with this name already exists",
        "categoria_no_encontrada": "Category not found",
        "categoria_eliminada_ok": "Category successfully deleted",

        # routes/actividades_cerradas.py
        "actividad_cerrada_no_encontrada": "Closed activity not found",

        # routes/actividades.py
        "actividad_no_encontrada": "Activity not found",
        "actividad_ya_cerrada": "The activity is already closed",
    },

    "fr": {
        # core (main.py, deps.py, auth)
        "welcome": "Bienvenue dans le système de gestion d'inventaire 🚀",
        "db_ok": "Connexion à la base de données réussie",
        "invalid_credentials": "Identifiants invalides",
        "user_not_found": "Utilisateur non trouvé",
        "token_invalid": "Jeton invalide ou expiré",
        "forbidden": "Accès réservé aux administrateurs",

        # scripts/cierre_periodo.py
        "cierre_tipo_no_existe": "Le type de document 'CIERRE' n'existe pas. Exécutez seed.py",
        "no_docs_periodo": "⚠️ Aucun document trouvé pour cette période",
        "cierre_generado": "✅ Clôture générée pour {year}-{month:02d}",
        "totales": "   Total USD : {total_usd}, Total MN : {total_mn}",

        # schemas/usuario.py
        "invalid_role": "Rôle invalide. Seuls 'employé' ou 'admin' sont autorisés.",

        # schemas/um.py
        "invalid_factor": "Le facteur doit être -1 ou 1",

        # schemas/tipo_documento.py
        "invalid_clave": "La clé doit contenir uniquement des lettres majuscules (A-Z)",

        # schemas/proveedor.py
        "invalid_proveedor_nombre": "Le nom du fournisseur ne peut pas être vide",

        # schemas/producto.py
        "invalid_producto_nombre": "Le nom du produit ne peut pas être vide",
        "invalid_producto_existencias": "L'existence minimale ne peut pas être supérieure à l'existence maximale",
        "invalid_producto_existencia_max": "L'existence maximale doit être supérieure à 0",

        # routes/centros_costo.py
        "centro_costo_existente": "Un centre de coût avec ce compte ou ce nom existe déjà",
        "centro_costo_no_encontrado": "Centre de coût non trouvé",
        "centro_costo_ya_desactivado": "Le centre de coût était déjà désactivé",
        "centro_costo_desactivado_ok": "Centre de coût désactivé avec succès",
        "centro_costo_ya_activo": "Le centre de coût est déjà actif",
        "centro_costo_reactivado_ok": "Centre de coût réactivé avec succès",

        # schemas/movimiento.py
        "invalid_movimiento_tipo": "Le type de mouvement doit être 'entrada' ou 'salida'",
        "invalid_movimiento_cantidad": "La quantité doit être supérieure à 0",

        # schemas/moneda.py
        "invalid_moneda_nombre": "Le nom de la devise ne peut pas être vide",

        # schemas/documento.py
        "invalid_importe_usd": "Le montant en USD ne peut pas être négatif",
        "invalid_importe_mn": "Le montant en MN ne peut pas être négatif",

        # schemas/contraparte.py
        "invalid_cuentacont": "Le compte comptable doit être un entier positif",
        "invalid_nomcont": "Le nom de la contrepartie ne peut pas être vide",

        # schemas/consumo.py
        "invalid_actividad_id": "L'identifiant de l'activité doit être un entier positif",
        "invalid_cantpers": "Le nombre de personnes doit être supérieur à 0",

        # schemas/combinacion.py
        "invalid_cc": "Le centre de coût (cc) ne peut pas être vide",
        "invalid_cont": "Le compte comptable (cont) ne peut pas être vide",
        "invalid_cl": "La classification (cl) ne peut pas être vide",

        # schemas/centro_costo.py
        "invalid_cuentacc": "Le compte de coût ne peut pas être vide",
        "invalid_nomcc": "Le nom du centre de coût ne peut pas être vide",

        # schemas/categoria.py
        "invalid_categoria_nombre": "Le nom de la catégorie ne peut pas être vide",

        # schemas/actividad.py et actividad_cerrada.py
        "invalid_codact": "Le code de l'activité doit être un entier positif",
        "invalid_nomact": "Le nom de l'activité ne peut pas être vide",
        "invalid_rango_fechas": "La date de fin ne peut pas être antérieure à la date de début",
        "invalid_monto_no_negativo": "Le champ '{field}' ne peut pas être négatif",

        # routes/usuarios.py
        "usuario_existente": "L'utilisateur existe déjà",

        # routes/um.py
        "um_existente_activa": "Une UM active avec cette clé existe déjà",
        "um_no_encontrada": "Unité non trouvée",
        "um_ya_desactivada": "L'unité '{um_id}' était déjà désactivée",
        "um_desactivada_ok": "L'unité '{um_id}' a été désactivée avec succès",
        "um_ya_activa": "L'unité '{um_id}' est déjà active",

        # routes/tipos_documentos.py
        "tipo_doc_conflicto_reactivacion": "Le type de document '{clave}' existe désactivé avec des valeurs différentes. Vous devez en créer un nouveau avec une autre clé.",
        "tipo_doc_existente_activo": "Un type de document actif avec cette clé existe déjà",
        "tipo_doc_no_encontrado": "Type de document non trouvé",
        "tipo_doc_ya_desactivado": "Le type de document '{clave}' était déjà désactivé",
        "tipo_doc_desactivado_ok": "Le type de document '{clave}' a été désactivé avec succès",
        "tipo_doc_ya_activo": "Le type de document '{clave}' est déjà actif",

        # routes/proveedores.py
        "proveedor_no_encontrado": "Fournisseur non trouvé",
        "proveedor_existente": "Un fournisseur avec ce nom existe déjà",
        "proveedor_ya_desactivado": "Le fournisseur était déjà désactivé",
        "proveedor_desactivado_ok": "Fournisseur désactivé avec succès",
        "proveedor_ya_activo": "Le fournisseur est déjà actif",
        "proveedor_reactivado_ok": "Fournisseur réactivé avec succès",

        # routes/productos.py
        "producto_existente": "Un produit avec ce nom existe déjà dans l'entreprise",
        "producto_no_encontrado": "Produit non trouvé",
        "producto_eliminado_ok": "Produit supprimé avec succès",
        "producto_existencias_invalidas": "Les existences minimale et maximale doivent être des valeurs valides",

        # routes/movimientos.py
        "stock_insuficiente_salida": "Stock insuffisant pour effectuer la sortie",
        "movimiento_tipo_invalido": "Type de mouvement invalide (utilisez 'entrada' ou 'salida')",
        "movimiento_no_encontrado": "Mouvement non trouvé",
        "producto_original_no_encontrado": "Produit original non trouvé",
        "producto_nuevo_no_encontrado": "Nouveau produit non trouvé",
        "stock_insuficiente_actualizar": "Stock insuffisant pour mettre à jour la sortie",
        "movimiento_eliminado_ok": "Mouvement supprimé et stock rétabli",

        # routes/monedas.py
        "moneda_existente_activa": "Une devise active avec ce nom existe déjà",
        "moneda_no_encontrada": "Devise non trouvée",
        "moneda_ya_desactivada": "La devise '{nombre}' était déjà désactivée",
        "moneda_desactivada_ok": "La devise '{nombre}' a été désactivée avec succès",
        "moneda_ya_activa": "La devise '{nombre}' est déjà active",

        # routes/documentos.py
        "documento_no_encontrado": "Document non trouvé",

        # routes/contrapartes.py
        "contraparte_no_encontrada": "Contrepartie non trouvée",

        # routes/combinaciones.py
        "combinacion_no_encontrada": "Combinaison non trouvée",

        # routes/categorias.py
        "categoria_existente": "Une catégorie avec ce nom existe déjà",
        "categoria_existente_otro": "Une autre catégorie avec ce nom existe déjà",
        "categoria_no_encontrada": "Catégorie non trouvée",
        "categoria_eliminada_ok": "Catégorie supprimée avec succès",

        # routes/actividades_cerradas.py
        "actividad_cerrada_no_encontrada": "Activité clôturée non trouvée",

        # routes/actividades.py
        "actividad_no_encontrada": "Activité non trouvée",
        "actividad_ya_cerrada": "L'activité est déjà clôturée",
    },

    "ru": {
        # core (main.py, deps.py, auth)
        "welcome": "Добро пожаловать в систему управления инвентаризацией 🚀",
        "db_ok": "Подключение к базе данных успешно",
        "invalid_credentials": "Неверные учетные данные",
        "user_not_found": "Пользователь не найден",
        "token_invalid": "Недействительный или просроченный токен",
        "forbidden": "Доступ разрешен только администраторам",

        # scripts/cierre_periodo.py
        "cierre_tipo_no_existe": "Тип документа 'CIERRE' не существует. Запустите seed.py",
        "no_docs_periodo": "⚠️ В этом периоде документы отсутствуют",
        "cierre_generado": "✅ Закрытие создано для {year}-{month:02d}",
        "totales": "   Итого USD: {total_usd}, Итого MN: {total_mn}",

        # schemas/usuario.py
        "invalid_role": "Недопустимая роль. Разрешены только 'empleado' или 'admin'.",

        # schemas/um.py
        "invalid_factor": "Фактор должен быть -1 или 1",

        # schemas/tipo_documento.py
        "invalid_clave": "Ключ должен содержать только заглавные буквы (A-Z)",

        # schemas/proveedor.py
        "invalid_proveedor_nombre": "Имя поставщика не может быть пустым",

        # schemas/producto.py
        "invalid_producto_nombre": "Имя продукта не может быть пустым",
        "invalid_producto_existencias": "Минимальное количество не может быть больше максимального",
        "invalid_producto_existencia_max": "Максимальное количество должно быть больше 0",

        # schemas/movimiento.py
        "invalid_movimiento_tipo": "Тип движения должен быть 'entrada' или 'salida'",
        "invalid_movimiento_cantidad": "Количество должно быть больше 0",

        # schemas/moneda.py
        "invalid_moneda_nombre": "Название валюты не может быть пустым",

        # schemas/documento.py
        "invalid_importe_usd": "Сумма в USD не может быть отрицательной",
        "invalid_importe_mn": "Сумма в MN не может быть отрицательной",

        # schemas/contraparte.py
        "invalid_cuentacont": "Бухгалтерский счет должен быть положительным целым числом",
        "invalid_nomcont": "Имя контрагента не может быть пустым",

        # schemas/consumo.py
        "invalid_actividad_id": "Идентификатор активности должен быть положительным целым числом",
        "invalid_cantpers": "Количество людей должно быть больше 0",

        # schemas/combinacion.py
        "invalid_cc": "Центр затрат (cc) не может быть пустым",
        "invalid_cont": "Бухгалтерский счет (cont) не может быть пустым",
        "invalid_cl": "Классификация (cl) не может быть пустой",

        # schemas/centro_costo.py
        "invalid_cuentacc": "Счет затрат не может быть пустым",
        "invalid_nomcc": "Название центра затрат не может быть пустым",

        # schemas/categoria.py
        "invalid_categoria_nombre": "Название категории не может быть пустым",

        # schemas/actividad.py и actividad_cerrada.py
        "invalid_codact": "Код активности должен быть положительным целым числом",
        "invalid_nomact": "Название активности не может быть пустым",
        "invalid_rango_fechas": "Дата окончания не может быть раньше даты начала",
        "invalid_monto_no_negativo": "Поле '{field}' не может быть отрицательным",

        # routes/usuarios.py
        "usuario_existente": "Пользователь уже существует",

        # routes/um.py
        "um_existente_activa": "Активная ЕИ с этим ключом уже существует",
        "um_no_encontrada": "Единица не найдена",
        "um_ya_desactivada": "Единица '{um_id}' уже была деактивирована",
        "um_desactivada_ok": "Единица '{um_id}' успешно деактивирована",
        "um_ya_activa": "Единица '{um_id}' уже активна",

        # routes/tipos_documentos.py
        "tipo_doc_conflicto_reactivacion": "Тип документа '{clave}' существует в деактивированном виде с другими значениями. Необходимо создать новый с другим ключом.",
        "tipo_doc_existente_activo": "Активный тип документа с этим ключом уже существует",
        "tipo_doc_no_encontrado": "Тип документа не найден",
        "tipo_doc_ya_desactivado": "Тип документа '{clave}' уже был деактивирован",
        "tipo_doc_desactivado_ok": "Тип документа '{clave}' успешно деактивирован",
        "tipo_doc_ya_activo": "Тип документа '{clave}' уже активен",

        # routes/proveedores.py
        "proveedor_no_encontrado": "Поставщик не найден",
        "proveedor_existente": "Поставщик с таким названием уже существует",
        "proveedor_ya_desactivado": "Поставщик уже был деактивирован",
        "proveedor_desactivado_ok": "Поставщик успешно деактивирован",
        "proveedor_ya_activo": "Поставщик уже активен",
        "proveedor_reactivado_ok": "Поставщик успешно реактивирован",

        # routes/productos.py
        "producto_existente": "Продукт с таким названием уже существует в компании",
        "producto_no_encontrado": "Продукт не найден",
        "producto_eliminado_ok": "Продукт успешно удален",
        "producto_existencias_invalidas": "Минимальное и максимальное количество должны быть допустимыми значениями",

        # routes/centros_costo.py
        "centro_costo_existente": "Центр затрат с таким счётом или названием уже существует",
        "centro_costo_no_encontrado": "Центр затрат не найден",
        "centro_costo_ya_desactivado": "Центр затрат уже был деактивирован",
        "centro_costo_desactivado_ok": "Центр затрат успешно деактивирован",
        "centro_costo_ya_activo": "Центр затрат уже активен",
        "centro_costo_reactivado_ok": "Центр затрат успешно реактивирован",

        # routes/movimientos.py
        "stock_insuficiente_salida": "Недостаточно запаса для выполнения списания",
        "movimiento_tipo_invalido": "Недопустимый тип движения (используйте 'entrada' или 'salida')",
        "movimiento_no_encontrado": "Движение не найдено",
        "producto_original_no_encontrado": "Исходный продукт не найден",
        "producto_nuevo_no_encontrado": "Новый продукт не найден",
        "stock_insuficiente_actualizar": "Недостаточно запаса для обновления списания",
        "movimiento_eliminado_ok": "Движение удалено и запас восстановлен",

        # routes/monedas.py
        "moneda_existente_activa": "Активная валюта с таким названием уже существует",
        "moneda_no_encontrada": "Валюта не найдена",
        "moneda_ya_desactivada": "Валюта '{nombre}' уже была деактивирована",
        "moneda_desactivada_ok": "Валюта '{nombre}' успешно деактивирована",
        "moneda_ya_activa": "Валюта '{nombre}' уже активна",

        # routes/documentos.py
        "documento_no_encontrado": "Документ не найден",

        # routes/contrapartes.py
        "contraparte_no_encontrada": "Контрагент не найден",

        # routes/combinaciones.py
        "combinacion_no_encontrada": "Комбинация не найдена",

        # routes/categorias.py
        "categoria_existente": "Категория с таким названием уже существует",
        "categoria_existente_otro": "Другая категория с таким названием уже существует",
        "categoria_no_encontrada": "Категория не найдена",
        "categoria_eliminada_ok": "Категория успешно удалена",

        # routes/actividades_cerradas.py
        "actividad_cerrada_no_encontrada": "Закрытая активность не найдена",

        # routes/actividades.py
        "actividad_no_encontrada": "Активность не найдена",
        "actividad_ya_cerrada": "Активность уже закрыта",
    }

}


def get_message(key: str, lang: str = "es") -> str:
    """
    Devuelve el mensaje traducido según la clave y el idioma.
    Si no existe el idioma, usa español por defecto.
    Si no existe la clave, devuelve la clave literal.
    """
    return MESSAGES.get(lang, MESSAGES["es"]).get(key, key)
