// ============================================================
// Archivo: frontend/src/pages/listados/ActividadesCerradasPage.jsx
// Descripción: Listado de actividades cerradas (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useEffect, useState } from "react"
import { apiClient } from "../../utils/apiClient"
import { useTranslation } from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import AppTable from "../../components/AppTable"

export default function ActividadesCerradasPage() {
  const { t } = useTranslation()
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const data = await apiClient.get("/actividades/cerradas")
        setActividades(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        setError(
          t("actividades.error_load_closed", {
            defaultValue: "Error al cargar actividades cerradas",
          })
        )
      } finally {
        setLoading(false)
      }
    }
    fetchActividades()
  }, [t])

  const fmt = (dt) => {
    if (!dt) return "-"
    const d = new Date(dt)
    return isNaN(d.getTime()) ? "-" : d.toLocaleString()
  }

  return (
    <AppPageContainer>
      <AppHeading level={1}>
        🔒 {t("actividades.closed_title", { defaultValue: "Actividades Cerradas" })}
      </AppHeading>

      {loading && (
        <p className="mb-4">
          ⏳{" "}
          {t("actividades.loading_closed", {
            defaultValue: "Cargando actividades cerradas...",
          })}
        </p>
      )}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {!loading && !error && (
        <AppSection>
          <AppTable
            headers={[
              "ID",
              t("actividades.name", { defaultValue: "Nombre" }),
              t("actividades.start_date", { defaultValue: "Fecha inicio" }),
              t("actividades.end_date", { defaultValue: "Fecha fin" }),
            ]}
          >
            {actividades.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  {t("actividades.no_closed", { defaultValue: "No hay actividades cerradas" })}
                </td>
              </tr>
            ) : (
              actividades.map((act) => (
                <tr key={act.codact} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{act.codact}</td>
                  <td className="px-4 py-2 border truncate max-w-[300px]">{act.nomact}</td>
                  <td className="px-4 py-2 border">{fmt(act.fechaini)}</td>
                  <td className="px-4 py-2 border">{fmt(act.fechafin)}</td>
                </tr>
              ))
            )}
          </AppTable>
        </AppSection>
      )}
    </AppPageContainer>
  )
}
