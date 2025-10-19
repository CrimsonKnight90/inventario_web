// ============================================================
// Archivo: frontend/src/components/ProductoTable.jsx
// Descripción: Tabla especializada para productos con activar/desactivar y editar (opcional)
// Autor: CrimsonKnight90
// ============================================================

import {useTranslation} from "react-i18next"
import AppButton from "./AppButton"
import AppTable from "./AppTable"

export default function ProductoTable({data = [], onEdit, onActivate, onDeactivate, loading = false}) {
    const {t} = useTranslation()

    const headers = [
        "ID",
        t("producto.name", {defaultValue: "Nombre"}),
        t("producto.existencia_min", {defaultValue: "Existencia mín."}),
        t("producto.existencia_max", {defaultValue: "Existencia máx."}),
        t("producto.category", {defaultValue: "Categoría"}),
        t("producto.um", {defaultValue: "UM"}),
        t("producto.moneda", {defaultValue: "Moneda"}),
        t("catalogo.estado", {defaultValue: "Estado"}),
        t("catalogo.acciones", {defaultValue: "Acciones"}),
    ]

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
                        {t("productos.no_records", {defaultValue: "No hay productos"})}
                    </td>
                </tr>
            ) : (
                data.map((p) => (
                    <tr key={p.id} className={p.activo ? "hover:bg-gray-50" : "bg-gray-100 text-gray-500"}>
                        <td className="px-4 py-2 border">{p.id}</td>
                        <td className="px-4 py-2 border">{p.nombre}</td>
                        <td className="px-4 py-2 border">{p.existencia_min}</td>
                        <td className="px-4 py-2 border">{p.existencia_max}</td>
                        <td className="px-4 py-2 border">{p.categoria?.nombre || "-"}</td>
                        <td className="px-4 py-2 border">{p.um?.um || "-"}</td>
                        <td className="px-4 py-2 border">{p.moneda?.nombre || "-"}</td>
                        <td className="px-4 py-2 border">
                            {p.activo
                                ? t("catalogo.activo", {defaultValue: "Activo"})
                                : t("catalogo.inactivo", {defaultValue: "Inactivo"})}
                        </td>
                        <td className="px-4 py-2 border space-x-2">
                            {onEdit && (
                                <AppButton size="sm" variant="secondary" onClick={() => onEdit(p)}>
                                    ✏️ {t("catalogo.editar", {defaultValue: "Editar"})}
                                </AppButton>
                            )}
                            {p.activo ? (
                                <AppButton size="sm" variant="danger" onClick={() => onDeactivate(p)}>
                                    🗑️ {t("catalogo.desactivar", {defaultValue: "Desactivar"})}
                                </AppButton>
                            ) : (
                                <AppButton size="sm" variant="success" onClick={() => onActivate(p)}>
                                    ♻️ {t("catalogo.activar", {defaultValue: "Reactivar"})}
                                </AppButton>
                            )}

                        </td>
                    </tr>
                ))
            )}
        </AppTable>
    )
}
