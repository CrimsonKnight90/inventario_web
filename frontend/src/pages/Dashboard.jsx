// ============================================================
// Archivo: frontend/src/pages/Dashboard.jsx
// Descripción: Dashboard con bienvenida, métricas, listado de productos,
//              notificaciones, modal de creación y confirmación de eliminación.
// Autor: CrimsonKnight90
// ============================================================

import { useAuth } from "../context/AuthContext"
import { apiClient } from "../utils/apiClient"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import AppPageContainer from "../components/AppPageContainer"
import AppSection from "../components/AppSection"
import AppHeading from "../components/AppHeading"
import AppButton from "../components/AppButton"
import Notification from "../components/Notification"
import AppConfirmDialog from "../components/AppConfirmDialog"
import CatalogoTable from "../components/CatalogoTable"
import { useNotification } from "../hooks/useNotification"
import AppModal from "../components/AppModal"
import ProductoForm from "../components/ProductoForm"

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()

  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔹 Notificación global
  const { notif, notify, clear } = useNotification()

  return (
    <AppPageContainer>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <AppHeading level={1}>
            📊 {t("dashboard.welcome", { defaultValue: "Bienvenido al Dashboard" })}
          </AppHeading>
          {user && (
            <p className="text-gray-600">
              {t("dashboard.session_as", { defaultValue: "Sesión iniciada como" })}:{" "}
              <span className="font-semibold">{user.email}</span>{" "}
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                {user.role}
              </span>
            </p>
          )}
        </div>
      </div>





      {/* Notificación global */}
      <Notification message={notif.message} type={notif.type} onClose={clear} />
    </AppPageContainer>
  )
}
