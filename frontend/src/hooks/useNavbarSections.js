// ============================================================
// Archivo: frontend/src/hooks/useNavbarSections.js
// Descripción: Hook que devuelve la estructura de menús del Navbar
//              según el rol del usuario y traducciones i18n
// Autor: CrimsonKnight90
// ============================================================

import { useTranslation } from "react-i18next"

export function useNavbarSections(user) {
  const { t } = useTranslation()

  const sections = [
    {
      title: t("nav.listados", { defaultValue: "Listados" }),
      items: [
        { to: "/listados/actividades", label: "📋 " + t("nav.all_activities", { defaultValue: "Todas las Actividades" }) },
        { to: "/listados/actividades/creadas", label: "✅ " + t("nav.created_activities", { defaultValue: "Actividades Creadas" }) },
        { to: "/listados/actividades/cerradas", label: "🔒 " + t("nav.closed_activities", { defaultValue: "Actividades Cerradas" }) },
        { to: "/listados/proveedores", label: "🧑‍💼 " + t("nav.proveedores", { defaultValue: "Proveedores" }) },
      ]
    },
    {
      title: t("nav.administracion", { defaultValue: "Administración" }),
      items: [
        { to: "/proveedores", label: "🧑‍💼 " + t("proveedores.title", { defaultValue: "Proveedores" }) },
        { to: "/categorias", label: "🗂️ " + t("nav.categorias", { defaultValue: "Categorías" }) },
        { to: "/productos", label: "📦 " + t("nav.products", { defaultValue: "Productos" }) },
        { to: "/centros-costo", label: "🏢 " + t("nav.centros_costo", { defaultValue: "Centros de Costo" }) },
        { to: "/contrapartes", label: "🔄 " + t("nav.contrapartes", { defaultValue: "Contrapartes" }) },
      ]
    },
    {
      title: t("nav.operativo", { defaultValue: "Operativo" }),
      items: [
        { to: "/operativo/actividades/crear", label: "➕ " + t("nav.create_activity", { defaultValue: "Crear Actividad" }) },
        { to: "/operativo/actividades/cerrar", label: "🔒 " + t("nav.close_activity", { defaultValue: "Cerrar Actividad" }) },
      ]
    }
  ]

  if (user?.role === "admin") {
    sections.push({
      title: t("nav.parametros", { defaultValue: "Parámetros" }),
      items: [
        { to: "/parametros/um", label: "⚖️ " + t("nav.um", { defaultValue: "Unidades de Medida" }) },
        { to: "/parametros/monedas", label: "💱 " + t("nav.monedas", { defaultValue: "Monedas" }) },
        { to: "/parametros/tipos-documentos", label: "📑 " + t("nav.tipos_documentos", { defaultValue: "Tipos de Documentos" }) },
      ]
    })
  }

  return sections
}
