import i18n from "i18next";
import Backend from "i18next-fs-backend";
import path from "path";

i18n.use(Backend).init({
  fallbackLng: "en",
  backend: {
    loadPath: path.join(process.cwd(), "public/locales/{{lng}}/{{ns}}.json"),
  },
  preload: ["en", "uk", "jp", "pl", "es", "de"],
  ns: ["translation"],
  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
