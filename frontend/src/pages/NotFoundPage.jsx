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
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
      <AppHeading level={1}>❓ 404</AppHeading>
      <AppHeading level={2} className="mt-2">
        {t("notfound.title", { defaultValue: "Página no encontrada" })}
      </AppHeading>
      <p className="text-gray-700 mb-6" role="alert">
        {t("notfound.message", {
          defaultValue: "La página que buscas no existe o fue movida.",
        })}
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <AppButton variant="primary" onClick={() => navigate("/dashboard")}>
          {t("notfound.back_dashboard", { defaultValue: "Volver al Dashboard" })}
        </AppButton>
        <AppButton variant="secondary" onClick={() => navigate("/login")}>
          {t("notfound.go_login", { defaultValue: "Ir al Login" })}
        </AppButton>
        <AppButton variant="secondary" onClick={() => navigate(-1)}>
          {t("notfound.go_back", { defaultValue: "Regresar" })}
        </AppButton>
      </div>
    </div>
  )
}
