import i18 from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./locales/vi.json";
import en from "./locales/en.json";

const resources = {
  en: {
    translation: en
  },
  vi: {
    translation: vi
  },
};

i18
.use(initReactI18next)
.init({
    resources,
    lng: localStorage.getItem("language") || "vi"
})

export default i18;