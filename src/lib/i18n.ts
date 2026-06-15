import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../locales/en/translation.json";
import zh from "../locales/zh/translation.json";
import ja from "../locales/ja/translation.json";
import ko from "../locales/ko/translation.json";
import es from "../locales/es/translation.json";
import fr from "../locales/fr/translation.json";
import de from "../locales/de/translation.json";

export const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
};

export const SUPPORTED_LANGUAGES = ["en", "zh", "ja", "ko", "es", "fr", "de"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_UI_LANGUAGE: SupportedLanguage = "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_UI_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
