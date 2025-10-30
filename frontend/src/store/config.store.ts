// frontend/src/store/config.store.ts
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

/* defaultConfig (igual que antes) */
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

/* Helpers */
function applyCssVariables(config: AppConfig): void {
  const root = document.documentElement;

  Object.entries(config.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  root.style.setProperty("--font-sans", config.fonts.sans);
  root.style.setProperty("--font-mono", config.fonts.mono);

  Object.entries(config.fonts.sizes).forEach(([key, value]) => {
    root.style.setProperty(`--text-${key}`, value);
  });

  root.style.setProperty("--sidebar-width", config.layout.sidebarWidth);
  root.style.setProperty("--topbar-height", config.layout.topbarHeight);

  Object.entries(config.layout.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });

  Object.entries(config.layout.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  if (config.theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function updateFavicon(url: string): void {
  const link = document.querySelector<HTMLLinkElement>("link[rel='icon']") ||
    document.createElement("link");
  link.rel = "icon";
  link.href = url;
  document.head.appendChild(link);
}

function updateTitle(appName: string): void {
  document.title = appName;
}

function hasConfigChanged(oldConfig: AppConfig, newConfig: AppConfig): boolean {
  return JSON.stringify(oldConfig) !== JSON.stringify(newConfig);
}

/* State type */
export type ConfigState = {
  config: AppConfig;
  isLoading: boolean;
  error: string | null;
  updateConfig: (update: ConfigUpdate) => void;
  resetConfig: () => void;
  exportConfig: () => string;
  importConfig: (jsonString: string) => boolean;
};

/* Store */
export const useConfigStore = create<ConfigState>()(
  // NOTA: no forzamos generics en persist para evitar discrepancias con versiones de tipos;
  // en su lugar casteamos el resultado de partialize a any (localizado y seguro).
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
          colors: { ...current.colors, ...(update.colors ?? {}) },
          fonts: { ...current.fonts, ...(update.fonts ?? {}) },
          layout: { ...current.layout, ...(update.layout ?? {}) },
          branding: { ...current.branding, ...(update.branding ?? {}) },
          features: { ...current.features, ...(update.features ?? {}) },
        };

        if (!hasConfigChanged(current, newConfig)) return;

        set({ config: newConfig, error: null });
        applyCssVariables(newConfig);

        if (newConfig.branding.faviconUrl !== current.branding.faviconUrl) {
          updateFavicon(newConfig.branding.faviconUrl);
        }
        if (newConfig.branding.appName !== current.branding.appName) {
          updateTitle(newConfig.branding.appName);
        }
      },

      resetConfig: () => {
        set({ config: defaultConfig, error: null });
        applyCssVariables(defaultConfig);
        updateFavicon(defaultConfig.branding.faviconUrl);
        updateTitle(defaultConfig.branding.appName);
      },

      exportConfig: () => JSON.stringify(get().config, null, 2),

      importConfig: (jsonString: string) => {
        try {
          const imported = JSON.parse(jsonString) as AppConfig;

          if (!imported.branding || !imported.colors) {
            set({ error: "Formato de configuración inválido" });
            return false;
          }

          if (!hasConfigChanged(get().config, imported)) return true;

          set({ config: imported, error: null });
          applyCssVariables(imported);
          updateFavicon(imported.branding.faviconUrl);
          updateTitle(imported.branding.appName);
          return true;
        } catch {
          set({ error: "Error al importar configuración: JSON inválido" });
          return false;
        }
      },
    }),
    {
      name: STORAGE_KEY,
      // aquí devolvemos únicamente la propiedad config; casteamos a any para
      // evitar fricciones tipográficas entre las versiones de los tipos de persist.
      partialize: (state) => ({ config: state.config }) as unknown as any,
    }
  )
);

/* Aplicar configuración inicial al cargar (runtime) */
if (typeof window !== "undefined") {
  const initialConfig = useConfigStore.getState().config;
  applyCssVariables(initialConfig);
  updateFavicon(initialConfig.branding.faviconUrl);
  updateTitle(initialConfig.branding.appName);
}
