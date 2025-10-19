// ============================================================
// Archivo: frontend/src/components/CatalogoTable.jsx
// Descripción: Tabla genérica para catálogos con activar/desactivar/editar (i18n) opcionales,
//              construida sobre AppTable para evitar duplicación. Soporta loading.
//              Ahora soporta renderActions para casos especiales (ej. AdminPage).
// Autor: CrimsonKnight90
// ============================================================

import {useMemo} from "react"
import {useTranslation} from "react-i18next"
import AppTable from "./AppTable"
import AppButton from "./AppButton"

export default function CatalogoTable({
                                          data = [],
                                          columns = [],
                                          loading = false,
                                          onActivate,
                                          onDeactivate,
                                          onEdit,
                                          showEstado = true, // 🔹 permite ocultar columna Estado si se desea
                                          renderActions,     // 🔹 nuevo: permite inyectar acciones personalizadas
                                      }) {
    const {t} = useTranslation()

    const hasGenericActions = !!(onEdit || onActivate || onDeactivate)
    const hasCustomActions = typeof renderActions === "function"
    const hasActions = hasGenericActions || hasCustomActions

    const headers = useMemo(() => {
        const base = [...columns.map((col) => col.label)]
        if (showEstado) base.push(t("catalogo.estado", {defaultValue: "Estado"}))
        if (hasActions) base.push(t("catalogo.acciones", {defaultValue: "Acciones"}))
        return base
    }, [columns, t, showEstado, hasActions])

    // Helper para obtener key estable del item
    const getRowKey = (item) => {
        const primaryKey = columns[0]?.key
        return item?.[primaryKey] ?? JSON.stringify(item)
    }

    return (
        <AppTable headers={headers}>
            {loading ? (
                <tr>
                    <td colSpan={headers.length} className="text-center py-4 text-gray-500">
                        {t("catalogo.cargando", {defaultValue: "Cargando..."})}
                    </td>
                </tr>
            ) : data.length === 0 ? (
                <tr>
                    <td colSpan={headers.length} className="text-center py-4 text-gray-500">
                        {t("catalogo.no_registros", {defaultValue: "Sin registros"})}
                    </td>
                </tr>
            ) : (
                data.map((item) => (
                    <tr
                        key={getRowKey(item)}
                        className={
                            showEstado
                                ? (item.activo ? "hover:bg-gray-50" : "bg-gray-100 text-gray-500")
                                : "hover:bg-gray-50"
                        }
                    >
                        {columns.map((col) => (
                            <td key={col.key} className="px-4 py-2 border">
                                {item?.[col.key] ?? "-"}
                            </td>
                        ))}

                        {showEstado && (
                            <td className="px-4 py-2 border">
                                {item.activo
                                    ? t("catalogo.activo", {defaultValue: "Activo"})
                                    : t("catalogo.inactivo", {defaultValue: "Inactivo"})}
                            </td>
                        )}

                        {hasActions && (
                            <td className="px-4 py-2 border space-x-2">
                                {/* 🔹 Acciones genéricas */}
                                {onEdit && (
                                    <AppButton size="sm" variant="secondary" onClick={() => onEdit(item)}>
                                        ✏️ {t("catalogo.editar", {defaultValue: "Editar"})}
                                    </AppButton>
                                )}

                                {item.activo && onDeactivate && (
                                    <AppButton
                                        size="sm"
                                        variant="danger"
                                        onClick={() => onDeactivate(item)}
                                    >
                                        🗑️ {t("catalogo.desactivar", {defaultValue: "Desactivar"})}
                                    </AppButton>
                                )}

                                {!item.activo && onActivate && (
                                    <AppButton
                                        size="sm"
                                        variant="success"
                                        onClick={() => onActivate(item)}
                                    >
                                        ♻️ {t("catalogo.activar", {defaultValue: "Reactivar"})}
                                    </AppButton>
                                )}

                                {/* 🔹 Acciones personalizadas */}
                                {hasCustomActions && renderActions(item)}
                            </td>
                        )}
                    </tr>
                ))
            )}
        </AppTable>
    )
}
