// ============================================================
// Archivo: frontend/src/pages/parametros/MonedasPage.jsx
// Descripción: Gestión de Monedas (CRUD con activación/desactivación) (i18n)
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

export default function MonedasPage() {
  const { data: monedas, create, activate, deactivate } = useCatalogo("/monedas")
  const { t } = useTranslation()
  const [form, setForm] = useState({ nombre: "" })
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await create(form)
      setMensaje(t("monedas.created_success", { defaultValue: "Moneda creada correctamente" }))
      setForm({ nombre: "" })
    } catch (err) {
      setError("❌ " + (err.message || t("monedas.error_create", { defaultValue: "Error al crear moneda" })))
    }
  }

  return (
    <AppPageContainer>
      {/* Notificación global */}
      <Notification message={mensaje || error} type={error ? "error" : "success"} onClose={() => { setMensaje(""); setError(""); }} />

      <AppHeading level={1}>💱 {t("monedas.title", { defaultValue: "Gestión de Monedas" })}</AppHeading>

      {/* Formulario de creación */}
      <AppSection>
        <AppForm onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1">
            <label className="block mb-1 text-sm text-gray-600">
              {t("monedas.name_label", { defaultValue: "Nombre de la moneda" })}
            </label>
            <AppInput
              type="text"
              placeholder={t("monedas.name_placeholder", { defaultValue: "Ej: Peso Cubano" })}
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>
          <AppButton type="submit" variant="primary">
            {t("monedas.create_button", { defaultValue: "Crear" })}
          </AppButton>
        </AppForm>
      </AppSection>

      {/* Tabla de monedas */}
      <AppSection>
        <CatalogoTable
          data={monedas}
          columns={[{ key: "nombre", label: t("monedas.name", { defaultValue: "Nombre" }) }]}
          onActivate={(m) => activate(m.nombre)}
          onDeactivate={(m) => deactivate(m.nombre)}
        />
      </AppSection>
    </AppPageContainer>
  )
}
