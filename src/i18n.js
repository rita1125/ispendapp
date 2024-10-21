import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLanguage from './locales/en.json';
import twLanguage from './locales/tw.json';

i18n
  .use(initReactI18next)  //將 i18next & react-i18next 弄一起
  .init({
    resources: {
      en: { translation: enLanguage },
      tw: { translation: twLanguage },
    },
    lng: 'tw',            // 預設語言
    fallbackLng: 'tw',    // 備選語言
    interpolation: {
      escapeValue: false, //防止react自動把HTML轉換成文本
    },
  });

export default i18n;