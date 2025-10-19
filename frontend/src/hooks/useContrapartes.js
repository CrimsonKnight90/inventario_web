// ============================================================
// Archivo: frontend/src/hooks/useContrapartes.js
// Descripción: Hook para gestionar CRUD de Contrapartes con notificaciones e i18n
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { apiClient } from "../utils/apiClient"
import { useNotification } from "./useNotification"
import { useTranslation } from "react-i18next"
import { getErrorDetail } from "../utils/errorUtils"

export function useContrapartes({ incluirInactivos = false, notify } = {}) {
  const internalNotify = useNotification().notify
  const notifyFn = notify || internalNotify
  const { t } = useTranslation()

  const [contrapartes, setContrapartes] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get(`/contrapartes?incluir_inactivos=${incluirInactivos}`)
      setContrapartes(data)
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("contrapartes.error_load", { defaultValue: "Error al cargar contrapartes" })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [incluirInactivos])

  const create = async (payload) => {
    try {
      await apiClient.post("/contrapartes/", payload)
      notifyFn.success(t("contraparte.created_ok", { defaultValue: "Contraparte creada correctamente" }))
      fetchAll()
    } catch (err) {
      let detail
      try {
        detail = JSON.parse(err.message.replace(/^Error HTTP \d+: /, ""))
      } catch {
        detail = null
      }
      if (detail?.code === "contraparte_existente") {
        notifyFn.error(detail.message || t("contraparte.duplicate", { defaultValue: "Ya existe una contraparte con esa cuenta o denominación" }))
      } else {
        notifyFn.error(getErrorDetail(err, t("contraparte.error_save", { defaultValue: "Error al crear contraparte" })))
      }
      throw err
    }
  }

  const update = async (id, payload) => {
    try {
      await apiClient.put(`/contrapartes/${id}`, payload)
      notifyFn.success(t("contraparte.updated_ok", { defaultValue: "Contraparte actualizada correctamente" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("contraparte.error_update", { defaultValue: "Error al actualizar contraparte" })))
    }
  }

  const deactivate = async (id) => {
    try {
      await apiClient.patch(`/contrapartes/${id}/desactivar`)
      notifyFn.warning(t("contraparte.deactivated_ok", { defaultValue: "Contraparte desactivada" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("contraparte.error_deactivate", { defaultValue: "Error al desactivar contraparte" })))
    }
  }

  const activate = async (id) => {
    try {
      await apiClient.patch(`/contrapartes/${id}/reactivar`)
      notifyFn.success(t("contraparte.reactivated_ok", { defaultValue: "Contraparte reactivada" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("contraparte.error_activate", { defaultValue: "Error al reactivar contraparte" })))
    }
  }

  return { contrapartes, loading, fetchAll, create, update, deactivate, activate }
}
