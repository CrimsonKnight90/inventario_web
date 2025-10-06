// ============================================================
// Archivo: frontend/src/pages/ProductosPage.jsx
// Descripción: Página de productos. Consume la API protegida
//              usando useApiClient y muestra listado de productos.
//              Incluye formulario de creación de productos y
//              formulario de movimientos por producto.
// Autor: CrimsonKnight90
// ============================================================

import { useEffect, useState } from "react"
import { useApiClient } from "../utils/apiClient"
import { API_URL } from "../config"
import ProductoForm from "../components/ProductoForm"
import MovimientoForm from "../components/MovimientoForm"

export default function ProductosPage() {
  const { request } = useApiClient()
  const [productos, setProductos] = useState([])
  const [error, setError] = useState("")

  // Cargar productos al montar
  useEffect(() => {
    request(`${API_URL}/productos/`)
      .then((res) => res.json())
      .then(setProductos)
      .catch((err) => {
        console.error(err)
        setError("No se pudieron cargar los productos")
      })
  }, [request])

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold">📦 Lista de Productos</h1>

      {/* Formulario de creación de productos */}
      <ProductoForm onCreated={(nuevo) => setProductos([...productos, nuevo])} />

      {error && <p className="text-red-600">{error}</p>}

      {productos.length === 0 ? (
        <p className="text-gray-600">No hay productos disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {productos.map((p) => (
            <li
              key={p.id}
              className="border p-3 rounded flex flex-col space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{p.nombre}</span>
                <span className="text-gray-500">Stock: {p.stock}</span>
              </div>

              {/* Formulario de movimiento para este producto */}
              <MovimientoForm
                productoId={p.id}
                onCreated={(mov) => {
                  // Refrescar stock en la lista según tipo de movimiento
                  setProductos((prev) =>
                    prev.map((prod) =>
                      prod.id === p.id
                        ? {
                            ...prod,
                            stock:
                              mov.tipo === "entrada"
                                ? prod.stock + mov.cantidad
                                : prod.stock - mov.cantidad,
                          }
                        : prod
                    )
                  )
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
