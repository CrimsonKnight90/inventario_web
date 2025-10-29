// ============================================================
// Archivo: frontend/src/store/config.store.ts
// Descripción: Store de Zustand para gestionar la configuración
//              global de la aplicación. Incluye persistencia
//              en localStorage y sincronización con CSS vars.
// Autor: CrimsonKnight90
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppConfig, ConfigUpdate } from "../types/config.types";

const STORAGE_KEY = "inventario_config_v2";

/**
 * Configuración por defecto de la aplicación
 */
const defaultConfig: AppConfig = {
  theme: "light",
  locale: "es",
  colors: {
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    secondary: "#06b6d4",
    secondaryHover: "#0891b2",
    surface: "#ffffff",
    background: "#f9fafb",
    text: "#111827",
    textSecondary: "#6b7280",
    muted: "#9ca3af",
    border: "#e5e7eb",
    danger: "#dc2626",
    dangerHover: "#b91c1c",
    warning: "#f59e0b",
    warningHover: "#d97706",
    success: "#16a34a",
    successHover: "#15803d",
    info: "#3b82f6",
    infoHover: "#2563eb",
  },
  fonts: {
    sans: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
  },
  layout: {
    sidebarWidth: "240px",
    topbarHeight: "64px",
    borderRadius: {
      sm: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
    },
    spacing: {
      xs: "0.5rem",
      sm: "0.75rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
  },
  branding: {
    appName: "Inventario Empresarial",
    shortName: "Inventario",
    logoUrl: "/assets/logo.svg",
    faviconUrl: "/favicon.ico",
    companyName: "Tu Empresa",
    companyUrl: "https://tuempresa.com",
    supportEmail: "soporte@tuempresa.com",
  },
  features: {
    darkMode: true,
    multiLanguage: true,
    notifications: true,
    analytics: false,
  },
};

/**
 * Aplica las variables CSS basadas en la configuración
 */
function applyCssVariables(config: AppConfig): void {
  const root = document.documentElement;

  // Colores
  Object.entries(config.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Fuentes
  root.style.setProperty("--font-sans", config.fonts.sans);
  root.style.setProperty("--font-mono", config.fonts.mono);

  // Tamaños de fuente
  Object.entries(config.fonts.sizes).forEach(([key, value]) => {
    root.style.setProperty(`--text-${key}`, value);
  });

  // Layout
  root.style.setProperty("--sidebar-width", config.layout.sidebarWidth);
  root.style.setProperty("--topbar-height", config.layout.topbarHeight);

  // Border radius
  Object.entries(config.layout.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });

  // Spacing
  Object.entries(config.layout.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Tema
  if (config.theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Actualiza el favicon dinámicamente
 */
function updateFavicon(url: string): void {
  const link = document.querySelector<HTMLLinkElement>("link[rel='icon']") ||
    document.createElement("link");
  link.rel = "icon";
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Actualiza el título de la página
 */
function updateTitle(appName: string): void {
  document.title = appName;
}

type ConfigState = {
  config: AppConfig;
  isLoading: boolean;
  error: string | null;
  updateConfig: (update: ConfigUpdate) => void;
  resetConfig: () => void;
  exportConfig: () => string;
  importConfig: (jsonString: string) => boolean;
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      isLoading: false,
      error: null,

      updateConfig: (update: ConfigUpdate) => {
        const current = get().config;
        const newConfig: AppConfig = {
          ...current,
          ...update,
          colors: { ...current.colors, ...update.colors },
          fonts: { ...current.fonts, ...update.fonts },
          layout: { ...current.layout, ...update.layout },
          branding: { ...current.branding, ...update.branding },
          features: { ...current.features, ...update.features },
        };

        set({ config: newConfig, error: null });
        applyCssVariables(newConfig);
        updateFavicon(newConfig.branding.faviconUrl);
        updateTitle(newConfig.branding.appName);
      },

      resetConfig: () => {
        set({ config: defaultConfig, error: null });
        applyCssVariables(defaultConfig);
        updateFavicon(defaultConfig.branding.faviconUrl);
        updateTitle(defaultConfig.branding.appName);
      },

      exportConfig: () => {
        const { config } = get();
        return JSON.stringify(config, null, 2);
      },

      importConfig: (jsonString: string) => {
        try {
          const imported = JSON.parse(jsonString) as AppConfig;

          // Validación básica
          if (!imported.branding || !imported.colors) {
            set({ error: "Formato de configuración inválido" });
            return false;
          }

          set({ config: imported, error: null });
          applyCssVariables(imported);
          updateFavicon(imported.branding.faviconUrl);
          updateTitle(imported.branding.appName);
          return true;
        } catch (err) {
          set({ error: "Error al importar configuración: JSON inválido" });
          return false;
        }
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ config: state.config }),
    }
  )
);

// Aplicar configuración inicial al cargar
if (typeof window !== "undefined") {
  const initialConfig = useConfigStore.getState().config;
  applyCssVariables(initialConfig);
  updateFavicon(initialConfig.branding.faviconUrl);
  updateTitle(initialConfig.branding.appName);
}