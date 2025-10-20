// ============================================================
// Archivo: tailwind.config.js
// Descripción: Configuración de TailwindCSS con branding dinámico y fallbacks defensivos
// Autor: CrimsonKnight90
// ============================================================

import { branding } from "./src/config/branding.js";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fallbacks seguros si branding no está presente o le faltan claves
        primary: branding?.colors?.primary ?? branding?.primary_color ?? "#1E293B",
        secondary: branding?.colors?.secondary ?? branding?.secondary_color ?? "#64748B",
        background: branding?.colors?.background ?? branding?.background_color ?? "#FFFFFF",
        topbar: branding?.colors?.topbar ?? branding?.topbar_color ?? "#0F172A",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 4px 6px rgba(0,0,0,0.1)",
        soft: "0 2px 4px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl: "1rem",
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
};
