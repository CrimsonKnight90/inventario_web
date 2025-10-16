// ============================================================
// Archivo: frontend/src/components/ProductoForm.jsx
// Descripción: Formulario controlado para crear productos (con i18n).
//              Usa apiClient centralizado para enviar POST al backend.
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { apiClient } from "../utils/apiClient"
import { useTranslation } from "react-i18next"

export default function ProductoForm({ onCreated }) {
  const { t } = useTranslation()
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  const [stock, setStock] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await apiClient.post("/productos/", {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: stock ? parseInt(stock) : 0,
        categoria_id: categoriaId ? parseInt(categoriaId) : null,
      })

      if (onCreated) onCreated(data) // callback para refrescar lista

      // Reset formulario
      setNombre("")
      setDescripcion("")
      setPrecio("")
      setStock("")
      setCategoriaId("")
    } catch (err) {
      setError(err.message || t("producto.error_create"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded shadow">
      <h2 className="text-lg font-bold">➕ {t("producto.create_title")}</h2>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        placeholder={t("producto.name")}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded"
      />

      <input
        type="text"
        placeholder={t("producto.description")}
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />

      <input
        type="number"
        placeholder={t("producto.price")}
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded"
      />

      <input
        type="number"
        placeholder={t("producto.stock")}
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />

      <input
        type="number"
        placeholder={t("producto.category_id")}
        value={categoriaId}
        onChange={(e) => setCategoriaId(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? t("producto.creating") : t("producto.create_button")}
      </button>
    </form>
  )
}
