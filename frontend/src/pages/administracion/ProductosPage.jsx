// ============================================================
// Archivo: frontend/src/pages/administracion/ProductosPage.jsx
// Descripción: Página de gestión de productos con tabla, modal y formulario.
//              Integra el hook useProductos y pasa onCreate/onUpdate al formulario
// Autor: CrimsonKnight90
// ============================================================

import {useState} from "react"
import {useTranslation} from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import ProductoTable from "../../components/ProductoTable"
import AppButton from "../../components/AppButton"
import AppModal from "../../components/AppModal"
import Notification from "../../components/Notification"
import ProductoForm from "../../components/ProductoForm"
import {useProductos} from "../../hooks/useProductos"
import {useNotification} from "../../hooks/useNotification"
import AppConfirmDialog from "../../components/AppConfirmDialog"

export default function ProductosPage() {
    const {t} = useTranslation()
    const [mostrarInactivos, setMostrarInactivos] = useState(false)

    // ✅ Una sola instancia de notificación
    const {notif, clear, notify} = useNotification()

    // ✅ Pasamos notify al hook para que use el mismo estado de notificación
    const {productos, loading, create, update, deactivate, activate} =
        useProductos({incluirInactivos: mostrarInactivos, notify})

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editProducto, setEditProducto] = useState(null)
    const [confirm, setConfirm] = useState({open: false, action: null, payload: null})

    return (
        <AppPageContainer>
            {/* 🔹 Notificación global */}
            <Notification message={notif.message} type={notif.type} onClose={clear}/>

            <AppHeading level={1}>
                📦 {t("productos.title", {defaultValue: "Gestión de Productos"})}
            </AppHeading>

            <AppSection>
                <div className="flex justify-between mb-4">
                    <AppButton
                        variant="primary"
                        onClick={() => {
                            setIsModalOpen(true)
                            setEditProducto(null)
                        }}
                    >
                        ➕ {t("producto.create_button", {defaultValue: "Nuevo Producto"})}
                    </AppButton>

                    <AppButton
                        variant="secondary"
                        onClick={() => setMostrarInactivos(!mostrarInactivos)}
                    >
                        {mostrarInactivos
                            ? t("productos.show_active", {defaultValue: "Ver solo activos"})
                            : t("productos.show_all", {defaultValue: "Ver todos (incl. inactivos)"})}
                    </AppButton>
                </div>

                <ProductoTable
                    data={productos}
                    loading={loading}
                    onEdit={(p) => {
                        setEditProducto(p)
                        setIsModalOpen(true)
                    }}
                    onDeactivate={(p) =>
                        setConfirm({
                            open: true,
                            action: "deactivate",
                            payload: {id: p.id, nombre: p.nombre},
                        })
                    }
                    onActivate={(p) =>
                        setConfirm({
                            open: true,
                            action: "activate",
                            payload: {id: p.id, nombre: p.nombre},
                        })
                    }
                />

            </AppSection>

            {/* Modal Crear/Editar */}
            <AppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    editProducto
                        ? t("producto.edit_title", {defaultValue: "Editar Producto"})
                        : t("producto.create_title", {defaultValue: "Nuevo Producto"})
                }
            >
                <ProductoForm
                    initialValues={editProducto}
                    onCreated={() => {
                        setIsModalOpen(false)
                        setEditProducto(null)
                    }}
                    onCreate={create}
                    onUpdate={update}
                />
            </AppModal>

            {/* Confirmación de acciones */}
            <AppConfirmDialog
                isOpen={confirm.open}
                message={
                    confirm.action === "deactivate"
                        ? t("producto.confirm_deactivate", {
                            id: confirm.payload?.nombre,
                            nombre: confirm.payload?.nombre,
                            defaultValue: `¿Desactivar el producto "${confirm.payload?.nombre}" (ID: ${confirm.payload?.id})?`,
                        })
                        : t("producto.confirm_activate", {
                            id: confirm.payload?.nombre,
                            nombre: confirm.payload?.nombre,
                            defaultValue: `¿Reactivar el producto "${confirm.payload?.nombre}" (ID: ${confirm.payload?.id})?`,
                        })
                }
                onCancel={() => setConfirm({open: false, action: null, payload: null})}
                onConfirm={async () => {
                    if (confirm.action === "deactivate") {
                        await deactivate(confirm.payload.id)
                    } else if (confirm.action === "activate") {
                        await activate(confirm.payload.id)
                    }
                    setConfirm({open: false, action: null, payload: null})
                }}
            />

        </AppPageContainer>
    )
}
