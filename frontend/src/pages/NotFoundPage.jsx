// ============================================================
// Archivo: frontend/src/pages/NotFoundPage.jsx
// Descripción: Página de error 404 (No encontrado) con soporte i18n.
// Autor: CrimsonKnight90
// ============================================================

import { useTranslation } from "react-i18next"
import AppHeading from "../components/AppHeading"
import AppButton from "../components/AppButton"
import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <AppHeading level={1}>❓ 404</AppHeading>
      <p className="text-gray-600 mb-6">
        {t("notfound.message", {
          defaultValue: "La página que buscas no existe o fue movida.",
        })}
      </p>

      <div className="flex gap-4">
        <AppButton variant="primary" onClick={() => navigate("/dashboard")}>
          {t("notfound.back_dashboard", { defaultValue: "Volver al Dashboard" })}
        </AppButton>
        <AppButton variant="secondary" onClick={() => navigate("/login")}>
          {t("notfound.go_login", { defaultValue: "Ir al Login" })}
        </AppButton>
      </div>
    </div>
  )
}
