// ============================================================
// Archivo: frontend/src/components/ContraparteForm.jsx
// Descripción: Formulario controlado para crear/editar Contrapartes
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useTranslation } from "react-i18next"
import AppForm from "./AppForm"
import AppInput from "./AppInput"
import AppButton from "./AppButton"
import AppHeading from "./AppHeading"

export default function ContraparteForm({ onCreated, initialValues, onCreate, onUpdate }) {
  const { t } = useTranslation()
  const [cuentacont, setCuentacont] = useState(initialValues?.cuentacont || "")
  const [nomcont, setNomcont] = useState(initialValues?.nomcont || "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const formatoValido = /^\d{3}-\d{2}-\d{2}-\d{2}$/.test(cuentacont)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formatoValido) {
      setError(t("contraparte.error_cuentacont", { defaultValue: "Formato inválido (000-00-00-00)" }))
      setLoading(false)
      return
    }
    if (!nomcont.trim()) {
      setError(t("contraparte.error_nomcont", { defaultValue: "La denominación no puede estar vacía" }))
      setLoading(false)
      return
    }

    try {
      const payload = { cuentacont, nomcont }
      if (initialValues?.cuentacont) {
        await onUpdate(initialValues.cuentacont, payload)
      } else {
        await onCreate(payload)
      }
      if (onCreated) onCreated()
      if (!initialValues) {
        setCuentacont("")
        setNomcont("")
      }
    } catch (err) {
      setError(err.message || t("contraparte.error_save", { defaultValue: "Error al guardar contraparte" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppForm onSubmit={handleSubmit} className="space-y-4">
      <AppHeading level={2}>
        {initialValues?.cuentacont
          ? t("contraparte.edit_title", { defaultValue: "Editar Contraparte" })
          : t("contraparte.create_title", { defaultValue: "Crear Contraparte" })}
      </AppHeading>

      {error && <p className="text-red-600">{error}</p>}

      <AppInput
        type="text"
        placeholder={t("contraparte.cuentacont_placeholder", { defaultValue: "Ej: 000-00-00-00" })}
        value={cuentacont}
        onChange={(e) => setCuentacont(e.target.value)}
        required
        disabled={!!initialValues?.cuentacont}
      />

      <AppInput
        type="text"
        placeholder={t("contraparte.nomcont", { defaultValue: "Denominación" })}
        value={nomcont}
        onChange={(e) => setNomcont(e.target.value)}
        required
      />

      <AppButton type="submit" variant="primary" size="md" className="w-full">
        {loading
          ? t("contraparte.saving", { defaultValue: "Guardando..." })
          : initialValues?.cuentacont
          ? t("contraparte.update_button", { defaultValue: "Actualizar" })
          : t("contraparte.create_button", { defaultValue: "Crear" })}
      </AppButton>
    </AppForm>
  )
}
