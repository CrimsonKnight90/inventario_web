// ============================================================
// Archivo: frontend/src/components/Topbar.jsx
// Descripción: Barra superior con logo, nombre de empresa, idioma y usuario/logout
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { Link } from "react-router-dom"
import { useBranding } from "../context/BrandingContext"
import { useAuth } from "../context/AuthContext"
import LanguageSwitcherDropdown from "./LanguageSwitcherDropdown"
import AppButton from "./AppButton"
import AppConfirmDialog from "./AppConfirmDialog"
import { useTranslation } from "react-i18next"

export default function Topbar() {
  const { branding } = useBranding()
  const { user, isAuthenticated, logout } = useAuth()
  const { t } = useTranslation()
  const [confirmLogout, setConfirmLogout] = useState(false)

  const logoSrc = branding?.logo_url
    ? `${branding.logo_url}?t=${Date.now()}`
    : "/uploads/logo.png"

  return (
    <header
      role="banner"
      className="flex items-center justify-between shadow px-6 py-3 border-b border-gray-700"
      style={{
        backgroundColor: branding?.topbar_color || "#0F172A",
        color: "white",
      }}
    >
      {/* Branding */}
      <Link to="/dashboard" className="flex items-center space-x-2">
        <img
          src={logoSrc}
          alt={branding?.app_name || "Inventario Pro"}
          className="h-8 w-8 object-contain"
        />
        <span className="text-lg font-bold">
          {branding?.app_name || "Inventario Pro"}
        </span>
      </Link>

      {/* Acciones globales */}
      {isAuthenticated && (
        <div className="flex items-center space-x-4">
          {/* Usuario */}
          <span className="hidden sm:inline text-sm">
            {user?.email} (
            {t(`roles.${user?.role}`, { defaultValue: user?.role })}
            )
          </span>

          {/* Botón de logout con confirmación */}
          <AppButton
            variant="danger"
            size="sm"
            onClick={() => setConfirmLogout(true)}
          >
            {t("nav.logout", { defaultValue: "Cerrar sesión" })}
          </AppButton>

          {/* Idiomas */}
          <LanguageSwitcherDropdown variant="text" />
        </div>
      )}

      {/* Confirmación de logout */}
      <AppConfirmDialog
        isOpen={confirmLogout}
        message={t("nav.confirm_logout", {
          defaultValue: "¿Seguro que deseas cerrar sesión?",
        })}
        onConfirm={logout}
        onCancel={() => setConfirmLogout(false)}
        confirmText={t("nav.logout", { defaultValue: "Cerrar sesión" })}
        cancelText={t("cancel", { defaultValue: "Cancelar" })}
      />
    </header>
  )
}
