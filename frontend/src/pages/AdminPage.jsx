// ============================================================
// Archivo: frontend/src/pages/AdminPage.jsx
// Descripción: Página de administración visible solo para usuarios con rol "admin".
//              Incluye ejemplo de uso de AuthContext y logout.
// Autor: CrimsonKnight90
// ============================================================

import { useAuth } from "../context/AuthContext"

export default function AdminPage() {
  const { user, logout } = useAuth()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-yellow-100">
      <h1 className="text-3xl font-bold text-yellow-800 mb-6">
        🛠️ Panel de Administración
      </h1>

      {user && (
        <p className="text-lg text-gray-700 mb-4">
          Sesión iniciada como:{" "}
          <span className="font-semibold">{user.email}</span> ({user.role})
        </p>
      )}

      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Cerrar sesión
      </button>
    </div>
  )
}
