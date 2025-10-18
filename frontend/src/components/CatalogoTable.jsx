// ============================================================
// Archivo: frontend/src/components/CatalogoTable.jsx
// Descripción: Tabla genérica para catálogos con activar/desactivar (i18n),
//              construida sobre AppTable para evitar duplicación.
// Autor: CrimsonKnight90
// ============================================================

import {useTranslation} from "react-i18next"
import AppTable from "./AppTable"
import AppButton from "./AppButton"

export default function CatalogoTable({data, columns, onActivate, onDeactivate}) {
    const {t} = useTranslation()

    const headers = [
        ...columns.map((col) => col.label),
        t("catalogo.estado"),
        t("catalogo.acciones"),
    ]

    return (
        <AppTable headers={headers}>
            {data.length === 0 ? (
                <tr>
                    <td colSpan={headers.length} className="text-center py-4 text-gray-500">
                        {t("catalogo.no_registros")}
                    </td>
                </tr>
            ) : (
                data.map((item) => (
                    <tr
                        key={item[columns[0].key]}
                        className={item.activo ? "hover:bg-gray-50" : "bg-gray-100 text-gray-500"}
                    >
                        {columns.map((col) => (
                            <td key={col.key} className="px-4 py-2 border">
                                {item[col.key]}
                            </td>
                        ))}
                        <td className="px-4 py-2 border">
                            {item.activo ? t("catalogo.activo") : t("catalogo.inactivo")}
                        </td>
                        <td className="px-4 py-2 border space-x-2">
                            {item.activo ? (
                                <AppButton
                                    size="sm"
                                    variant="danger"
                                    onClick={() => onDeactivate(item)}
                                >
                                    🗑️{t("catalogo.desactivar")}
                                </AppButton>
                            ) : (
                                <AppButton
                                    size="sm"
                                    variant="success"
                                    onClick={() => onActivate(item)}
                                >
                                   ♻️{t("catalogo.activar")}
                                </AppButton>
                            )}
                        </td>
                    </tr>
                ))
            )}
        </AppTable>
    )
}
