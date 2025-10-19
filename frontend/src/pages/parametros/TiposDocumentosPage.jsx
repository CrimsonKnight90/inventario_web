// ============================================================
// Archivo: frontend/src/pages/parametros/TiposDocumentosPage.jsx
// Descripción: Gestión de Tipos de Documento (CRUD con activación/desactivación) (i18n)
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
import AppWideForm from "../../components/AppWideForm"
import AppInput from "../../components/AppInput"
import AppSelect from "../../components/AppSelect"
import AppButton from "../../components/AppButton"
import {useNotification} from "../../hooks/useNotification"
import {getErrorDetail} from "../../utils/errorUtils"
import AppConfirmDialog from "../../components/AppConfirmDialog"

export default function TiposDocumentosPage() {
    const {t} = useTranslation()
    const [form, setForm] = useState({clave: "", nombre: "", factor: 1})

    // 🔹 Instancia única de notificación
    const {notif, notify, clear} = useNotification()

    // 🔹 Pasamos notify al hook para unificar notificaciones
    const {data: tipos, create, activate, deactivate, loading} = useCatalogo("/tipos-documentos", {notify})

    const [confirm, setConfirm] = useState({open: false, action: null, payload: null})

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Validación extra de clave (ejemplo: solo mayúsculas, 2-5 caracteres)
            if (!/^[A-Z]{2,5}$/.test(form.clave)) {
                notify.error(t("tipos_doc.invalid_key", {defaultValue: "La clave debe ser 2-5 letras mayúsculas"}))
                return
            }

            await create(form)
            notify.success(t("tipos_doc.created_success", {defaultValue: "Tipo de documento creado correctamente"}))
            setForm({clave: "", nombre: "", factor: 1})
        } catch (err) {
            notify.error(getErrorDetail(err, t("tipos_doc.error_create", {defaultValue: "Error al crear tipo de documento"})))
        }
    }

    return (
        <AppPageContainer>
            {/* Notificación global */}
            <Notification message={notif.message} type={notif.type} onClose={clear}/>

            <AppHeading level={1}>📑 {t("tipos_doc.title", {defaultValue: "Tipos de Documento"})}</AppHeading>

            {/* Formulario */}
            <AppSection>
                <AppWideForm onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {/* Clave (1 col) */}
                    <div className="md:col-span-1">
                        <label className="block mb-1 text-sm text-gray-600">
                            {t("tipos_doc.key_label", {defaultValue: "Clave"})}
                        </label>
                        <AppInput
                            type="text"
                            placeholder={t("tipos_doc.key_placeholder", {defaultValue: "Ej: FACT"})}
                            value={form.clave}
                            onChange={(e) => setForm({...form, clave: e.target.value.toUpperCase()})}
                            required
                        />
                    </div>

                    {/* Nombre (3 col) */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm text-gray-600">
                            {t("tipos_doc.name_label", {defaultValue: "Nombre"})}
                        </label>
                        <AppInput
                            type="text"
                            placeholder={t("tipos_doc.name_placeholder", {defaultValue: "Factura"})}
                            value={form.nombre}
                            onChange={(e) => setForm({...form, nombre: e.target.value})}
                            required
                        />
                    </div>

                    {/* Factor (2 col) */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm text-gray-600">
                            {t("tipos_doc.factor_label", {defaultValue: "Factor"})}
                        </label>
                        <AppSelect
                            value={form.factor}
                            onChange={(e) => setForm({...form, factor: parseInt(e.target.value)})}
                        >
                            <option value={1}>{t("tipos_doc.factor_in", {defaultValue: "Entrada (+)"})}</option>
                            <option value={-1}>{t("tipos_doc.factor_out", {defaultValue: "Salida (-)"})}</option>
                        </AppSelect>
                    </div>

                    {/* Botón (1 col) */}
                    <div className="md:col-span-1 flex items-end">
                        <AppButton type="submit" variant="primary" className="w-full">
                            {t("tipos_doc.create_button", {defaultValue: "Crear"})}
                        </AppButton>
                    </div>
                </AppWideForm>
            </AppSection>

            {/* Tabla genérica */}
            <AppSection>
                <CatalogoTable
                    data={tipos}
                    loading={loading}
                    columns={[
                        {key: "clave", label: t("tipos_doc.key", {defaultValue: "Clave"})},
                        {key: "nombre", label: t("tipos_doc.name", {defaultValue: "Nombre"})},
                        {key: "factor", label: t("tipos_doc.factor", {defaultValue: "Factor"})},
                    ]}
                    onActivate={(tipo) => setConfirm({open: true, action: "activate", payload: tipo.clave})}
                    onDeactivate={(tipo) => setConfirm({open: true, action: "deactivate", payload: tipo.clave})}
                />
            </AppSection>

            {/* Confirmación de acciones */}
            <AppConfirmDialog
                isOpen={confirm.open}
                message={
                    confirm.action === "deactivate"
                        ? t("catalogo.confirm_deactivate", {
                            id: confirm.payload,
                            defaultValue: `¿Desactivar el tipo de documento "${confirm.payload}"?`,
                        })
                        : t("catalogo.confirm_activate", {
                            id: confirm.payload,
                            defaultValue: `¿Reactivar el tipo de documento "${confirm.payload}"?`,
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
