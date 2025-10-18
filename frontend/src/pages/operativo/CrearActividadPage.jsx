// ============================================================
// Archivo: frontend/src/pages/operativo/CrearActividadPage.jsx
// Descripción: Formulario para crear nuevas actividades (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { apiClient } from "../../utils/apiClient"
import { useTranslation } from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import AppForm from "../../components/AppForm"
import AppInput from "../../components/AppInput"
import AppButton from "../../components/AppButton"

export default function CrearActividadPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ nomact: "", fechaini: "", fechafin: "" })
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje("")
    setError("")
    setLoading(true)
    try {
      await apiClient.post("/actividades/", form)
      setMensaje(t("actividades.create_success", { defaultValue: "Actividad creada correctamente" }))
      setForm({ nomact: "", fechaini: "", fechafin: "" })
    } catch (err) {
      setError(err.message || t("actividades.error_create", { defaultValue: "Error al crear actividad" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppPageContainer>
      <AppHeading level={1}>➕ {t("actividades.create_title", { defaultValue: "Crear actividad" })}</AppHeading>

      {mensaje && <p className="mb-4 text-green-700">{mensaje}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <AppSection>
        <AppForm onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              {t("actividades.name_label", { defaultValue: "Nombre de la actividad" })}
            </label>
            <AppInput
              type="text"
              name="nomact"
              placeholder={t("actividades.name_placeholder", { defaultValue: "Nombre" })}
              value={form.nomact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm text-gray-600">
                {t("actividades.start_date", { defaultValue: "Fecha inicio" })}
              </label>
              <AppInput
                type="datetime-local"
                name="fechaini"
                value={form.fechaini}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">
                {t("actividades.end_date", { defaultValue: "Fecha fin" })}
              </label>
              <AppInput
                type="datetime-local"
                name="fechafin"
                value={form.fechafin}
                onChange={handleChange}
              />
            </div>
          </div>

          <AppButton type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading
              ? t("actividades.loading", { defaultValue: "Procesando..." })
              : t("actividades.create_button", { defaultValue: "Crear actividad" })}
          </AppButton>
        </AppForm>
      </AppSection>
    </AppPageContainer>
  )
}
