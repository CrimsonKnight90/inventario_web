// ============================================================
// Archivo: frontend/src/pages/parametros/MonedasPage.jsx
// Descripción: Gestión de Monedas (CRUD con activación/desactivación) (i18n)
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

export default function MonedasPage() {
    const {notif, notify, clear} = useNotification()
    const {t} = useTranslation()
    const [form, setForm] = useState({nombre: ""})

    // 🔹 Pasamos notify al hook para unificar notificaciones
    const {data: monedas, create, activate, deactivate} = useCatalogo("/monedas", {notify})

    const [confirm, setConfirm] = useState({open: false, action: null, payload: null})

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await create(form)
            notify.success(t("monedas.created_success", {defaultValue: "Moneda creada correctamente"}))
            setForm({nombre: ""})
        } catch (err) {
            notify.error(getErrorDetail(err, t("monedas.error_create", {defaultValue: "Error al crear moneda"})))
        }
    }

    return (
        <AppPageContainer>
            {/* Notificación global */}
            <Notification message={notif.message} type={notif.type} onClose={clear}/>

            <AppHeading level={1}>💱 {t("monedas.title", {defaultValue: "Gestión de Monedas"})}</AppHeading>

            {/* Formulario de creación */}
            <AppSection>
                <AppForm
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-4 items-start sm:items-end"
                >
                    <div className="flex-1">
                        <label className="block mb-1 text-sm text-gray-600">
                            {t("monedas.name_label", {defaultValue: "Nombre de la moneda"})}
                        </label>
                        <AppInput
                            type="text"
                            placeholder={t("monedas.name_placeholder", {defaultValue: "Ej: Peso Cubano"})}
                            value={form.nombre}
                            onChange={(e) => setForm({...form, nombre: e.target.value})}
                            required
                        />
                    </div>
                    <AppButton type="submit" variant="primary">
                        {t("monedas.create_button", {defaultValue: "Crear"})}
                    </AppButton>
                </AppForm>
            </AppSection>

            {/* Tabla de monedas */}
            <AppSection>
                <CatalogoTable
                    data={monedas}
                    columns={[{key: "nombre", label: t("monedas.name", {defaultValue: "Nombre"})}]}
                    onActivate={(m) => setConfirm({open: true, action: "activate", payload: m.nombre})}
                    onDeactivate={(m) => setConfirm({open: true, action: "deactivate", payload: m.nombre})}
                />
            </AppSection>

            {/* Confirmación de acciones */}
            <AppConfirmDialog
                isOpen={confirm.open}
                message={
                    confirm.action === "deactivate"
                        ? t("catalogo.confirm_deactivate", {
                            id: confirm.payload,
                            defaultValue: `¿Desactivar la moneda "${confirm.payload}"?`,
                        })
                        : t("catalogo.confirm_activate", {
                            id: confirm.payload,
                            defaultValue: `¿Reactivar la moneda "${confirm.payload}"?`,
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
