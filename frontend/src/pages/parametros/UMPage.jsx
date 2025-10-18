// ============================================================
// Archivo: frontend/src/pages/parametros/UMPage.jsx
// Descripción: Gestión de UM (CRUD con activación/desactivación) (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useCatalogo } from "../../hooks/useCatalogo"
import CatalogoTable from "../../components/CatalogoTable"
import Notification from "../../components/Notification"
import { useTranslation } from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import AppForm from "../../components/AppForm"
import AppInput from "../../components/AppInput"
import AppButton from "../../components/AppButton"

export default function UMPage() {
  const { data: ums, create, activate, deactivate } = useCatalogo("/um")
  const { t } = useTranslation()
  const [form, setForm] = useState({ um: "", factor: 1 })
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await create(form)
      setMensaje(t("um.created_success", { defaultValue: "UM creada correctamente" }))
      setForm({ um: "", factor: 1 })
    } catch (err) {
      setError("❌ " + (err.message || t("um.error_create", { defaultValue: "Error al crear UM" })))
    }
  }

  return (
    <AppPageContainer>
      {/* Notificación global */}
      <Notification
        message={mensaje || error}
        type={error ? "error" : "success"}
        onClose={() => {
          setMensaje("")
          setError("")
        }}
      />

      <AppHeading level={1}>⚖️ {t("um.title", { defaultValue: "Gestión de UM" })}</AppHeading>

      {/* Formulario */}
      <AppSection>
        <AppForm onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              {t("um.key_label", { defaultValue: "Clave UM" })}
            </label>
            <AppInput
              type="text"
              placeholder={t("um.key_placeholder", { defaultValue: "Ej: KG" })}
              value={form.um}
              onChange={(e) => setForm({ ...form, um: e.target.value })}
              required
              className="w-32"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">
              {t("um.factor_label", { defaultValue: "Factor" })}
            </label>
            <AppInput
              type="number"
              placeholder={t("um.factor_placeholder", { defaultValue: "Ej: 1" })}
              value={form.factor}
              onChange={(e) => setForm({ ...form, factor: parseInt(e.target.value) || 0 })}
              className="w-32"
            />
          </div>

          <AppButton type="submit" variant="primary">
            {t("um.create_button", { defaultValue: "Crear" })}
          </AppButton>
        </AppForm>
      </AppSection>

      {/* Tabla de UM */}
      <AppSection>
        <CatalogoTable
          data={ums}
          columns={[
            { key: "um", label: "UM" },
            { key: "factor", label: t("um.factor", { defaultValue: "Factor" }) },
          ]}
          onActivate={(u) => activate(u.um)}
          onDeactivate={(u) => deactivate(u.um)}
        />
      </AppSection>
    </AppPageContainer>
  )
}
