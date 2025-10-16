// ============================================================
// Archivo: frontend/src/components/Navbar.jsx
// Descripción: Sidebar lateral con navegación, logout e i18n, mostrando branding dinámico
// Autor: CrimsonKnight90
// ============================================================

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LanguageSwitcher from "./LanguageSwitcher"
import { useTranslation } from "react-i18next"
import { useBranding } from "../context/BrandingContext"

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { t } = useTranslation()
  const { branding } = useBranding()

  const hoverStyle = {
    backgroundColor: branding?.secondary_color || "#3B82F6",
  }

  return (
    <aside
      className="w-64 text-white flex flex-col"
      style={{ backgroundColor: branding?.primary_color || "#1E293B" }}
    >
      {/* Logo / Header */}
      <div className="flex items-center space-x-2 px-6 py-4 text-2xl font-bold border-b border-gray-700">
        <img
          src={branding?.logo_url || "/uploads/logo.png"}
          alt="Logo"
          className="h-8 w-8 object-contain"
        />
        <span>{branding?.app_name || "Inventario Pro"}</span>
      </div>

      {/* Links de navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {isAuthenticated && (
          <>
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded transition"
              style={{}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              📊 {t("nav.dashboard", { defaultValue: "Dashboard" })}
            </Link>
            <Link
              to="/productos"
              className="block px-3 py-2 rounded transition"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              📦 {t("nav.products", { defaultValue: "Productos" })}
            </Link>

            {/* 🔹 Sección Operativo */}
            <div className="mt-6">
              <p className="text-xs uppercase text-gray-400 mb-2">
                {t("nav.operativo", { defaultValue: "Operativo" })}
              </p>
              <Link
                to="/operativo/actividades/crear"
                className="block px-3 py-2 rounded transition"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ➕ {t("nav.create_activity", { defaultValue: "Crear Actividad" })}
              </Link>
              <Link
                to="/operativo/actividades/cerrar"
                className="block px-3 py-2 rounded transition"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                🔒 {t("nav.close_activity", { defaultValue: "Cerrar Actividad" })}
              </Link>
            </div>

            {/* 🔹 Nueva sección Listados */}
            <div className="mt-6">
              <p className="text-xs uppercase text-gray-400 mb-2">
                {t("nav.listados", { defaultValue: "Listados" })}
              </p>
              <Link
                to="/listados/actividades"
                className="block px-3 py-2 rounded transition"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                📋 {t("nav.all_activities", { defaultValue: "Todas las Actividades" })}
              </Link>
              <Link
                to="/listados/actividades/creadas"
                className="block px-3 py-2 rounded transition"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ✅ {t("nav.created_activities", { defaultValue: "Actividades Creadas" })}
              </Link>
              <Link
                to="/listados/actividades/cerradas"
                className="block px-3 py-2 rounded transition"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                🔒 {t("nav.closed_activities", { defaultValue: "Actividades Cerradas" })}
              </Link>
            </div>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link
              to="/admin"
              className="block px-3 py-2 rounded transition"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              🛠️ {t("nav.admin", { defaultValue: "Admin" })}
            </Link>
            <Link
              to="/config"
              className="block px-3 py-2 rounded transition"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              ⚙️ {t("nav.config", { defaultValue: "Configuración" })}
            </Link>
          </>
        )}
      </nav>

      {/* 🔹 Sección Parámetros */}
      {user?.role === "admin" && (
        <div className="mt-6">
          <p className="text-xs uppercase text-gray-400 mb-2">
            {t("nav.parameters", { defaultValue: "Parámetros" })}
          </p>
          <Link
            to="/parametros/um"
            className="block px-3 py-2 rounded transition"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ⚖️ {t("nav.units", { defaultValue: "Unidades de Medida" })}
          </Link>
          <Link
            to="/parametros/monedas"
            className="block px-3 py-2 rounded transition"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            💱 {t("nav.currencies", { defaultValue: "Monedas" })}
          </Link>
          <Link
            to="/parametros/tipos-documentos"
            className="block px-3 py-2 rounded transition"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            📑 {t("nav.doc_types", { defaultValue: "Tipos de Documento" })}
          </Link>
        </div>
      )}

      {/* Footer con usuario, logout y selector de idioma */}
      {isAuthenticated && (
        <div className="px-4 py-4 border-t border-gray-700">
          <p className="text-sm text-gray-300 mb-2">
            {user?.email} <br />
            <span className="text-xs text-gray-400">({user?.role})</span>
          </p>
          <button
            onClick={logout}
            className="w-full bg-red-500 px-3 py-2 rounded hover:bg-red-600 transition text-sm mb-3"
          >
            {t("nav.logout", { defaultValue: "Cerrar sesión" })}
          </button>

          {/* ✅ Selector de idioma reutilizable */}
          <LanguageSwitcher />
        </div>
      )}
    </aside>
  )
}
