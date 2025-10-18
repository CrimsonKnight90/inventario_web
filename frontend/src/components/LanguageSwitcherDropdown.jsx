// ============================================================
// Archivo: frontend/src/components/LanguageSwitcherDropdown.jsx
// Descripción: Selector de idioma en formato dropdown compacto
// Autor: CrimsonKnight90
// ============================================================

import {useTranslation} from "react-i18next"
import {useState} from "react"
import "flag-icons/css/flag-icons.min.css"

export default function LanguageSwitcherDropdown({className = ""}) {
    const {i18n} = useTranslation()
    const [open, setOpen] = useState(false)
    const currentLang = i18n.language

    const langs = [
        {code: "es", label: "Es", flag: "fi fi-es", name: "Español"},
        {code: "en", label: "En", flag: "fi fi-gb", name: "English"},
        {code: "fr", label: "Fr", flag: "fi fi-fr", name: "Français"},
        {code: "ru", label: "Ru", flag: "fi fi-ru", name: "Русский"},
    ]

    const current = langs.find((lng) => currentLang.startsWith(lng.code)) || langs[0]

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang)
        setOpen(false)
    }

    return (
        <div className={`relative ${className}`}>
            {/* Botón principal */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition"
            >
                <span className={`${current.flag} w-5 h-5 rounded-sm`}></span>
                <span className="text-sm font-semibold">{current.label}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
            </button>


            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <ul className="py-1">
                        {langs.map((lng) => (
                            <li key={lng.code}>
                                <button
                                    onClick={() => changeLanguage(lng.code)}
                                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition ${
                                        currentLang.startsWith(lng.code)
                                            ? "bg-gray-100 font-semibold text-gray-900"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <span className={`${lng.flag} w-5 h-5 rounded-sm`}></span>
                                    {lng.name}
                                </button>

                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
