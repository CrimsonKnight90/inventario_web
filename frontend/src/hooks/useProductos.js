// frontend/src/hooks/useProductos.js
import { useState, useEffect } from "react"
import { apiClient } from "../utils/apiClient"
import { useNotification } from "./useNotification"
import { useTranslation } from "react-i18next"

const getErrorDetail = (err, fallback) => {
  return err.response?.data?.detail || err.message || fallback
}

export function useProductos({ incluirInactivos = false } = {}) {
  const { notify } = useNotification()
  const { t } = useTranslation()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get(`/productos?incluir_inactivos=${incluirInactivos}`)
      setProductos(data)
    } catch (err) {
      notify.error(getErrorDetail(err, t("productos.error_load", { defaultValue: "Error al cargar productos" })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [incluirInactivos])

  const create = async (payload) => {
    try {
      await apiClient.post("/productos/", payload)
      notify.success(t("producto.created_ok", { defaultValue: "Producto creado correctamente" }))
      fetchAll()
    } catch (err) {
      notify.error(getErrorDetail(err, t("producto.error_save", { defaultValue: "Error al crear producto" })))
    }
  }

  const update = async (id, payload) => {
    try {
      await apiClient.put(`/productos/${id}`, payload)
      notify.success(t("producto.updated_ok", { defaultValue: "Producto actualizado correctamente" }))
      fetchAll()
    } catch (err) {
      notify.error(getErrorDetail(err, t("producto.error_update", { defaultValue: "Error al actualizar producto" })))
    }
  }

  const deactivate = async (id) => {
    try {
      await apiClient.patch(`/productos/${id}/desactivar`)
      notify.warning(t("producto.deactivated_ok", { defaultValue: "Producto desactivado" }))
      fetchAll()
    } catch (err) {
      notify.error(getErrorDetail(err, t("producto.error_deactivate", { defaultValue: "Error al desactivar producto" })))
    }
  }

  const activate = async (id) => {
    try {
      await apiClient.patch(`/productos/${id}/reactivar`)
      notify.success(t("producto.reactivated_ok", { defaultValue: "Producto reactivado" }))
      fetchAll()
    } catch (err) {
      notify.error(getErrorDetail(err, t("producto.error_activate", { defaultValue: "Error al reactivar producto" })))
    }
  }

  return { productos, loading, fetchAll, create, update, deactivate, activate }
}
