// ============================================================
// Archivo: frontend/src/components/ProveedorForm.jsx
// Descripción: Formulario controlado para crear/editar proveedores (con i18n).
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useTranslation } from "react-i18next"
import AppForm from "./AppForm"
import AppInput from "./AppInput"
import AppButton from "./AppButton"
import AppHeading from "./AppHeading"

export default function ProveedorForm({ onCreated, initialValues, onCreate, onUpdate }) {
  const { t } = useTranslation()
  const [nombre, setNombre] = useState(initialValues?.nombre || "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validación simple y preventiva
    if (!nombre.trim()) {
      setError(t("proveedor.error_nombre", { defaultValue: "El nombre no puede estar vacío" }))
      setLoading(false)
      return
    }

    try {
      const payload = { nombre }

      if (initialValues?.id) {
        await onUpdate(initialValues.id, payload)
      } else {
        await onCreate(payload)
      }

      if (onCreated) onCreated()
      if (!initialValues) setNombre("")

    } catch (err) {
      setError(err.message || t("proveedor.error_save", { defaultValue: "Error al guardar proveedor" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppForm onSubmit={handleSubmit} className="space-y-4">
      <AppHeading level={2}>
        {initialValues?.id
          ? t("proveedor.edit_title", { defaultValue: "Editar proveedor" })
          : t("proveedor.create_title", { defaultValue: "Crear proveedor" })}
      </AppHeading>

      {error && <p className="text-red-600">{error}</p>}

      <AppInput
        type="text"
        placeholder={t("proveedor.name", { defaultValue: "Nombre" })}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <AppButton type="submit" variant="primary" size="md" className="w-full">
        {loading
          ? t("proveedor.saving", { defaultValue: "Guardando..." })
          : initialValues?.id
          ? t("proveedor.update_button", { defaultValue: "Actualizar" })
          : t("proveedor.create_button", { defaultValue: "Crear" })}
      </AppButton>
    </AppForm>
  )
}
