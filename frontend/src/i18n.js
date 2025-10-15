import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// Importa todos los JSON de traducciones
import es from "./locales/es.json"
import en from "./locales/en.json"
import fr from "./locales/fr.json"
import ru from "./locales/ru.json"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      fr: { translation: fr },
      ru: { translation: ru }
    },
    lng: "es",          // idioma inicial
    fallbackLng: "en",  // idioma de respaldo
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
