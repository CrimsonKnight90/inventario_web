// ============================================================
// Archivo: frontend/src/types/config.types.ts
// Descripción: Tipos TypeScript para la configuración global
//              de la aplicación. Define contratos para tema,
//              branding, idioma y configuraciones del sistema.
// Autor: CrimsonKnight90
// ============================================================

export type AppTheme = "light" | "dark" | "auto";

export type AppLocale = "es" | "en";

export type ColorScheme = {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  surface: string;
  background: string;
  text: string;
  textSecondary: string;
  muted: string;
  border: string;
  danger: string;
  dangerHover: string;
  warning: string;
  warningHover: string;
  success: string;
  successHover: string;
  info: string;
  infoHover: string;
};

export type FontConfig = {
  sans: string;
  mono: string;
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
};

export type LayoutConfig = {
  sidebarWidth: string;
  topbarHeight: string;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
};

export type BrandingConfig = {
  appName: string;
  shortName: string;
  logoUrl: string;
  faviconUrl: string;
  companyName: string;
  companyUrl: string;
  supportEmail: string;
};

export type AppConfig = {
  theme: AppTheme;
  locale: AppLocale;
  colors: ColorScheme;
  fonts: FontConfig;
  layout: LayoutConfig;
  branding: BrandingConfig;
  features: {
    darkMode: boolean;
    multiLanguage: boolean;
    notifications: boolean;
    analytics: boolean;
  };
};

export type ConfigUpdate = Partial<AppConfig>;