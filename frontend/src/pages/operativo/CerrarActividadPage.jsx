// ============================================================
// Archivo: frontend/src/pages/operativo/CerrarActividadPage.jsx
// Descripción: Listado de actividades abiertas con opción de cierre (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useEffect, useState } from "react"
import { apiClient } from "../../utils/apiClient"
import { useTranslation } from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import AppButton from "../../components/AppButton"
import Notification from "../../components/Notification"
import { useNotification } from "../../hooks/useNotification"
import { getErrorDetail } from "../../utils/errorUtils"
import AppConfirmDialog from "../../components/AppConfirmDialog"

export default function CerrarActividadPage() {
  const { t } = useTranslation()
  const [actividades, setActividades] = useState([])
  const { notif, notify, clear } = useNotification()
  const [confirm, setConfirm] = useState({ open: false, payload: null })

  useEffect(() => {
    apiClient
      .get("/actividades/")
      .then((data) => setActividades(data.filter((a) => !a.actcerrada)))
      .catch((err) =>
        notify.error(getErrorDetail(err, t("actividades.load_error", { defaultValue: "Error al cargar actividades" })))
      )
  }, [t])

  const cerrarActividad = async (actividad) => {
    try {
      await apiClient.post(`/actividades/${actividad.codact}/cerrar`, {
        observaciones: "Cerrada desde frontend",
      })
      notify.success(t("actividades.close_success", { defaultValue: "Actividad cerrada correctamente" }))
      setActividades((prev) => prev.filter((a) => a.codact !== actividad.codact))
    } catch (err) {
      notify.error(getErrorDetail(err, t("actividades.error_close", { defaultValue: "Error al cerrar actividad" })))
    }
  }

  return (
    <AppPageContainer>
      <Notification message={notif.message} type={notif.type} onClose={clear} />

      <AppHeading level={1}>🔒 {t("actividades.close_title", { defaultValue: "Cerrar actividades" })}</AppHeading>

      <AppSection>
        {actividades.length === 0 ? (
          <p className="text-gray-500">{t("actividades.no_open", { defaultValue: "No hay actividades abiertas" })}</p>
        ) : (
          <ul className="space-y-3">
            {actividades.map((a) => (
              <li
                key={a.codact}
                className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50"
              >
                <span>
                  {a.nomact} ({a.fechaini?.slice(0, 10)} → {a.fechafin?.slice(0, 10)})
                </span>
                <AppButton
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirm({ open: true, payload: a })}
                >
                  {t("actividades.close_button", { defaultValue: "Cerrar" })}
                </AppButton>
              </li>
            ))}
          </ul>
        )}
      </AppSection>

      <AppConfirmDialog
        isOpen={confirm.open}
        message={t("actividades.confirm_close", { defaultValue: "¿Cerrar esta actividad?" })}
        onCancel={() => setConfirm({ open: false, payload: null })}
        onConfirm={() => {
          cerrarActividad(confirm.payload)
          setConfirm({ open: false, payload: null })
        }}
      />
    </AppPageContainer>
  )
}
