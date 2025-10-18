// ============================================================
// Archivo: frontend/src/pages/ForbiddenPage.jsx
// Descripción: Página de error 403 (Acceso prohibido) con soporte i18n.
// Autor: CrimsonKnight90
// ============================================================

import { useTranslation } from "react-i18next"
import AppHeading from "../components/AppHeading"
import AppButton from "../components/AppButton"
import { useNavigate } from "react-router-dom"

export default function ForbiddenPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <AppHeading level={1}>🚫 403</AppHeading>
      <p className="text-gray-600 mb-6">
        {t("forbidden.message", {
          defaultValue: "No tienes permisos para acceder a esta página.",
        })}
      </p>

      <div className="flex gap-4">
        <AppButton variant="primary" onClick={() => navigate("/dashboard")}>
          {t("forbidden.back_dashboard", { defaultValue: "Volver al Dashboard" })}
        </AppButton>
        <AppButton variant="secondary" onClick={() => navigate(-1)}>
          {t("forbidden.go_back", { defaultValue: "Regresar" })}
        </AppButton>
      </div>
    </div>
  )
}
