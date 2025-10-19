// ============================================================
// Archivo: frontend/src/pages/administracion/CentrosCostoPage.jsx
// Descripción: Página de gestión de Centros de Costo con tabla y formulario
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
import CatalogoTable from "../../components/CatalogoTable"
import CentroCostoForm from "../../components/CentroCostoForm"
import {useCentrosCosto} from "../../hooks/useCentrosCosto"
import {useNotification} from "../../hooks/useNotification"
import AppConfirmDialog from "../../components/AppConfirmDialog"

export default function CentrosCostoPage() {
    const {t} = useTranslation()
    const [mostrarInactivos, setMostrarInactivos] = useState(false)

    // 🔹 Instancia única de notificación
    const {notif, clear, notify} = useNotification()

    // 🔹 Pasamos notify al hook
    const {centros, loading, create, update, deactivate, activate} =
        useCentrosCosto({incluirInactivos: mostrarInactivos, notify})

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editCentro, setEditCentro] = useState(null)
    const [confirm, setConfirm] = useState({open: false, action: null, payload: null})

    return (
        <AppPageContainer>
            {/* 🔹 Notificación global */}
            <Notification message={notif.message} type={notif.type} onClose={clear}/>

            <AppHeading level={1}>
                🏢 {t("centros_costo.title", {defaultValue: "Gestión de Centros de Costo"})}
            </AppHeading>

            <AppSection>
                <div className="flex justify-between mb-4">
                    <AppButton
                        variant="primary"
                        onClick={() => {
                            setIsModalOpen(true)
                            setEditCentro(null)
                        }}
                    >
                        ➕ {t("centro_costo.create_button", {defaultValue: "Nuevo Centro de Costo"})}
                    </AppButton>

                    <AppButton variant="secondary" onClick={() => setMostrarInactivos(!mostrarInactivos)}>
                        {mostrarInactivos
                            ? t("centros_costo.show_active", {defaultValue: "Ver solo activos"})
                            : t("centros_costo.show_all", {defaultValue: "Ver todos (incl. inactivos)"})}
                    </AppButton>
                </div>

                <CatalogoTable
                    data={centros}
                    loading={loading}
                    columns={[
                        {key: "cuentacc", label: t("centro_costo.cuentacc", {defaultValue: "Cuenta"})},
                        {key: "nomcc", label: t("centro_costo.nomcc", {defaultValue: "Denominación"})},
                    ]}
                    onEdit={(c) => {
                        setEditCentro(c)
                        setIsModalOpen(true)
                    }}
                    onDeactivate={(c) =>
                        setConfirm({
                            open: true,
                            action: "deactivate",
                            payload: {id: c.cuentacc, nombre: c.nomcc},
                        })
                    }
                    onActivate={(c) =>
                        setConfirm({
                            open: true,
                            action: "activate",
                            payload: {id: c.cuentacc, nombre: c.nomcc},
                        })
                    }
                />

            </AppSection>

            <AppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    editCentro
                        ? t("centro_costo.edit_title", {defaultValue: "Editar Centro de Costo"})
                        : t("centro_costo.create_title", {defaultValue: "Nuevo Centro de Costo"})
                }
            >
                <CentroCostoForm
                    initialValues={editCentro}
                    onCreated={() => {
                        setIsModalOpen(false)
                        setEditCentro(null)
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
                        ? t("catalogo.confirm_deactivate", {
                            id: confirm.payload?.id,
                            nombre: confirm.payload?.nombre,
                            defaultValue: `¿Seguro que deseas desactivar la cuenta "${confirm.payload?.id}" con denominación "${confirm.payload?.nombre}"?`,
                        })
                        : t("catalogo.confirm_activate", {
                            id: confirm.payload?.id,
                            nombre: confirm.payload?.nombre,
                            defaultValue: `¿Seguro que deseas reactivar la cuenta "${confirm.payload?.id}" con denominación "${confirm.payload?.nombre}"?`,
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
