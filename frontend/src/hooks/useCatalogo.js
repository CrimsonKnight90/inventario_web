// ============================================================
// Archivo: frontend/src/hooks/useCatalogo.js
// Descripción: Hook genérico para catálogos con activar/desactivar (con i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { apiClient } from "../utils/apiClient"
import { useNotification } from "./useNotification"
import { useTranslation } from "react-i18next"
import { getErrorDetail } from "../utils/errorUtils"

export function useCatalogo(endpoint, { incluirInactivos = true, notify } = {}) {
  // Si no se pasa notify desde la página, se crea uno interno
  const internalNotify = useNotification().notify
  const notifyFn = notify || internalNotify

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const fetchAll = async () => {
    setLoading(true)
    try {
      const json = await apiClient.get(`${endpoint}/?incluir_inactivos=${incluirInactivos}`)
      setData(json)
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("catalogo.load_error", { endpoint })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [endpoint, incluirInactivos])

  const create = async (payload) => {
    try {
      const json = await apiClient.post(`${endpoint}/`, payload)
      notifyFn.success(t("catalogo.create_success"))
      fetchAll()
      return json
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("catalogo.create_error", { endpoint })))
      return null
    }
  }

  const deactivate = async (id) => {
    try {
      await apiClient.patch(`${endpoint}/${encodeURIComponent(id)}/desactivar`)
      notifyFn.warning(t("catalogo.deactivate_success", { id }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("catalogo.deactivate_error")))
    }
  }

  const activate = async (id) => {
    try {
      await apiClient.patch(`${endpoint}/${encodeURIComponent(id)}/reactivar`)
      notifyFn.success(t("catalogo.activate_success", { id }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("catalogo.activate_error")))
    }
  }

  return { data, loading, fetchAll, create, deactivate, activate }
}
