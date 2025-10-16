// ============================================================
// Archivo: frontend/src/pages/operativo/CrearActividadPage.jsx
// Descripción: Formulario para crear nuevas actividades (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { apiClient } from "../../utils/apiClient"
import { useTranslation } from "react-i18next"

export default function CrearActividadPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ nomact: "", fechaini: "", fechafin: "" })
  const [mensaje, setMensaje] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post("/actividades/", form)
      setMensaje(t("actividades.create_success"))
      setForm({ nomact: "", fechaini: "", fechafin: "" })
    } catch (err) {
      setMensaje("❌ " + (err.message || t("actividades.error_create")))
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-card rounded-xl">
      <h1 className="text-2xl font-heading text-primary-dark mb-4">
        ➕ {t("actividades.create_title")}
      </h1>
      {mensaje && <p className="mb-4">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nomact"
          placeholder={t("actividades.name_placeholder")}
          value={form.nomact}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
        <input
          type="datetime-local"
          name="fechaini"
          value={form.fechaini}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
        <input
          type="datetime-local"
          name="fechafin"
          value={form.fechafin}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark"
        >
          {t("actividades.create_button")}
        </button>
      </form>
    </div>
  )
}
