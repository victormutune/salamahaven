import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import sw from './locales/sw.json';
import kik from './locales/kik.json'; // Kikuyu
import luo from './locales/luo.json'; // Luo
import luh from './locales/luh.json'; // Luhya
import kam from './locales/kam.json'; // Kamba

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            sw: { translation: sw },
            kik: { translation: kik },
            luo: { translation: luo },
            luh: { translation: luh },
            kam: { translation: kam },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
