// ============================================================
// Archivo: frontend/src/pages/parametros/UMPage.jsx
// Descripción: Gestión de UM (CRUD con activación/desactivación) (i18n)
// Autor: CrimsonKnight90
// ============================================================

import {useState} from "react"
import {useCatalogo} from "../../hooks/useCatalogo"
import CatalogoTable from "../../components/CatalogoTable"
import Notification from "../../components/Notification"
import {useTranslation} from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import AppForm from "../../components/AppForm"
import AppInput from "../../components/AppInput"
import AppButton from "../../components/AppButton"
import {useNotification} from "../../hooks/useNotification"
import {getErrorDetail} from "../../utils/errorUtils"
import AppConfirmDialog from "../../components/AppConfirmDialog"

export default function UMPage() {
    const {t} = useTranslation()
    const [form, setForm] = useState({um: "", factor: 1})

    // 🔹 Instancia única de notificación
    const {notif, notify, clear} = useNotification()

    // 🔹 Pasamos notify al hook
    const {data: ums, create, activate, deactivate, loading} = useCatalogo("/um", {notify})

    const [confirm, setConfirm] = useState({open: false, action: null, payload: null})

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!/^[A-Z]{1,5}$/.test(form.um)) {
                notify.error(t("um.invalid_key", {defaultValue: "La clave UM debe ser 1-5 letras mayúsculas"}))
                return
            }

            await create(form)
            notify.success(t("um.created_success", {defaultValue: "UM creada correctamente"}))
            setForm({um: "", factor: 1})
        } catch (err) {
            notify.error(getErrorDetail(err, t("um.error_create", {defaultValue: "Error al crear UM"})))
        }
    }

    return (
        <AppPageContainer>
            {/* Notificación global */}
            <Notification message={notif.message} type={notif.type} onClose={clear}/>

            <AppHeading level={1}>⚖️ {t("um.title", {defaultValue: "Gestión de UM"})}</AppHeading>

            {/* Formulario */}
            <AppSection>
                <AppForm onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div>
                        <label className="block mb-1 text-sm text-gray-600">
                            {t("um.key_label", {defaultValue: "Clave UM"})}
                        </label>
                        <AppInput
                            type="text"
                            placeholder={t("um.key_placeholder", {defaultValue: "Ej: KG"})}
                            value={form.um}
                            onChange={(e) => setForm({...form, um: e.target.value.toUpperCase()})}
                            required
                            className="w-32"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-600">
                            {t("um.factor_label", {defaultValue: "Factor"})}
                        </label>
                        <AppInput
                            type="number"
                            placeholder={t("um.factor_placeholder", {defaultValue: "Ej: 1"})}
                            value={form.factor}
                            onChange={(e) => setForm({...form, factor: parseInt(e.target.value) || 0})}
                            className="w-32"
                        />
                    </div>

                    <AppButton type="submit" variant="primary">
                        {t("um.create_button", {defaultValue: "Crear"})}
                    </AppButton>
                </AppForm>
            </AppSection>

            {/* Tabla de UM */}
            <AppSection>
                <CatalogoTable
                    data={ums}
                    loading={loading}
                    columns={[
                        {key: "um", label: "UM"},
                        {key: "factor", label: t("um.factor", {defaultValue: "Factor"})},
                    ]}
                    onActivate={(u) => setConfirm({open: true, action: "activate", payload: u.um})}
                    onDeactivate={(u) => setConfirm({open: true, action: "deactivate", payload: u.um})}
                />
            </AppSection>

            {/* Confirmación de acciones */}
            <AppConfirmDialog
                isOpen={confirm.open}
                message={
                    confirm.action === "deactivate"
                        ? t("catalogo.confirm_deactivate", {
                            id: confirm.payload,
                            defaultValue: `¿Desactivar la UM "${confirm.payload}"?`,
                        })
                        : t("catalogo.confirm_activate", {
                            id: confirm.payload,
                            defaultValue: `¿Reactivar la UM "${confirm.payload}"?`,
                        })
                }
                onCancel={() => setConfirm({open: false, action: null, payload: null})}
                onConfirm={async () => {
                    if (confirm.action === "deactivate") {
                        await deactivate(confirm.payload)
                    } else if (confirm.action === "activate") {
                        await activate(confirm.payload)
                    }
                    setConfirm({open: false, action: null, payload: null})
                }}
            />

        </AppPageContainer>
    )
}
