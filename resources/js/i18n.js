import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import trMessages from './locales/tr.json';
import enMessages from './locales/en.json';

const resources = {
    tr: {
        translation: trMessages,
    },
    en: {
        translation: enMessages,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'tr', // Default language
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already escapes values
    },
});

export default i18n;