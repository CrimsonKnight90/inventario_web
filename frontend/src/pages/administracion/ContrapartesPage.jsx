// ============================================================
// Archivo: frontend/src/pages/administracion/ContrapartesPage.jsx
// Descripción: Página de gestión de Contrapartes con tabla y formulario
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
import ContraparteForm from "../../components/ContraparteForm"
import {useContrapartes} from "../../hooks/useContrapartes"
import {useNotification} from "../../hooks/useNotification"
import AppConfirmDialog from "../../components/AppConfirmDialog"

export default function ContrapartesPage() {
    const {t} = useTranslation()
    const [mostrarInactivos, setMostrarInactivos] = useState(false)

    // 🔹 Instancia única de notificación
    const {notif, clear, notify} = useNotification()

    // 🔹 Pasamos notify al hook
    const {contrapartes, loading, create, update, deactivate, activate} =
        useContrapartes({incluirInactivos: mostrarInactivos, notify})

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editContraparte, setEditContraparte] = useState(null)
    const [confirm, setConfirm] = useState({open: false, action: null, payload: null})

    return (
        <AppPageContainer>
            {/* 🔹 Notificación global */}
            <Notification message={notif.message} type={notif.type} onClose={clear}/>

            <AppHeading level={1}>
                🔄 {t("contrapartes.title", {defaultValue: "Gestión de Contrapartes"})}
            </AppHeading>

            <AppSection>
                <div className="flex justify-between mb-4">
                    <AppButton
                        variant="primary"
                        onClick={() => {
                            setIsModalOpen(true)
                            setEditContraparte(null)
                        }}
                    >
                        ➕ {t("contraparte.create_button", {defaultValue: "Nueva Contraparte"})}
                    </AppButton>

                    <AppButton
                        variant="secondary"
                        onClick={() => setMostrarInactivos(!mostrarInactivos)}
                    >
                        {mostrarInactivos
                            ? t("contrapartes.show_active", {defaultValue: "Ver solo activas"})
                            : t("contrapartes.show_all", {defaultValue: "Ver todas (incl. inactivas)"})}
                    </AppButton>
                </div>

                <CatalogoTable
                    data={contrapartes}
                    loading={loading}
                    columns={[
                        {key: "cuentacont", label: t("contraparte.cuentacont", {defaultValue: "Cuenta"})},
                        {key: "nomcont", label: t("contraparte.nomcont", {defaultValue: "Denominación"})},
                    ]}
                    onEdit={(c) => {
                        setEditContraparte(c)
                        setIsModalOpen(true)
                    }}
                    onDeactivate={(c) =>
                        setConfirm({
                            open: true,
                            action: "deactivate",
                            payload: {id: c.cuentacont, nombre: c.nomcont},
                        })
                    }
                    onActivate={(c) =>
                        setConfirm({
                            open: true,
                            action: "activate",
                            payload: {id: c.cuentacont, nombre: c.nomcont},
                        })
                    }

                />
            </AppSection>

            <AppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    editContraparte
                        ? t("contraparte.edit_title", {defaultValue: "Editar Contraparte"})
                        : t("contraparte.create_title", {defaultValue: "Nueva Contraparte"})
                }
            >
                <ContraparteForm
                    initialValues={editContraparte}
                    onCreated={() => {
                        setIsModalOpen(false)
                        setEditContraparte(null)
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
