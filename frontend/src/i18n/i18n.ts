// src/i18n/i18n.ts

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import { brandingConfig } from "@branding/config";

/**
 * i18n configuration for the application.
 * - Loads English and Spanish translations.
 * - Uses brandingConfig.defaultLocale as the initial language.
 * - Falls back to Spanish if the selected language is missing.
 */
export const resources = {
  en: { translation: en },
  es: { translation: es },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: brandingConfig.defaultLocale || "es",
  fallbackLng: "es",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
