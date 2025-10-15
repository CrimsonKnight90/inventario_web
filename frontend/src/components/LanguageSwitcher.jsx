// ============================================================
// Archivo: frontend/src/components/LanguageSwitcher.jsx
// Descripción: Selector de idioma reutilizable para toda la app
// Autor: CrimsonKnight90
// ============================================================

import { useTranslation } from "react-i18next"

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        onClick={() => changeLanguage("es")}
        className="px-2 py-1 border rounded"
      >
        ES
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className="px-2 py-1 border rounded"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("fr")}
        className="px-2 py-1 border rounded"
      >
        FR
      </button>
      <button
        onClick={() => changeLanguage("ru")}
        className="px-2 py-1 border rounded"
      >
        RU
      </button>
    </div>
  )
}
