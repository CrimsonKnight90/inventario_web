// ============================================================
// Archivo: frontend/src/hooks/useProductos.js
// Descripción: Hook especializado para CRUD de Productos con i18n y notificaciones
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { apiClient } from "../utils/apiClient"
import { useNotification } from "./useNotification"
import { useTranslation } from "react-i18next"
import { getErrorDetail } from "../utils/errorUtils"

export function useProductos({ incluirInactivos = false, notify } = {}) {
  const internalNotify = useNotification().notify
  const notifyFn = notify || internalNotify
  const { t } = useTranslation()

  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get(`/productos?incluir_inactivos=${incluirInactivos}`)
      setProductos(data)
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("productos.error_load", { defaultValue: "Error al cargar productos" })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [incluirInactivos])

  const create = async (payload) => {
    try {
      await apiClient.post("/productos/", payload)
      notifyFn.success(t("producto.created_ok", { defaultValue: "Producto creado correctamente" }))
      fetchAll()
    } catch (err) {
      let detail
      try {
        detail = JSON.parse(err.message.replace(/^Error HTTP \d+: /, ""))
      } catch {
        detail = null
      }
      if (detail?.code === "producto_existente") {
        notifyFn.error(detail.message || t("producto.duplicate", { defaultValue: "Ya existe un producto con ese nombre" }))
      } else {
        notifyFn.error(getErrorDetail(err, t("producto.error_save", { defaultValue: "Error al crear producto" })))
      }
      throw err
    }
  }

  const update = async (id, payload) => {
    try {
      await apiClient.put(`/productos/${id}`, payload)
      notifyFn.success(t("producto.updated_ok", { defaultValue: "Producto actualizado correctamente" }))
      fetchAll()
    } catch (err) {
      let detail
      try {
        detail = JSON.parse(err.message.replace(/^Error HTTP \d+: /, ""))
      } catch {
        detail = null
      }
      if (detail?.code === "producto_existente") {
        notifyFn.error(detail.message || t("producto.duplicate", { defaultValue: "Ya existe un producto con ese nombre" }))
      } else {
        notifyFn.error(getErrorDetail(err, t("producto.error_update", { defaultValue: "Error al actualizar producto" })))
      }
      throw err
    }
  }

  const deactivate = async (id) => {
    try {
      await apiClient.patch(`/productos/${id}/desactivar`)
      notifyFn.warning(t("producto.deactivated_ok", { defaultValue: "Producto desactivado" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("producto.error_deactivate", { defaultValue: "Error al desactivar producto" })))
    }
  }

  const activate = async (id) => {
    try {
      await apiClient.patch(`/productos/${id}/reactivar`)
      notifyFn.success(t("producto.reactivated_ok", { defaultValue: "Producto reactivado" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("producto.error_activate", { defaultValue: "Error al reactivar producto" })))
    }
  }

  return { productos, loading, fetchAll, create, update, deactivate, activate }
}
