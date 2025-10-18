// ============================================================
// Archivo: frontend/src/pages/Dashboard.jsx
// Descripción: Dashboard con bienvenida, métricas, listado de productos,
//              notificaciones, modal de creación y confirmación de eliminación.
// Autor: CrimsonKnight90
// ============================================================

import {useAuth} from "../context/AuthContext"
import {apiClient} from "../utils/apiClient"
import {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"

import AppPageContainer from "../components/AppPageContainer"
import AppSection from "../components/AppSection"
import AppHeading from "../components/AppHeading"
import AppTable from "../components/AppTable"
import AppButton from "../components/AppButton"
import Notification from "../components/Notification"
import AppConfirmDialog from "../components/AppConfirmDialog"

export default function Dashboard() {
    const {user} = useAuth()
    const {t} = useTranslation()

    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [notif, setNotif] = useState({message: "", type: "info"})

    // 🔹 Confirmación de eliminación
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null)

    const fetchProductos = async () => {
        try {
            const data = await apiClient.get("/productos/")
            setProductos(Array.isArray(data) ? data : data.results || [])
        } catch (err) {
            console.error("❌ Error cargando productos:", err)
            setError(t("dashboard.error_products", {defaultValue: "Error al cargar productos"}))
            setNotif({
                message: t("dashboard.error_products", {defaultValue: "Error al cargar productos"}),
                type: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProductos()
    }, [t])

    const handleDeleteClick = (id) => {
        setSelectedId(id)
        setConfirmOpen(true)
    }

    const confirmDelete = async () => {
        try {
            await apiClient.delete(`/productos/${selectedId}`)
            setNotif({
                message: t("productos.deleted_ok", {defaultValue: "Producto desactivado correctamente"}),
                type: "success",
            })
            await fetchProductos()
        } catch (err) {
            setNotif({
                message: err.message || t("productos.error_delete", {defaultValue: "Error al desactivar producto"}),
                type: "error",
            })
        } finally {
            setConfirmOpen(false)
            setSelectedId(null)
        }
    }

    return (
        <AppPageContainer>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <AppHeading level={1}>
                        📊 {t("dashboard.welcome", {defaultValue: "Bienvenido al Dashboard"})}
                    </AppHeading>
                    {user && (
                        <p className="text-gray-600">
                            {t("dashboard.session_as", {defaultValue: "Sesión iniciada como"})}:{" "}
                            <span className="font-semibold">{user.email}</span>{" "}
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                {user.role}
              </span>
                        </p>
                    )}
                </div>

            </div>

            {/* KPIs */}
            <AppSection className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500">
                            {t("dashboard.products", {defaultValue: "Productos"})}
                        </p>
                        <p className="text-2xl font-bold text-gray-800">{productos.length}</p>
                    </div>
                    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500">Actividades abiertas</p>
                        <p className="text-2xl font-bold text-gray-800">12</p>
                    </div>
                    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500">Usuarios</p>
                        <p className="text-2xl font-bold text-gray-800">5</p>
                    </div>
                </div>
            </AppSection>

            {/* Tabla de productos */}
            <AppSection>
                <AppHeading level={2}>
                    📦 {t("dashboard.products", {defaultValue: "Productos"})}
                </AppHeading>

                {loading && <p>{t("dashboard.loading", {defaultValue: "Cargando productos..."})}</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && (
                    <AppTable
                        headers={[
                            "ID",
                            t("producto.name", {defaultValue: "Nombre"}),
                            t("productos.stock", {defaultValue: "Stock"}),
                            t("acciones", {defaultValue: "Acciones"}),
                        ]}
                    >
                        {Array.isArray(productos) &&
                            productos.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-3 border">{p.id}</td>
                                    <td className="py-2 px-3 border truncate max-w-[220px]">{p.nombre}</td>
                                    <td className="py-2 px-3 border">{p.stock}</td>
                                    <td className="py-2 px-3 border">
                                        <AppButton
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDeleteClick(p.id)}
                                        >
                                            🗑️
                                        </AppButton>
                                    </td>
                                </tr>
                            ))}
                    </AppTable>
                )}
            </AppSection>

            {/* Confirmación de eliminación */}
            <AppConfirmDialog
                isOpen={confirmOpen}
                message={t("productos.confirm_delete", {defaultValue: "¿Seguro que deseas desactivar este producto?"})}
                onConfirm={confirmDelete}
                onCancel={() => setConfirmOpen(false)}
                confirmText={t("productos.delete_button", {defaultValue: "Sí, desactivar"})}
                cancelText={t("cancel", {defaultValue: "Cancelar"})}
            />

            {/* Notificación global */}
            <Notification
                message={notif.message}
                type={notif.type}
                onClose={() => setNotif({message: "", type: "info"})}
            />
        </AppPageContainer>
    )
}
