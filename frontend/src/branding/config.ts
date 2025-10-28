// Branding configuration: small surface of truth referenced by UI components
// Keep runtime-friendly plain values; use VITE_ env vars if override needed at deploy

export type BrandingConfig = {
  appName: string;
  shortName: string;
  logoPath: string;
  faviconPath?: string;
  defaultLocale: "es" | "en";
  themeName: string;
};

export const brandingConfig: BrandingConfig = {
  appName: "Inventario Empresarial",
  shortName: "Inventario",
  logoPath: "/assets/logo.svg", // public or src/assets resolution depending on bundler
  faviconPath: "/favicon.ico",
  defaultLocale: "es",
  themeName: "default",
};
