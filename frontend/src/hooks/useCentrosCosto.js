// ============================================================
// Archivo: frontend/src/hooks/useCentrosCosto.js
// Descripción: Hook para gestionar CRUD de Centros de Costo con notificaciones e i18n
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { apiClient } from "../utils/apiClient"
import { useNotification } from "./useNotification"
import { useTranslation } from "react-i18next"
import { getErrorDetail } from "../utils/errorUtils"

export function useCentrosCosto({ incluirInactivos = false, notify } = {}) {
  const internalNotify = useNotification().notify
  const notifyFn = notify || internalNotify
  const { t } = useTranslation()

  const [centros, setCentros] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get(`/centros-costo?incluir_inactivos=${incluirInactivos}`)
      setCentros(data)
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("centros_costo.error_load", { defaultValue: "Error al cargar centros de costo" })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [incluirInactivos])

  const create = async (payload) => {
    try {
      await apiClient.post("/centros-costo/", payload)
      notifyFn.success(t("centro_costo.created_ok", { defaultValue: "Centro de costo creado correctamente" }))
      fetchAll()
    } catch (err) {
      let detail
      try {
        detail = JSON.parse(err.message.replace(/^Error HTTP \d+: /, ""))
      } catch {
        detail = null
      }
      if (detail?.code === "centro_costo_existente") {
        notifyFn.error(detail.message || t("centro_costo.duplicate", { defaultValue: "Ya existe un centro de costo con esa cuenta o denominación" }))
      } else {
        notifyFn.error(getErrorDetail(err, t("centro_costo.error_save", { defaultValue: "Error al crear centro de costo" })))
      }
      throw err
    }
  }

  const update = async (id, payload) => {
    try {
      await apiClient.put(`/centros-costo/${id}`, payload)
      notifyFn.success(t("centro_costo.updated_ok", { defaultValue: "Centro de costo actualizado correctamente" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("centro_costo.error_update", { defaultValue: "Error al actualizar centro de costo" })))
    }
  }

  const deactivate = async (id) => {
    try {
      await apiClient.patch(`/centros-costo/${id}/desactivar`)
      notifyFn.warning(t("centro_costo.deactivated_ok", { defaultValue: "Centro de costo desactivado" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("centro_costo.error_deactivate", { defaultValue: "Error al desactivar centro de costo" })))
    }
  }

  const activate = async (id) => {
    try {
      await apiClient.patch(`/centros-costo/${id}/reactivar`)
      notifyFn.success(t("centro_costo.reactivated_ok", { defaultValue: "Centro de costo reactivado" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("centro_costo.error_activate", { defaultValue: "Error al reactivar centro de costo" })))
    }
  }

  return { centros, loading, fetchAll, create, update, deactivate, activate }
}
