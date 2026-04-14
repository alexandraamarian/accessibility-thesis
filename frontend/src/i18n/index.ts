import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ro } from './ro';
import { en } from './en';

function getSavedLanguage(): string {
  try {
    return localStorage.getItem('study-language') || 'ro';
  } catch {
    return 'ro';
  }
}

i18n.use(initReactI18next).init({
  resources: {
    ro: { translation: ro },
    en: { translation: en },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'ro',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
