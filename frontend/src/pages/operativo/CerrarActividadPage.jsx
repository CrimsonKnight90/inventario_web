// frontend/src/pages/operativo/CerrarActividadPage.jsx
import { useEffect, useState } from "react"
import { useApiClient } from "../../utils/apiClient"
import { useTranslation } from "react-i18next"

export default function CerrarActividadPage() {
  const { request } = useApiClient()
  const { t } = useTranslation()
  const [actividades, setActividades] = useState([])
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    request("/actividades/")
      .then((res) => res.json())
      .then((data) => setActividades(data.filter((a) => !a.actcerrada)))
      .catch(() => setMensaje("❌ " + t("actividades.load_error")))
  }, [])

  const cerrarActividad = async (actividad) => {
    try {
      const res = await request(`/actividades/${actividad.codact}/cerrar`, {
        method: "POST",
        body: JSON.stringify({ observaciones: "Cerrada desde frontend" }),
      })
      if (!res.ok) throw new Error(t("actividades.error_close"))
      setMensaje(t("actividades.close_success"))
      setActividades((prev) => prev.filter((a) => a.codact !== actividad.codact))
    } catch (err) {
      setMensaje("❌ " + err.message)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-card rounded-xl">
      <h1 className="text-2xl font-heading text-primary-dark mb-4">
        🔒 {t("actividades.close_title")}
      </h1>
      {mensaje && <p className="mb-4">{mensaje}</p>}
      {actividades.length === 0 ? (
        <p className="text-gray-500">{t("actividades.no_open")}</p>
      ) : (
        <ul className="space-y-3">
          {actividades.map((a) => (
            <li key={a.codact} className="flex justify-between items-center border p-3 rounded-lg">
              <span>
                {a.nomact} ({a.fechaini?.slice(0, 10)} → {a.fechafin?.slice(0, 10)})
              </span>
              <button
                onClick={() => cerrarActividad(a)}
                className="bg-danger text-white px-3 py-1 rounded hover:bg-danger-dark"
              >
                {t("actividades.close_button")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
