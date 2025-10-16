// ============================================================
// Archivo: frontend/src/pages/ConfigPage.jsx
// Descripción: Página de administración para modificar branding (nombre, logo, colores)
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { useBranding } from "../context/BrandingContext"

export default function ConfigPage() {
  const { branding, updateBranding, uploadLogo } = useBranding()
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (branding) {
      setForm(branding)
    }
  }, [branding])

  if (!form) return <p>Cargando configuración...</p>

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateBranding(form)
    alert("✅ Configuración actualizada")
  }

  const restoreDefaults = () => {
    setForm({
      ...form,
      app_name: "Inventario Pro",
      logo_url: "/uploads/logo.png",
      primary_color: "#1E293B",   // 👈 gris azulado oscuro
      secondary_color: "#3B82F6", // 👈 azul medio moderno
      background_color: "#F8FAFC" // 👈 gris muy claro
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⚙️ Configuración de Branding</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block mb-1">Nombre de la empresa</label>
          <input
            type="text"
            name="app_name"
            value={form.app_name || ""}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block mb-1">Logo (URL)</label>
          <input
            type="text"
            name="logo_url"
            value={form.logo_url || ""}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {/* Subir logo */}
        <div>
          <label className="block mb-1">Subir nuevo logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) uploadLogo(e.target.files[0])
            }}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {/* Colores */}
        <div className="flex space-x-4">
          <div>
            <label className="block mb-1">Color primario</label>
            <input
              type="color"
              name="primary_color"
              value={form.primary_color || "#1E293B"}   // 👈 fallback actualizado
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1">Color secundario</label>
            <input
              type="color"
              name="secondary_color"
              value={form.secondary_color || "#3B82F6"} // 👈 fallback actualizado
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={restoreDefaults}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Restaurar colores por defecto
          </button>
        </div>
      </form>
    </div>
  )
}
