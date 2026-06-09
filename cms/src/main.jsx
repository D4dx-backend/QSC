import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./store";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import "./pwa";

import enTranslations from "./locales/en.json";
import deTranslations from "./locales/de.json";
import esTranslations from "./locales/es.json";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: localStorage.getItem("_lang") || "en", // default language
  resources: {
    en: { translation: enTranslations },
    de: { translation: deTranslations },
    es: { translation: esTranslations },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Measure performance
reportWebVitals();
