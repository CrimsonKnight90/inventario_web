// ============================================================
// Archivo: frontend/src/pages/operativo/CerrarActividadPage.jsx
// Descripción: Listado de actividades abiertas con opción de cierre (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useEffect, useState } from "react"
import { apiClient } from "../../utils/apiClient"
import { useTranslation } from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import AppButton from "../../components/AppButton"

export default function CerrarActividadPage() {
  const { t } = useTranslation()
  const [actividades, setActividades] = useState([])
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    apiClient
      .get("/actividades/")
      .then((data) => setActividades(data.filter((a) => !a.actcerrada)))
      .catch(() => setError("❌ " + t("actividades.load_error", { defaultValue: "Error al cargar actividades" })))
  }, [t])

  const cerrarActividad = async (actividad) => {
    try {
      await apiClient.post(`/actividades/${actividad.codact}/cerrar`, {
        observaciones: "Cerrada desde frontend",
      })
      setMensaje(t("actividades.close_success", { defaultValue: "Actividad cerrada correctamente" }))
      setActividades((prev) => prev.filter((a) => a.codact !== actividad.codact))
    } catch (err) {
      setError("❌ " + (err.message || t("actividades.error_close", { defaultValue: "Error al cerrar actividad" })))
    }
  }

  return (
    <AppPageContainer>
      <AppHeading level={1}>🔒 {t("actividades.close_title", { defaultValue: "Cerrar actividades" })}</AppHeading>

      {mensaje && <p className="mb-4 text-green-700">{mensaje}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <AppSection>
        {actividades.length === 0 ? (
          <p className="text-gray-500">{t("actividades.no_open", { defaultValue: "No hay actividades abiertas" })}</p>
        ) : (
          <ul className="space-y-3">
            {actividades.map((a) => (
              <li
                key={a.codact}
                className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50"
              >
                <span>
                  {a.nomact} ({a.fechaini?.slice(0, 10)} → {a.fechafin?.slice(0, 10)})
                </span>
                <AppButton
                  variant="danger"
                  size="sm"
                  onClick={() => cerrarActividad(a)}
                >
                  {t("actividades.close_button", { defaultValue: "Cerrar" })}
                </AppButton>
              </li>
            ))}
          </ul>
        )}
      </AppSection>
    </AppPageContainer>
  )
}
