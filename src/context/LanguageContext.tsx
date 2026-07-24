import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enDict from '../locales/en.json';

export type Language = 'en' | 'ar-EG';
export type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const STORAGE_KEY = 'linux_academy_lang_v1';

// Dynamic dictionary cache to store lazy-loaded locale JSON files
const dictionaryCache: Record<string, any> = {
  en: enDict
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to get nested object property via dot notation (e.g. 'nav.tabs.challenge')
const getNestedProperty = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      // 1. URL Query Param Priority
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang) {
        if (urlLang.toLowerCase() === 'ar' || urlLang.toLowerCase() === 'ar-eg') {
          return 'ar-EG';
        }
        if (urlLang.toLowerCase() === 'en') {
          return 'en';
        }
      }

      // 2. LocalStorage Priority
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ar-EG' || saved === 'en') {
        return saved;
      }
    } catch (e) {
      console.error('Error reading language configuration', e);
    }
    return 'en';
  });

  const [activeDict, setActiveDict] = useState<any>(dictionaryCache[language] || enDict);

  // Dynamically lazy-load dictionary when language changes
  useEffect(() => {
    let isMounted = true;

    const loadLanguageDictionary = async () => {
      if (dictionaryCache[language]) {
        setActiveDict(dictionaryCache[language]);
        return;
      }

      try {
        let module;
        if (language === 'ar-EG') {
          module = await import('../locales/ar-EG.json');
        } else {
          module = await import('../locales/en.json');
        }

        const dictData = module.default || module;
        dictionaryCache[language] = dictData;

        if (isMounted) {
          setActiveDict(dictData);
        }
      } catch (error) {
        console.error(`Failed to lazy-load translations for ${language}:`, error);
        if (isMounted) {
          setActiveDict(dictionaryCache['en'] || enDict);
        }
      }
    };

    loadLanguageDictionary();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const isRTL = language === 'ar-EG';
  const direction: Direction = isRTL ? 'rtl' : 'ltr';

  // Apply attributes & sync URL state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);

      // Update HTML attributes
      document.documentElement.setAttribute('dir', direction);
      document.documentElement.setAttribute('lang', language);

      // Update URL query param smoothly without reloading page
      const url = new URL(window.location.href);
      const shortLang = language === 'ar-EG' ? 'ar' : 'en';
      if (url.searchParams.get('lang') !== shortLang) {
        url.searchParams.set('lang', shortLang);
        window.history.replaceState({}, '', url.toString());
      }
    } catch (e) {
      console.error('Error applying language side effects', e);
    }
  }, [language, direction]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ar-EG' : 'en'));
  };

  const t = (key: string, fallback?: string): string => {
    const currentDict = activeDict || dictionaryCache[language] || enDict;
    const value = getNestedProperty(currentDict, key);
    if (typeof value === 'string') return value;

    // Fallback to English dict if missing in current language
    const fallbackValue = getNestedProperty(enDict, key);
    if (typeof fallbackValue === 'string') return fallbackValue;

    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRTL,
        setLanguage,
        toggleLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

