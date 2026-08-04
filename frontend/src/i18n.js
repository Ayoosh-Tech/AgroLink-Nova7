import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ha from "./locales/ha/translation.json";

const savedLanguage = typeof window !== "undefined" ? localStorage.getItem("agrolink-language") : null;

const resources = {
  en: { translation: en },
  ha: { translation: ha },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage || "en",
  fallbackLng: "en",
  supportedLngs: ["en", "ha"],
  interpolation: { escapeValue: false },
});

export default i18n;
