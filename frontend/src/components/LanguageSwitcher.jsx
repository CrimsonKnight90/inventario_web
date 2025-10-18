// ============================================================
// Archivo: frontend/src/components/LanguageSwitcher.jsx
// Descripción: Selector de idioma reutilizable y estilizado
// Autor: CrimsonKnight90
// ============================================================

import { useTranslation } from "react-i18next"

export default function LanguageSwitcher({ className = "", variant = "text" }) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  const langs = [
    { code: "es", label: "ES", flag: "🇪🇸", name: "Español" },
    { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
    { code: "fr", label: "FR", flag: "🇫🇷", name: "Français" },
    { code: "ru", label: "RU", flag: "🇷🇺", name: "Русский" },
  ]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {langs.map((lng) => {
        const isActive = currentLang.startsWith(lng.code)
        return (
          <button
            key={lng.code}
            onClick={() => changeLanguage(lng.code)}
            className={`
              flex items-center justify-center rounded-full border transition-all duration-200
              ${variant === "flags" ? "w-8 h-8 text-lg" : "px-2 py-1 text-xs font-semibold"}
              ${isActive
                ? "bg-white text-gray-900 border-gray-300 shadow-md scale-105"
                : "bg-gray-700 text-gray-200 border-transparent hover:bg-gray-600 hover:scale-105"}
            `}
            title={lng.name}
          >
            {variant === "flags" ? lng.flag : lng.label}
          </button>
        )
      })}
    </div>
  )
}
