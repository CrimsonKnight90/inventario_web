// ============================================================
// Archivo: frontend/src/pages/listados/ActividadesPage.jsx
// Descripción: Listado de todas las actividades (creadas y cerradas) con layout unificado
// Autor: CrimsonKnight90
// ============================================================

import { useEffect, useState } from "react"
import { apiClient } from "../../utils/apiClient"
import { useTranslation } from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import AppTable from "../../components/AppTable"
import Notification from "../../components/Notification"
import { useNotification } from "../../hooks/useNotification"
import { getErrorDetail } from "../../utils/errorUtils"

export default function ActividadesPage() {
  const { t } = useTranslation()
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const { notif, notify, clear } = useNotification()

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const data = await apiClient.get("/actividades")
        setActividades(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        notify.error(getErrorDetail(err, t("actividades.load_error", { defaultValue: "Error al cargar actividades" })))
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
      <Notification message={notif.message} type={notif.type} onClose={clear} />

      <AppHeading level={1}>
        📋 {t("actividades.list_title", { defaultValue: "Listado de Actividades" })}
      </AppHeading>

      {loading && (
        <p className="mb-4">⏳ {t("actividades.loading", { defaultValue: "Cargando actividades..." })}</p>
      )}

      {!loading && (
        <AppSection>
          <AppTable
            headers={[
              "ID",
              t("actividades.name", { defaultValue: "Nombre" }),
              t("actividades.start_date", { defaultValue: "Fecha inicio" }),
              t("actividades.end_date", { defaultValue: "Fecha fin" }),
              t("actividades.status", { defaultValue: "Estado" }),
            ]}
          >
            {actividades.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  {t("actividades.no_records", { defaultValue: "No hay registros" })}
                </td>
              </tr>
            ) : (
              actividades.map((act) => (
                <tr key={act.codact} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{act.codact}</td>
                  <td className="px-4 py-2 border truncate max-w-[300px]">{act.nomact}</td>
                  <td className="px-4 py-2 border">{fmt(act.fechaini)}</td>
                  <td className="px-4 py-2 border">{fmt(act.fechafin)}</td>
                  <td className="px-4 py-2 border">
                    {act.actcerrada
                      ? t("actividades.closed", { defaultValue: "Cerrada" })
                      : t("actividades.open", { defaultValue: "Abierta" })}
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
