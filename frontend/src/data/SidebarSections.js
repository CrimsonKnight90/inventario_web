// ============================================================
// Archivo: frontend/src/data/SidebarSections.js
// Descripción: Estructura de secciones del sidebar, dependiente de i18n y permisos
// Autor: CrimsonKnight90
// ============================================================

import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

/**
 * sidebarSections
 * @param {function} t - función de i18n para traducciones
 * @param {object} user - usuario actual
 * @param {boolean} isAuthenticated - estado de autenticación
 * @returns {Array<{ title: string, icon: React.Component, items: Array<{to: string, label: string}> }>}
 */
export const sidebarSections = (t, user, isAuthenticated) => {
  if (!isAuthenticated || !user) return [];

  // Utilidad robusta para determinar si el usuario es admin
  function isUserAdmin(u) {
    if (!u) return false;

    // 1) role como string (normalizado)
    const role =
      (u.role || u.roleName || u.role_name || u.role_type || "")
        .toString()
        .trim()
        .toLowerCase();
    if (["admin", "administrator", "superadmin", "owner"].includes(role)) return true;

    // 2) banderas booleanas comunes
    if (u.is_admin === true || u.admin === true || u.isAdmin === true) return true;

    // 3) array de roles
    if (Array.isArray(u.roles) && u.roles.some((r) => String(r).toLowerCase().trim() === "admin"))
      return true;

    // 4) permisos expresos
    if (Array.isArray(u.permissions) && u.permissions.includes("manage:admin")) return true;
    if (u.permissions && typeof u.permissions === "object" && u.permissions.admin === true) return true;

    return false;
  }

  const common = [
    {
      title: t("nav.dashboard", { defaultValue: "Dashboard" }),
      icon: PresentationChartBarIcon,
      items: [{ to: "/dashboard", label: t("nav.dashboard", { defaultValue: "Dashboard" }) }],
    },
    {
      title: t("nav.listados", { defaultValue: "Listados" }),
      icon: ShoppingBagIcon,
      items: [
        { to: "/listados/actividades", label: t("nav.all_activities", { defaultValue: "Todas las Actividades" }) },
        {
          to: "/listados/actividades/creadas",
          label: t("nav.created_activities", { defaultValue: "Actividades Creadas" }),
        },
        {
          to: "/listados/actividades/cerradas",
          label: t("nav.closed_activities", { defaultValue: "Actividades Cerradas" }),
        },
        { to: "/listados/proveedores", label: t("nav.proveedores", { defaultValue: "Proveedores" }) },
      ],
    },
    {
      title: t("nav.operativo", { defaultValue: "Operativo" }),
      icon: InboxIcon,
      items: [
        {
          to: "/operativo/actividades/crear",
          label: t("nav.create_activity", { defaultValue: "Crear Actividad" }),
        },
        {
          to: "/operativo/actividades/cerrar",
          label: t("nav.close_activity", { defaultValue: "Cerrar Actividad" }),
        },
      ],
    },
  ];

  const adminOnly = isUserAdmin(user)
    ? [
        {
          title: t("nav.administracion", { defaultValue: "Administración" }),
          icon: Cog6ToothIcon,
          items: [
            { to: "/proveedores", label: t("proveedores.title", { defaultValue: "Proveedores" }) },
            { to: "/categorias", label: t("nav.categorias", { defaultValue: "Categorías" }) },
            { to: "/productos", label: t("nav.products", { defaultValue: "Productos" }) },
            { to: "/centros-costo", label: t("nav.centros_costo", { defaultValue: "Centros de Costo" }) },
            { to: "/contrapartes", label: t("nav.contrapartes", { defaultValue: "Contrapartes" }) },
          ],
        },
        {
          title: t("nav.parametros", { defaultValue: "Parámetros" }),
          icon: UserCircleIcon,
          items: [
            { to: "/parametros/um", label: t("nav.um", { defaultValue: "Unidades de Medida" }) },
            { to: "/parametros/monedas", label: t("nav.currencies", { defaultValue: "Monedas" }) },
            {
              to: "/parametros/tipos-documentos",
              label: t("nav.tipos_documentos", { defaultValue: "Tipos de Documentos" }),
            },
          ],
        },
        {
          title: t("nav.usuario", { defaultValue: "Usuario" }),
          icon: PowerIcon,
          items: [
            { to: "/admin", label: t("nav.admin", { defaultValue: "Admin" }) },
            { to: "/config", label: t("nav.config", { defaultValue: "Configuración" }) },
          ],
        },
      ]
    : [];

  return [...common, ...adminOnly];
};
