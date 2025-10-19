// ============================================================
// Archivo: frontend/src/hooks/useProveedores.js
// Descripción: Hook para gestionar el CRUD de Proveedores (listar, crear, actualizar, desactivar/reactivar).
//              Alineado con useProductos y notificaciones i18n.
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { apiClient } from "../utils/apiClient"
import { useNotification } from "./useNotification"
import { useTranslation } from "react-i18next"
import { getErrorDetail } from "../utils/errorUtils"

export function useProveedores({ incluirInactivos = false, notify } = {}) {
  const internalNotify = useNotification().notify
  const notifyFn = notify || internalNotify
  const { t } = useTranslation()

  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get(`/proveedores?incluir_inactivos=${incluirInactivos}`)
      setProveedores(data)
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("proveedores.error_load", { defaultValue: "Error al cargar proveedores" })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [incluirInactivos])

  const create = async (payload) => {
    try {
      await apiClient.post("/proveedores/", payload)
      notifyFn.success(t("proveedor.created_ok", { defaultValue: "Proveedor creado correctamente" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("proveedor.error_save", { defaultValue: "Error al crear proveedor" })))
    }
  }

  const update = async (id, payload) => {
    try {
      await apiClient.put(`/proveedores/${id}`, payload)
      notifyFn.success(t("proveedor.updated_ok", { defaultValue: "Proveedor actualizado correctamente" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("proveedor.error_update", { defaultValue: "Error al actualizar proveedor" })))
    }
  }

  const deactivate = async (id) => {
    try {
      await apiClient.patch(`/proveedores/${id}/desactivar`)
      notifyFn.warning(t("proveedor.deactivated_ok", { defaultValue: "Proveedor desactivado" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("proveedor.error_deactivate", { defaultValue: "Error al desactivar proveedor" })))
    }
  }

  const activate = async (id) => {
    try {
      await apiClient.patch(`/proveedores/${id}/reactivar`)
      notifyFn.success(t("proveedor.reactivated_ok", { defaultValue: "Proveedor reactivado" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("proveedor.error_activate", { defaultValue: "Error al reactivar proveedor" })))
    }
  }

  return { proveedores, loading, fetchAll, create, update, deactivate, activate }
}
