// ============================================================
// Archivo: frontend/src/components/Topbar.jsx
// Descripción: Barra superior con logo, nombre de empresa, idioma y usuario/logout
// Autor: CrimsonKnight90
// ============================================================

import {useState} from "react"
import {Link} from "react-router-dom"
import {useBranding} from "../context/BrandingContext"
import {useAuth} from "../context/AuthContext"
import LanguageSwitcherDropdown from "./LanguageSwitcherDropdown"
import AppButton from "./AppButton"
import AppConfirmDialog from "./AppConfirmDialog"
import {useTranslation} from "react-i18next"

export default function Topbar() {
    const {branding} = useBranding()
    const {user, isAuthenticated, logout} = useAuth()
    const {t} = useTranslation()
    const [confirmLogout, setConfirmLogout] = useState(false)

    // Uso defensivo de claves de branding (canonical + aliases)
    const logoPath = branding?.logo ?? branding?.logo_url ?? "/uploads/logo.png"
    const logoSrc = `${logoPath}?t=${Date.now()}`

    const appName = branding?.appName ?? branding?.app_name ?? "Inventario Pro"

    return (
        <header
            role="banner"
            className="fixed top-0 left-0 right-0 flex items-center justify-between shadow px-6 py-3 z-40 safe-topbar"
            style={{
                height: "var(--topbar-height)",
                minHeight: "var(--topbar-height)",
                lineHeight: "var(--topbar-height)",
                backgroundColor: branding?.colors?.topbar ?? branding?.topbar_color ?? "#0F172A",
                color: "white",
                borderTop: "none",
                borderBottom: `1px solid ${branding?.colors?.topbar ?? branding?.topbar_color ?? "#0F172A"}`,
            }}
        >

            {/* Branding */}
            <Link to="/dashboard" className="flex items-center space-x-2">
                <img src={logoSrc} alt={appName} className="h-8 w-8 object-contain"/>
                <span className="text-lg font-bold">{appName}</span>
            </Link>

            {/* Acciones globales */}
            {isAuthenticated && (
                <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-sm">
            {user?.email} ({t(`roles.${user?.role}`, {defaultValue: user?.role})})
          </span>

                    <AppButton variant="danger" size="sm" onClick={() => setConfirmLogout(true)}>
                        {t("nav.logout", {defaultValue: "Cerrar sesión"})}
                    </AppButton>

                    <LanguageSwitcherDropdown variant="text"/>
                </div>
            )}

            <AppConfirmDialog
                isOpen={confirmLogout}
                message={t("nav.confirm_logout", {defaultValue: "¿Seguro que deseas cerrar sesión?"})}
                onConfirm={logout}
                onCancel={() => setConfirmLogout(false)}
                confirmText={t("nav.logout", {defaultValue: "Cerrar sesión"})}
                cancelText={t("cancel", {defaultValue: "Cancelar"})}
            />
        </header>
    )
}
