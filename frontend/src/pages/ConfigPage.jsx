// ============================================================
// Archivo: frontend/src/pages/ConfigPage.jsx
// Descripción: Página de administración para modificar branding (nombre, logo, colores)
// Autor: CrimsonKnight90
// ============================================================

import {useState, useEffect} from "react"
import {useBranding} from "../context/BrandingContext"
import {useTranslation} from "react-i18next"
import AppPageContainer from "../components/AppPageContainer"
import AppSection from "../components/AppSection"
import AppWideForm from "../components/AppWideForm"
import AppInput from "../components/AppInput"
import AppButton from "../components/AppButton"
import AppHeading from "../components/AppHeading"
import Notification from "../components/Notification"
import {useNotification} from "../hooks/useNotification"
import { DEFAULT_BRANDING } from "../context/BrandingContext"


export default function ConfigPage() {
    const {branding, updateBranding, uploadLogo} = useBranding()
    const [form, setForm] = useState(null)
    const {notif, notify, clear} = useNotification()
    const {t} = useTranslation()

    useEffect(() => {
        if (branding) setForm(branding)
    }, [branding])

    // 🔹 Liberar URL temporal al desmontar o cambiar logo
    useEffect(() => {
        return () => {
            if (form?.logo_url_preview) {
                URL.revokeObjectURL(form.logo_url_preview)
            }
        }
    }, [form?.logo_url_preview])

    if (!form) return <p>{t("config.loading", {defaultValue: "Cargando configuración..."})}</p>

    const handleChange = (e) => {
        const {name, value} = e.target
        setForm({...form, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let updated = {...form}

            // Si hay un archivo nuevo, primero súbelo
            if (form.logo_file) {
                const uploaded = await uploadLogo(form.logo_file)
                updated.logo_url = uploaded.logo_url
            }

            // Luego guarda el resto de la configuración
            updated = await updateBranding({
                app_name: form.app_name,
                logo_url: updated.logo_url,
                primary_color: form.primary_color,
                secondary_color: form.secondary_color,
                background_color: form.background_color,
                topbar_color: form.topbar_color,
            })

            setForm(updated)
            notify.success(t("config.updated", {defaultValue: "Configuración actualizada"}))
        } catch (err) {
            notify.error(err.message || t("config.error_update", {defaultValue: "Error al actualizar configuración"}))
        }
    }

    const handleUpload = (file) => {
        try {
            const previewUrl = URL.createObjectURL(file)
            setForm((prev) => ({
                ...prev,
                logo_file: file,
                logo_url_preview: previewUrl,
            }))
            notify.info(t("config.logo_selected", {defaultValue: "Logo seleccionado, recuerda guardar cambios"}))
        } catch (err) {
            notify.error(err.message || t("config.error_logo", {defaultValue: "Error al seleccionar logo"}))
        }
    }

    const restoreDefaults = () => {
        setForm({ ...form, ...DEFAULT_BRANDING })
        notify.info(t("config.restored", { defaultValue: "Valores restaurados, recuerda guardar cambios" }))
    }

    return (
        <AppPageContainer>
            <AppHeading level={1}>
                {t("config.title", {defaultValue: "Configuración de Branding"})}
            </AppHeading>

            <AppSection>
                <AppWideForm onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre de la empresa */}
                    <div>
                        <label className="block mb-1">
                            {t("config.company_name", {defaultValue: "Nombre de la empresa"})}
                        </label>
                        <AppInput
                            type="text"
                            name="app_name"
                            value={form.app_name || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Logo URL */}
                    <div>
                        <label className="block mb-1">
                            {t("config.logo_url", {defaultValue: "URL del logo"})}
                        </label>
                        <AppInput
                            type="text"
                            name="logo_url"
                            value={form.logo_url || ""}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Subida de logo */}
                    <div>
                        <label className="block mb-1">
                            {t("config.upload_logo", {defaultValue: "Subir logo"})}
                        </label>
                        <div className="flex items-center space-x-4">
                            <AppButton
                                variant="secondary"
                                size="md"
                                type="button"
                                onClick={() => document.getElementById("logoInput").click()}
                            >
                                {t("config.upload_logo_button", {defaultValue: "Seleccionar archivo"})}
                            </AppButton>
                            <input
                                id="logoInput"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files[0]) handleUpload(e.target.files[0])
                                }}
                                className="hidden"
                            />
                            <span className="text-sm text-gray-600 truncate max-w-xs">
                {form.logo_url || t("config.no_logo", {defaultValue: "Sin logo"})}
              </span>
                        </div>
                    </div>

                    {/* Vista previa del logo */}
                    {(form.logo_url_preview || form.logo_url) && (
                        <div className="mt-4">
                            <img
                                src={form.logo_url_preview || `${form.logo_url}?t=${Date.now()}`}
                                alt={t("config.logo_alt", {defaultValue: "Logo de la empresa"})}
                                className="h-16 object-contain"
                            />
                        </div>
                    )}

                    {/* Colores */}
                    <div className="flex space-x-4 flex-wrap">
                        <div>
                            <label className="block mb-1">
                                {t("config.primary_color", {defaultValue: "Color primario (Navbar)"})}
                            </label>
                            <input
                                type="color"
                                name="primary_color"
                                value={form.primary_color || "#1E293B"}
                                onChange={handleChange}
                                aria-label={t("config.primary_color", {defaultValue: "Color primario"})}
                                className="h-10 w-16 cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">
                                {t("config.secondary_color", {defaultValue: "Color secundario (Botones)"})}
                            </label>
                            <input
                                type="color"
                                name="secondary_color"
                                value={form.secondary_color || "#3B82F6"}
                                onChange={handleChange}
                                aria-label={t("config.secondary_color", {defaultValue: "Color secundario"})}
                                className="h-10 w-16 cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">
                                {t("config.background_color", {defaultValue: "Color de fondo"})}
                            </label>
                            <input
                                type="color"
                                name="background_color"
                                value={form.background_color || "#F8FAFC"}
                                onChange={handleChange}
                                aria-label={t("config.background_color", {defaultValue: "Color de fondo"})}
                                className="h-10 w-16 cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">
                                {t("config.topbar_color", {defaultValue: "Color del Topbar"})}
                            </label>
                            <input
                                type="color"
                                name="topbar_color"
                                value={form.topbar_color || "#0F172A"}
                                onChange={handleChange}
                                aria-label={t("config.topbar_color", {defaultValue: "Color del Topbar"})}
                                className="h-10 w-16 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Vista previa de layout */}
                    <div className="mt-8">
                        <p className="mb-2 text-sm text-gray-600">
                            {t("config.layout_preview", {defaultValue: "Vista previa del layout"})}
                        </p>
                        <div className="border rounded-lg overflow-hidden shadow-md">
                            <div
                                className="h-10 flex items-center px-3 text-white text-sm font-semibold"
                                style={{backgroundColor: form.topbar_color || "#0F172A"}}
                            >
                                {t("config.topbar_example", {defaultValue: "Topbar"})}
                            </div>
                            <div className="flex">
                                {/* Navbar */}
                                <div
                                    className="w-24 text-white text-xs flex items-center justify-center"
                                    style={{backgroundColor: form.primary_color || "#1E293B"}}
                                >
                                    {t("config.navbar_example", {defaultValue: "Navbar"})}
                                </div>

                                {/* Contenido */}
                                <div
                                    className="flex-1 p-4 text-center text-gray-700 text-sm"
                                    style={{backgroundColor: form.background_color || "#F8FAFC"}}
                                >
                                    {t("config.content_example", {defaultValue: "Contenido"})}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex space-x-4">
                        <AppButton type="submit" variant="primary">
                            {t("config.save_button", {defaultValue: "Guardar"})}
                        </AppButton>
                        <AppButton type="button" variant="secondary" onClick={restoreDefaults}>
                            {t("config.restore_button", {defaultValue: "Restaurar valores"})}
                        </AppButton>
                    </div>
                </AppWideForm>
            </AppSection>

            {/* Notificación global */}
            <Notification message={notif.message} type={notif.type} onClose={clear}/>
        </AppPageContainer>
    )
}
