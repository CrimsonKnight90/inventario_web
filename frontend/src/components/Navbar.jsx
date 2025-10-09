// ============================================================
// Archivo: frontend/src/components/Navbar.jsx
// Descripción: Sidebar lateral con navegación y logout.
// Autor: CrimsonKnight90
// ============================================================

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      {/* Logo / Header */}
      <div className="px-6 py-4 text-2xl font-bold border-b border-gray-700">
        Inventario
      </div>

      {/* Links de navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {isAuthenticated && (
          <>
            <Link to="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-700 transition">
              📊 Dashboard
            </Link>
            <Link to="/productos" className="block px-3 py-2 rounded hover:bg-gray-700 transition">
              📦 Productos
            </Link>

            {/* 🔹 Sección Operativo */}
            <div className="mt-6">
              <p className="text-xs uppercase text-gray-400 mb-2">Operativo</p>
              <Link to="/operativo/actividades/crear" className="block px-3 py-2 rounded hover:bg-gray-700 transition">
                ➕ Crear Actividad
              </Link>
              <Link to="/operativo/actividades/cerrar" className="block px-3 py-2 rounded hover:bg-gray-700 transition">
                🔒 Cerrar Actividad
              </Link>
            </div>

            {/* 🔹 Nueva sección Listados */}
            <div className="mt-6">
              <p className="text-xs uppercase text-gray-400 mb-2">Listados</p>
              <Link to="/listados/actividades" className="block px-3 py-2 rounded hover:bg-gray-700 transition">
                📋 Todas las Actividades
              </Link>
              <Link to="/listados/actividades/creadas" className="block px-3 py-2 rounded hover:bg-gray-700 transition">
                ✅ Actividades Creadas
              </Link>
              <Link to="/listados/actividades/cerradas" className="block px-3 py-2 rounded hover:bg-gray-700 transition">
                🔒 Actividades Cerradas
              </Link>
            </div>
          </>
        )}

        {user?.role === "admin" && (
          <Link to="/admin" className="block px-3 py-2 rounded hover:bg-gray-700 transition">
            🛠️ Admin
          </Link>
        )}
      </nav>

      {/* Footer con usuario y logout */}
      {isAuthenticated && (
        <div className="px-4 py-4 border-t border-gray-700">
          <p className="text-sm text-gray-300 mb-2">
            {user?.email} <br />
            <span className="text-xs text-gray-400">({user?.role})</span>
          </p>
          <button
            onClick={logout}
            className="w-full bg-red-500 px-3 py-2 rounded hover:bg-red-600 transition text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  )
}
