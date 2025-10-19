// ============================================================
// Archivo: frontend/src/pages/ForbiddenPage.jsx
// Descripción: Página de error 403 (Acceso prohibido) con soporte i18n.
// Autor: CrimsonKnight90
// ============================================================

import { useTranslation } from "react-i18next"
import AppHeading from "../components/AppHeading"
import AppButton from "../components/AppButton"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ForbiddenPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
      <AppHeading level={1}>🚫 403</AppHeading>
      <AppHeading level={2} className="mt-2">
        {t("forbidden.title", { defaultValue: "Acceso prohibido" })}
      </AppHeading>
      <p className="text-gray-700 mb-6" role="alert">
        {t("forbidden.message", {
          defaultValue: "No tienes permisos para acceder a esta página.",
        })}
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <AppButton variant="primary" onClick={() => navigate("/dashboard")}>
          {t("forbidden.back_dashboard", { defaultValue: "Volver al Dashboard" })}
        </AppButton>
        <AppButton variant="secondary" onClick={() => navigate(-1)}>
          {t("forbidden.go_back", { defaultValue: "Regresar" })}
        </AppButton>
        <AppButton variant="danger" onClick={logout}>
          {t("forbidden.logout", { defaultValue: "Cerrar sesión" })}
        </AppButton>
      </div>
    </div>
  )
}
