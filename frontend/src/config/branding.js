// ============================================================
// Archivo: frontend/src/config/branding.js
// Descripción: Configuración centralizada de branding para la app.
//              Define un contrato claro y alias para compatibilidad con componentes existentes.
// Autor: CrimsonKnight90
// ============================================================

export const branding = {
  // Identidad
  appName: "Inventario Pro",      // canonical: ui display name
  app_name: "Inventario Pro",     // alias por compatibilidad
  logo: "/logo_empresa.png",      // canonical: path relativo en public/
  logo_url: "/logo_empresa.png",  // alias por compatibilidad

  // Colores organizados
  colors: {
    primary: "#134E4A",    // azul corporativo (sidebar, botones principales)
    secondary: "#F59E0B",  // naranja corporativo (hover, accents)
    background: "#F3F4F6", // fondo general
    topbar: "#0F172A",     // color por defecto del topbar (sobrescribe si hace falta)
  },

  // Alias planos para compatibilidad con código existente que usó snake_case
  primary_color: "#1E40AF",
  secondary_color: "#F59E0B",
  background_color: "#F3F4F6",
  topbar_color: "#0F172A",
};
