import { useAuth } from "../context/AuthContext"
import { useApiClient } from "../utils/apiClient"
import { useEffect, useState } from "react"
import { API_URL } from "../config"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { request } = useApiClient()
  const [productos, setProductos] = useState([])

  useEffect(() => {
    request(`${API_URL}/productos/`)
      .then((res) => res.json())
      .then(setProductos)
      .catch((err) => console.error(err))
  }, [request])

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-100">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        ✅ Bienvenido al Dashboard
      </h1>

      {user && (
        <p className="text-lg text-gray-700 mb-4">
          Sesión iniciada como: <span className="font-semibold">{user.email}</span> ({user.role})
        </p>
      )}

      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Cerrar sesión
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">📦 Productos</h2>
        <ul>
          {productos.map((p) => (
            <li key={p.id}>{p.nombre}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
