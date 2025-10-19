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
import Notification from "../../components/Notification"
import { useNotification } from "../../hooks/useNotification"
import { getErrorDetail } from "../../utils/errorUtils"

export default function CrearActividadPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ nomact: "", fechaini: "", fechafin: "" })
  const [loading, setLoading] = useState(false)
  const { notif, notify, clear } = useNotification()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.post("/actividades/", form)
      notify.success(t("actividades.create_success", { defaultValue: "Actividad creada correctamente" }))
      setForm({ nomact: "", fechaini: "", fechafin: "" })
    } catch (err) {
      notify.error(getErrorDetail(err, t("actividades.error_create", { defaultValue: "Error al crear actividad" })))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppPageContainer>
      <Notification message={notif.message} type={notif.type} onClose={clear} />

      <AppHeading level={1}>➕ {t("actividades.create_title", { defaultValue: "Crear actividad" })}</AppHeading>

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
