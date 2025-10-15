// ============================================================
// Archivo: frontend/src/pages/listados/ActividadesCreadasPage.jsx
// Descripción: Listado de actividades abiertas/creadas (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useEffect, useState } from "react"
import { useApiClient } from "../../utils/apiClient"
import { useTranslation } from "react-i18next"

export default function ActividadesCreadasPage() {
  const { request } = useApiClient()
  const { t } = useTranslation()
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await request("/actividades/creadas")
        const data = await res.json()
        setActividades(data)
      } catch (err) {
        setError(t("actividades.error_load_created"))
      } finally {
        setLoading(false)
      }
    }
    fetchActividades()
  }, [])

  if (loading) return <p className="p-6">⏳ {t("actividades.loading_created")}</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">✅ {t("actividades.created_title")}</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">{t("actividades.name")}</th>
            <th className="px-4 py-2 border">{t("actividades.start_date")}</th>
          </tr>
        </thead>
        <tbody>
          {actividades.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-500">
                {t("actividades.no_open")}
              </td>
            </tr>
          ) : (
            actividades.map((act) => (
              <tr key={act.codact} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{act.codact}</td>
                <td className="px-4 py-2 border">{act.nomact}</td>
                <td className="px-4 py-2 border">
                  {act.fechaini ? new Date(act.fechaini).toLocaleString() : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
