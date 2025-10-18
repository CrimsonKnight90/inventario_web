// ============================================================
// Archivo: frontend/src/components/Navbar.jsx
// Descripción: Sidebar lateral fijo con navegación y logout
// Autor: CrimsonKnight90
// ============================================================

import {useAuth} from "../context/AuthContext"
import {useTranslation} from "react-i18next"
import {useBranding} from "../context/BrandingContext"
import NavItem from "./NavItem"

export default function Navbar() {
    const {user, isAuthenticated} = useAuth()
    const {t} = useTranslation()
    const {branding} = useBranding()

    return (
        <aside
            className="fixed top-15 left-0 h-screen w-64 text-white flex flex-col z-40"
            style={{backgroundColor: branding?.primary_color || "#1E293B"}}
        >
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {isAuthenticated && (
                    <>
                        <NavItem to="/dashboard">
                            📊 {t("nav.dashboard", {defaultValue: "Dashboard"})}
                        </NavItem>

                        {/* 🔹 Sección Administracion */}
                        <div className="mt-6">
                            <p className="text-xs uppercase text-gray-400 mb-2">
                                {t("nav.administracion", {defaultValue: "Administracion"})}
                            </p>
                            <NavItem to="/categorias">
                                🗂️ {t("nav.categorias", {defaultValue: "Categorías"})}
                            </NavItem>
                            <NavItem to="/productos">
                                📦 {t("nav.products", {defaultValue: "Productos"})}
                            </NavItem>
                        </div>

                        {/* 🔹 Sección Operativo */}
                        <div className="mt-6">
                            <p className="text-xs uppercase text-gray-400 mb-2">
                                {t("nav.operativo", {defaultValue: "Operativo"})}
                            </p>
                            <NavItem to="/operativo/actividades/crear">
                                ➕ {t("nav.create_activity", {defaultValue: "Crear Actividad"})}
                            </NavItem>
                            <NavItem to="/operativo/actividades/cerrar">
                                🔒 {t("nav.close_activity", {defaultValue: "Cerrar Actividad"})}
                            </NavItem>
                        </div>

                        {/* 🔹 Sección Listados */}
                        <div className="mt-6">
                            <p className="text-xs uppercase text-gray-400 mb-2">
                                {t("nav.listados", {defaultValue: "Listados"})}
                            </p>
                            <NavItem to="/listados/actividades">
                                📋 {t("nav.all_activities", {defaultValue: "Todas las Actividades"})}
                            </NavItem>
                            <NavItem to="/listados/actividades/creadas">
                                ✅ {t("nav.created_activities", {defaultValue: "Actividades Creadas"})}
                            </NavItem>
                            <NavItem to="/listados/actividades/cerradas">
                                🔒 {t("nav.closed_activities", {defaultValue: "Actividades Cerradas"})}
                            </NavItem>
                        </div>

                        {/* 🔹 Sección Parámetros (solo admin) */}
                        {user?.role === "admin" && (
                            <div className="mt-6">
                                <p className="text-xs uppercase text-gray-400 mb-2">
                                    {t("nav.parametros", {defaultValue: "Parámetros"})}
                                </p>
                                <NavItem to="/parametros/um">
                                    ⚖️ {t("nav.um", {defaultValue: "Unidades de Medida"})}
                                </NavItem>
                                <NavItem to="/parametros/monedas">
                                    💱 {t("nav.monedas", {defaultValue: "Monedas"})}
                                </NavItem>
                                <NavItem to="/parametros/tipos-documentos">
                                    📑 {t("nav.tipos_documentos", {defaultValue: "Tipos de Documentos"})}
                                </NavItem>
                            </div>
                        )}
                    </>
                )}

                <p className="text-xs uppercase text-gray-400 mb-2">
                    {t("nav.usuario", {defaultValue: "Usuario"})}
                </p>

                {user?.role === "admin" && (
                    <>
                        <NavItem to="/admin">
                            🛠️ {t("nav.admin", {defaultValue: "Admin"})}
                        </NavItem>
                        <NavItem to="/config">
                            ⚙️ {t("nav.config", {defaultValue: "Configuración"})}
                        </NavItem>
                    </>
                )}
            </nav>
        </aside>
    )
}
