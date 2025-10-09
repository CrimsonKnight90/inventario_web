// ============================================================
// Archivo: frontend/src/components/MovimientoForm.jsx
// Descripción: Formulario para registrar movimientos de stock
//              (entrada/salida) asociados a un producto.
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useApiClient } from "../utils/apiClient"

export default function MovimientoForm({ productoId, onCreated }) {
  const { request } = useApiClient()
  const [tipo, setTipo] = useState("entrada")
  const [cantidad, setCantidad] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await request("/movimientos/", {
        method: "POST",
        body: JSON.stringify({
          tipo,
          cantidad: parseInt(cantidad),
          producto_id: productoId,
        }),
      })

      if (!response.ok) {
        const msg = await response.text()
        throw new Error(msg || `Error ${response.status}`)
      }

      const data = await response.json()
      if (onCreated) onCreated(data)
      setCantidad("")
    } catch (err) {
      setError(err.message)
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
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>

      <input
        type="number"
        placeholder="Cantidad"
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
        {loading ? "..." : "Registrar"}
      </button>

      {error && <span className="text-red-600 text-sm ml-2">{error}</span>}
    </form>
  )
}
