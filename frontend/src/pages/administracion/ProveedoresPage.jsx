// ============================================================
// Archivo: frontend/src/pages/administracion/ProveedoresPage.jsx
// Descripción: Página de gestión de proveedores usando CatalogoTable
// Autor: CrimsonKnight90
// ============================================================

import {useState} from "react"
import {useTranslation} from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import AppButton from "../../components/AppButton"
import AppModal from "../../components/AppModal"
import Notification from "../../components/Notification"
import ProveedorForm from "../../components/ProveedorForm"
import {useProveedores} from "../../hooks/useProveedores"
import {useNotification} from "../../hooks/useNotification"
import CatalogoTable from "../../components/CatalogoTable"
import AppConfirmDialog from "../../components/AppConfirmDialog"

export default function ProveedoresPage() {
    const {t} = useTranslation()
    const [mostrarInactivos, setMostrarInactivos] = useState(false)

    // 🔹 Instancia única de notificación
    const {notif, clear, notify} = useNotification()

    // 🔹 Pasamos notify al hook
    const {proveedores, loading, create, update, deactivate, activate} =
        useProveedores({incluirInactivos: mostrarInactivos, notify})

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editProveedor, setEditProveedor] = useState(null)
    const [confirm, setConfirm] = useState({open: false, action: null, payload: null})

    return (
        <AppPageContainer>
            {/* 🔹 Notificación global */}
            <Notification message={notif.message} type={notif.type} onClose={clear}/>

            <AppHeading level={1}>🧑‍💼 {t("proveedores.title", {defaultValue: "Gestión de Proveedores"})}</AppHeading>

            <AppSection>
                <div className="flex justify-between mb-4">
                    <AppButton
                        variant="primary"
                        onClick={() => {
                            setIsModalOpen(true)
                            setEditProveedor(null)
                        }}
                    >
                        ➕ {t("proveedor.create_button", {defaultValue: "Nuevo Proveedor"})}
                    </AppButton>

                    <AppButton variant="secondary" onClick={() => setMostrarInactivos(!mostrarInactivos)}>
                        {mostrarInactivos
                            ? t("proveedores.show_active", {defaultValue: "Ver solo activos"})
                            : t("proveedores.show_all", {defaultValue: "Ver todos (incl. inactivos)"})}
                    </AppButton>
                </div>

                <CatalogoTable
                    data={proveedores}
                    loading={loading}
                    columns={[
                        {key: "id", label: "ID"},
                        {key: "nombre", label: t("proveedor.name", {defaultValue: "Nombre"})},
                    ]}
                    onDeactivate={(p) => setConfirm({
                        open: true,
                        action: "deactivate",
                        payload: {id: p.id, nombre: p.nombre}
                    })}
                    onActivate={(p) => setConfirm({
                        open: true,
                        action: "activate",
                        payload: {id: p.id, nombre: p.nombre}
                    })}
                    onEdit={(p) => {
                        setEditProveedor(p)
                        setIsModalOpen(true)
                    }}
                />
            </AppSection>

            <AppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    editProveedor
                        ? t("proveedor.edit_title", {defaultValue: "Editar Proveedor"})
                        : t("proveedor.create_title", {defaultValue: "Nuevo Proveedor"})
                }
            >
                <ProveedorForm
                    initialValues={editProveedor}
                    onCreated={() => {
                        setIsModalOpen(false)
                        setEditProveedor(null)
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
                        ? t("proveedor.confirm_deactivate", {
                            id: confirm.payload?.id,
                            nombre: confirm.payload?.nombre,
                            defaultValue: `¿Desactivar el proveedor "${confirm.payload?.nombre}" (ID: ${confirm.payload?.id})?`,
                        })
                        : t("proveedor.confirm_activate", {
                            id: confirm.payload?.id,
                            nombre: confirm.payload?.nombre,
                            defaultValue: `¿Reactivar el proveedor "${confirm.payload?.nombre}" (ID: ${confirm.payload?.id})?`,
                        })
                }
                onCancel={() => setConfirm({open: false, action: null, payload: null})}
                onConfirm={async () => {
                    if (confirm.action === "deactivate") {
                        await deactivate(confirm.payload.id)
                    } else {
                        await activate(confirm.payload.id)
                    }
                    setConfirm({open: false, action: null, payload: null})
                }}
            />


        </AppPageContainer>
    )
}
