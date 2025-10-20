// ============================================================
// Archivo: frontend/src/components/Navbar.jsx
// Descripción: Sidebar colapsable con scroll por sección (Tailwind + Heroicons).
//              Detección robusta de Dashboard y Administración usando i18n.
//              Fix: colapso real de paneles (overflow-hidden en wrapper) para evitar superposición.
// Autor: CrimsonKnight90
// ============================================================

import React, {useState, useMemo} from "react";
import {useBranding} from "../context/BrandingContext";
import {useSidebarSections} from "../hooks/useSidebarSections";
import {NavLink} from "react-router-dom";
import SkeletonSidebar from "./SkeletonSidebar";
import {useTranslation} from "react-i18next";

export default function Navbar() {
    const {branding} = useBranding();
    const {sections, loading, error} = useSidebarSections();
    const {t} = useTranslation();
    const [open, setOpen] = useState(null);
    const [reloadKey, setReloadKey] = useState(0); // para re-evaluación si reintentar

    const cardBg = branding?.colors?.primary || "#1E293B";
    const hoverBg = branding?.colors?.secondary || "#F59E0B";

    const handleToggle = (idx) => setOpen((prev) => (prev === idx ? null : idx));
    const handleRetry = () => setReloadKey((k) => k + 1);

    const keyedSections = useMemo(
        () => (sections || []).map((s, i) => ({...s, _key: s.title || `section-${i}`})),
        [sections, reloadKey]
    );

    if (loading) return <SkeletonSidebar/>;

    // traducciones canonicas a comparar
    const DASHBOARD_LABEL = (t && typeof t === "function") ? t("nav.dashboard", {defaultValue: "Dashboard"}).toLowerCase() : "dashboard";
    const ADMIN_LABEL = (t && typeof t === "function") ? t("nav.administracion", {defaultValue: "Administración"}).toLowerCase() : "administración";

    return (
        <aside
            aria-label="Sidebar"
            className="fixed left-0 w-64 z-30"
            style={{
                top: "var(--topbar-height)",
                height: "calc(100vh - var(--topbar-height))",
                backgroundColor: cardBg,
                "--hover-bg": hoverBg,
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
            }}
        >
            <div className="px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">

                    {/* Título: mismas utilidades que los enlaces, pero más grande */}
                    <div className="flex flex-col">
                        <span className="text-white font-heading font-semibold text-base leading-tight">
                            {t ? t("nav.panel_label", {defaultValue: "Panel de navegación"}) : "Panel"}
                        </span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-2 py-3">
                {error ? (
                    <div className="px-4 py-3">
                        <p className="text-sm text-yellow-200 mb-3">Error al cargar el menú. Por favor intenta
                            nuevamente.</p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleRetry}
                                className="px-3 py-2 rounded bg-white/6 text-white hover:bg-white/10 transition"
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                ) : keyedSections.length === 0 ? (
                    <p className="text-xs text-gray-200 px-3">No hay secciones disponibles.</p>
                ) : (
                    keyedSections.map((section, idx) => {
                        const titleNormalized = String(section.title || "").toLowerCase();

                        // 1) Dashboard: si la sección se llama "dashboard" (i18n) o contiene un único item /dashboard => enlace directo
                        const isDashboardByTitle = titleNormalized === DASHBOARD_LABEL || titleNormalized.includes(DASHBOARD_LABEL);
                        const isDashboardSingle =
                            isDashboardByTitle ||
                            (Array.isArray(section.items) && section.items.length === 1 && section.items[0]?.to === "/dashboard");

                        if (isDashboardSingle) {
                            const item = section.items[0];
                            return (
                                <div key={section._key} className="mb-3">
                                    <NavLink
                                        to={item.to}
                                        className={({isActive}) =>
                                            `flex items-center gap-2 px-4 py-2 rounded transition-colors duration-150 ${
                                                isActive ? "bg-white/6 text-white font-semibold" : "text-white hover:bg-[var(--hover-bg)] hover:text-black/90"
                                            }`
                                        }
                                    >
                                        {section.icon ?
                                            <section.icon className="h-5 w-5 text-white/95" aria-hidden="true"/> : null}
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </NavLink>
                                </div>
                            );
                        }

                        // 2) Administración: detectar por título traducido y al expandir mostrar todo sin scroll interno
                        const isAdministracion = titleNormalized === ADMIN_LABEL || titleNormalized.includes(ADMIN_LABEL);

                        return (
                            <div key={section._key} className="mb-4">
                                <button
                                    type="button"
                                    onClick={() => handleToggle(idx)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded transition-colors duration-150 hover:bg-white/5"
                                    aria-expanded={open === idx}
                                >
                                    <div className="flex items-center gap-3">
                                        {section.icon ?
                                            <section.icon className="h-5 w-5 text-white/95" aria-hidden="true"/> : null}
                                        <span className="text-sm font-medium text-white">{section.title}</span>
                                    </div>

                                    <svg
                                        className={`ml-auto h-4 w-4 text-white transition-transform duration-150 ${open === idx ? "rotate-180" : ""}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                </button>

                                {/* PANEL: wrapper exterior controla el colapso y recorte */}
                                <div
                                    className={`mt-1 px-1 transition-[max-height] duration-200 ease-in-out overflow-hidden ${
                                        open === idx ? "max-h-[2000px]" : "max-h-0"
                                    }`}
                                >
                                    {/* contenido interior fluye libremente; no max-h ni overflow interno */}
                                    <div className="pr-1">
                                        <ul className={`space-y-1 ${isAdministracion ? "" : ""}`}>
                                            {section.items.map((item) => (
                                                <li key={item.to}>
                                                    <NavLink
                                                        to={item.to}
                                                        className={({isActive}) =>
                                                            `flex items-center gap-2 px-6 py-2 rounded transition-colors duration-150 ${
                                                                isActive ? "bg-white/6 text-white font-semibold" : "text-white hover:bg-[var(--hover-bg)] hover:text-black/90"
                                                            }`
                                                        }
                                                    >
                                                        <svg className="h-3 w-4 text-white/70" viewBox="0 0 24 24"
                                                             fill="none" stroke="currentColor">
                                                            <path d="M9 18l6-6-6-6" strokeWidth="2"
                                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                        <span className="text-sm">{item.label}</span>
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </nav>

            {/* El logout quedó en Topbar según tu directiva */}
        </aside>
    );
}
