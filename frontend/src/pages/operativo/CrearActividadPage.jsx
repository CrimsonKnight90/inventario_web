// frontend/src/pages/operativo/CrearActividadPage.jsx
import { useState } from "react"
import { useApiClient } from "../../utils/apiClient"

export default function CrearActividadPage() {
  const { request } = useApiClient()
  const [form, setForm] = useState({ nomact: "", fechaini: "", fechafin: "" })
  const [mensaje, setMensaje] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await request("/actividades/", {
        method: "POST",
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Error al crear actividad")
      setMensaje("✅ Actividad creada correctamente")
      setForm({ nomact: "", fechaini: "", fechafin: "" })
    } catch (err) {
      setMensaje("❌ " + err.message)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-card rounded-xl">
      <h1 className="text-2xl font-heading text-primary-dark mb-4">
        ➕ Crear Actividad
      </h1>
      {mensaje && <p className="mb-4">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nomact"
          placeholder="Nombre de la actividad"
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
          Crear
        </button>
      </form>
    </div>
  )
}
