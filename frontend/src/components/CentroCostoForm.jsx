// ============================================================
// Archivo: frontend/src/components/CentroCostoForm.jsx
// Descripción: Formulario controlado para crear/editar Centros de Costo
//              SIN verificación en tiempo real.
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useTranslation } from "react-i18next"
import AppForm from "./AppForm"
import AppInput from "./AppInput"
import AppButton from "./AppButton"
import AppHeading from "./AppHeading"

export default function CentroCostoForm({ onCreated, initialValues, onCreate, onUpdate }) {
  const { t } = useTranslation()
  const [cuentacc, setCuentacc] = useState(initialValues?.cuentacc || "")
  const [nomcc, setNomcc] = useState(initialValues?.nomcc || "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const formatoValido = /^\d{3}-\d{2}-\d{2}-\d{2}$/.test(cuentacc)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formatoValido) {
      setError(t("centro_costo.error_cuentacc", { defaultValue: "Formato inválido (000-00-00-00)" }))
      setLoading(false)
      return
    }
    if (!nomcc.trim()) {
      setError(t("centro_costo.error_nomcc", { defaultValue: "La denominación no puede estar vacía" }))
      setLoading(false)
      return
    }

    try {
      const payload = { cuentacc, nomcc }
      if (initialValues?.cuentacc) {
        await onUpdate(initialValues.cuentacc, payload)
      } else {
        await onCreate(payload)
      }
      if (onCreated) onCreated()
      if (!initialValues) {
        setCuentacc("")
        setNomcc("")
      }
    } catch (err) {
      setError(err.message || t("centro_costo.error_save", { defaultValue: "Error al guardar centro de costo" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppForm onSubmit={handleSubmit} className="space-y-4">
      <AppHeading level={2}>
        {initialValues?.cuentacc
          ? t("centro_costo.edit_title", { defaultValue: "Editar Centro de Costo" })
          : t("centro_costo.create_title", { defaultValue: "Crear Centro de Costo" })}
      </AppHeading>

      {error && <p className="text-red-600">{error}</p>}

      <AppInput
        type="text"
        placeholder={t("centro_costo.cuentacc_placeholder", { defaultValue: "Ej: 000-00-00-00" })}
        value={cuentacc}
        onChange={(e) => setCuentacc(e.target.value)}
        required
        disabled={!!initialValues?.cuentacc}
      />

      <AppInput
        type="text"
        placeholder={t("centro_costo.nomcc", { defaultValue: "Denominación" })}
        value={nomcc}
        onChange={(e) => setNomcc(e.target.value)}
        required
      />

      <AppButton type="submit" variant="primary" size="md" className="w-full">
        {loading
          ? t("centro_costo.saving", { defaultValue: "Guardando..." })
          : initialValues?.cuentacc
          ? t("centro_costo.update_button", { defaultValue: "Actualizar" })
          : t("centro_costo.create_button", { defaultValue: "Crear" })}
      </AppButton>
    </AppForm>
  )
}
