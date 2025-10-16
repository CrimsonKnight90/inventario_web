// ============================================================
// Archivo: frontend/src/hooks/useCatalogo.js
// Descripción: Hook genérico para catálogos con activar/desactivar (con i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { apiClient } from "../utils/apiClient"
import { useNotification } from "./useNotification"
import { useTranslation } from "react-i18next"

export function useCatalogo(endpoint, { incluirInactivos = true } = {}) {
  const { notify } = useNotification()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const fetchAll = async () => {
    setLoading(true)
    try {
      const json = await apiClient.get(`${endpoint}/?incluir_inactivos=${incluirInactivos}`)
      setData(json)
    } catch {
      notify.error(t("catalogo.load_error", { endpoint }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [endpoint, incluirInactivos])

  const create = async (payload) => {
    try {
      const json = await apiClient.post(`${endpoint}/`, payload)
      notify.success(t("catalogo.create_success"))
      fetchAll()
      return json
    } catch (err) {
      notify.error(err.message || t("catalogo.create_error", { endpoint }))
      return null
    }
  }

  const deactivate = async (id) => {
    if (!window.confirm(t("catalogo.confirm_deactivate", { id }))) return
    try {
      await apiClient.patch(`${endpoint}/${encodeURIComponent(id)}/desactivar`)
      notify.warning(t("catalogo.deactivate_success", { id }))
      fetchAll()
    } catch (err) {
      notify.error(err.message || t("catalogo.deactivate_error"))
    }
  }

  const activate = async (id) => {
    try {
      await apiClient.patch(`${endpoint}/${encodeURIComponent(id)}/reactivar`)
      notify.success(t("catalogo.activate_success", { id }))
      fetchAll()
    } catch (err) {
      notify.error(err.message || t("catalogo.activate_error"))
    }
  }

  return { data, loading, fetchAll, create, deactivate, activate }
}
