// ============================================================
// Archivo: frontend/src/pages/listados/ActividadesCreadasPage.jsx
// Descripción: Listado de actividades abiertas/creadas (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useEffect, useState } from "react"
import { apiClient } from "../../utils/apiClient"
import { useTranslation } from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import AppTable from "../../components/AppTable"

export default function ActividadesCreadasPage() {
  const { t } = useTranslation()
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const data = await apiClient.get("/actividades/creadas")
        setActividades(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        setError(
          t("actividades.error_load_created", {
            defaultValue: "Error al cargar actividades creadas",
          })
        )
      } finally {
        setLoading(false)
      }
    }
    fetchActividades()
  }, [t])

  return (
    <AppPageContainer>
      <AppHeading level={1}>
        ✅ {t("actividades.created_title", { defaultValue: "Actividades Creadas" })}
      </AppHeading>

      {loading && (
        <p className="mb-4">
          ⏳{" "}
          {t("actividades.loading_created", {
            defaultValue: "Cargando actividades creadas...",
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
            ]}
          >
            {actividades.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  {t("actividades.no_open", { defaultValue: "No hay actividades abiertas" })}
                </td>
              </tr>
            ) : (
              actividades.map((act) => (
                <tr key={act.codact} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{act.codact}</td>
                  <td className="px-4 py-2 border truncate max-w-[300px]">{act.nomact}</td>
                  <td className="px-4 py-2 border">
                    {act.fechaini ? new Date(act.fechaini).toLocaleString() : "-"}
                  </td>
                </tr>
              ))
            )}
          </AppTable>
        </AppSection>
      )}
    </AppPageContainer>
  )
}
