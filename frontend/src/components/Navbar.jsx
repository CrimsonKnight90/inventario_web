// ============================================================
// Archivo: frontend/src/components/Navbar.jsx
// Descripción: Barra de navegación dinámica que muestra enlaces
//              según autenticación y rol del usuario.
// Autor: CrimsonKnight90
// ============================================================

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      {/* Sección izquierda: enlaces de navegación */}
      <div className="flex space-x-4">
        {isAuthenticated && (
          <>
            <Link to="/dashboard" className="hover:text-yellow-300">
              Dashboard
            </Link>
            <Link to="/productos" className="hover:text-yellow-300">
              Productos
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <Link to="/admin" className="hover:text-yellow-300">
            Admin
          </Link>
        )}
      </div>

      {/* Sección derecha: usuario o login */}
      <div className="flex space-x-4 items-center">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-gray-300">
              {user?.email} ({user?.role})
            </span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  )
}
