// ============================================================
// Archivo: frontend/src/components/Topbar.jsx
// Descripción: Barra superior con logo, nombre de empresa, idioma y usuario/logout
// Autor: CrimsonKnight90
// ============================================================

import { useBranding } from "../context/BrandingContext"
import { useAuth } from "../context/AuthContext"
import LanguageSwitcherDropdown from "./LanguageSwitcherDropdown"
import AppButton from "./AppButton"
import { useTranslation } from "react-i18next"

export default function Topbar() {
  const { branding } = useBranding()
  const { user, isAuthenticated, logout } = useAuth()
  const { t } = useTranslation()

  const logoSrc = branding?.logo_url
    ? `${branding.logo_url}?t=${Date.now()}`
    : "/uploads/logo.png"

  return (
    <header
      className="flex items-center justify-between shadow px-6 py-3"
      style={{
        backgroundColor: branding?.topbar_color || "#0F172A",
        color: "white",
      }}
    >
      {/* Branding */}
      <div className="flex items-center space-x-2">
        <img src={logoSrc} alt="Logo" className="h-8 w-8 object-contain" />
        <span className="text-lg font-bold">
          {branding?.app_name || "Inventario Pro"}
        </span>
      </div>

      {/* Acciones globales */}
      {isAuthenticated && (
        <div className="flex items-center space-x-4">
          {/* Usuario */}
          <span className="text-sm">
            {user?.email} ({user?.role})
          </span>

          {/* Botón de logout centralizado */}
          <AppButton variant="danger" size="sm" onClick={logout}>
            {t("nav.logout", { defaultValue: "Cerrar sesión" })}
          </AppButton>

          {/* Idiomas */}
          <LanguageSwitcherDropdown variant="text" />
        </div>
      )}
    </header>
  )
}
