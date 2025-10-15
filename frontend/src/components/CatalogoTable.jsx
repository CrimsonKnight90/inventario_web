// ============================================================
// Archivo: frontend/src/components/CatalogoTable.jsx
// Descripción: Tabla genérica para catálogos con activar/desactivar (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useTranslation } from "react-i18next"

export default function CatalogoTable({ data, columns, onActivate, onDeactivate }) {
  const { t } = useTranslation()

  return (
    <table className="min-w-full bg-white border border-gray-200 rounded shadow">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="px-4 py-2 border">{col.label}</th>
          ))}
          <th className="px-4 py-2 border">{t("catalogo.estado")}</th>
          <th className="px-4 py-2 border">{t("catalogo.acciones")}</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 2} className="text-center py-4 text-gray-500">
              {t("catalogo.no_registros")}
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item[columns[0].key]} className={item.activo ? "" : "bg-gray-100 text-gray-500"}>
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2 border">{item[col.key]}</td>
              ))}
              <td className="px-4 py-2 border">{item.activo ? t("catalogo.activo") : t("catalogo.inactivo")}</td>
              <td className="px-4 py-2 border space-x-2">
                {item.activo ? (
                  <button
                    onClick={() => onDeactivate(item)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                  >
                    {t("catalogo.desactivar")}
                  </button>
                ) : (
                  <button
                    onClick={() => onActivate(item)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    {t("catalogo.activar")}
                  </button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
