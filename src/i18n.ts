import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import merged translation files
import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';

// Translation resources
const resources = {
    en: { translation: en },
    de: { translation: de },
    es: { translation: es },
};

// Get saved language or browser language
const savedLanguage = localStorage.getItem('i18nextLng');
const browserLanguage = navigator.language.split('-')[0]; // en-US → en

const defaultLanguage =
    savedLanguage ||
    (resources[browserLanguage as keyof typeof resources]
        ? browserLanguage
        : 'en');

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: defaultLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes
        },
        react: {
            useSuspense: true,
        },
    });

// Persist language change
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
});

export default i18n;
