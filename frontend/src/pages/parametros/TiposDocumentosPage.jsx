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

export default function TiposDocumentosPage() {
    const {data: tipos, create, activate, deactivate} = useCatalogo("/tipos-documentos")
    const {t} = useTranslation()
    const [form, setForm] = useState({clave: "", nombre: "", factor: 1})
    const [mensaje, setMensaje] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await create(form)
            setMensaje(t("tipos_doc.created_success", {defaultValue: "Tipo de documento creado correctamente"}))
            setForm({clave: "", nombre: "", factor: 1})
        } catch (err) {
            setError("❌ " + (err.message || t("tipos_doc.error_create", {defaultValue: "Error al crear tipo de documento"})))
        }
    }

    return (
        <AppPageContainer>
            {/* Notificación global */}
            <Notification
                message={mensaje || error}
                type={error ? "error" : "success"}
                onClose={() => {
                    setMensaje("")
                    setError("")
                }}
            />

            <AppHeading level={1}>📑 {t("tipos_doc.title", {defaultValue: "Tipos de Documento"})}</AppHeading>

            {/* Formulario */}
            <AppSection>
                <AppWideForm
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4"
                >
                    {/* Clave (1 col) */}
                    <div className="md:col-span-1">
                        <label className="block mb-1 text-sm text-gray-600">
                            {t("tipos_doc.key_label", {defaultValue: "Clave"})}
                        </label>
                        <AppInput
                            type="text"
                            placeholder={t("tipos_doc.key_placeholder", {defaultValue: "Ej: FACT"})}
                            value={form.clave}
                            onChange={(e) => setForm({...form, clave: e.target.value})}
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

                    {/* Botón (2 col, al lado de Factor) */}
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
                    columns={[
                        {key: "clave", label: t("tipos_doc.key", {defaultValue: "Clave"})},
                        {key: "nombre", label: t("tipos_doc.name", {defaultValue: "Nombre"})},
                        {key: "factor", label: t("tipos_doc.factor", {defaultValue: "Factor"})},
                    ]}
                    onActivate={(tipo) => activate(tipo.clave)}
                    onDeactivate={(tipo) => deactivate(tipo.clave)}
                />
            </AppSection>
        </AppPageContainer>
    )
}
