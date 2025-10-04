// ============================================================
// Archivo: frontend/src/pages/ProductosPage.jsx
// Descripción: Página de productos. Consume la API protegida
//              usando useApiClient y muestra listado de productos.
// Autor: CrimsonKnight90
// ============================================================

import { useEffect, useState } from "react"
import { useApiClient } from "../utils/apiClient"

export default function ProductosPage() {
  const { request } = useApiClient()
  const [productos, setProductos] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    // Llamada al backend para obtener productos
    request("http://localhost:8000/productos")
      .then((res) => res.json())
      .then(setProductos)
      .catch((err) => {
        console.error(err)
        setError("No se pudieron cargar los productos")
      })
  }, [request])

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📦 Lista de Productos</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {productos.length === 0 ? (
        <p className="text-gray-600">No hay productos disponibles.</p>
      ) : (
        <ul className="space-y-2">
          {productos.map((p) => (
            <li
              key={p.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <span className="font-semibold">{p.nombre}</span>
              <span className="text-gray-500">Stock: {p.stock}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
