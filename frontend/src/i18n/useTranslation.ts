import { useState } from 'react';
import { TRANSLATIONS } from './translations';

export type LanguageCode = 'vi' | 'en';

export interface UseTranslationResult {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof typeof TRANSLATIONS.vi) => string;
}

export function useTranslation(): UseTranslationResult {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('cv_builder_lang');
    return saved === 'en' || saved === 'vi' ? saved : 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    localStorage.setItem('cv_builder_lang', lang);
    setLanguageState(lang);
  };

  const t = (key: keyof typeof TRANSLATIONS.vi): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.vi[key];
  };

  return { language, setLanguage, t };
}
