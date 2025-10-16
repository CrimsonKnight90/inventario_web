// ============================================================
// Archivo: frontend/src/components/MovimientoForm.jsx
// Descripción: Formulario para registrar movimientos de stock (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { apiClient } from "../utils/apiClient"
import { useTranslation } from "react-i18next"

export default function MovimientoForm({ productoId, onCreated }) {
  const { t } = useTranslation()
  const [tipo, setTipo] = useState("entrada")
  const [cantidad, setCantidad] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await apiClient.post("/movimientos/", {
        tipo,
        cantidad: parseInt(cantidad),
        producto_id: productoId,
      })
      if (onCreated) onCreated(data)
      setCantidad("")
    } catch (err) {
      setError(err.message || t("movimiento.error_create"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 items-center mt-2">
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="entrada">{t("movimiento.entrada")}</option>
        <option value="salida">{t("movimiento.salida")}</option>
      </select>

      <input
        type="number"
        placeholder={t("movimiento.cantidad")}
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        required
        className="w-24 px-2 py-1 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
      >
        {loading ? "..." : t("movimiento.submit")}
      </button>

      {error && <span className="text-red-600 text-sm ml-2">{error}</span>}
    </form>
  )
}
