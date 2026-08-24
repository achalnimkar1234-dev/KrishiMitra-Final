import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useSession } from '@/components/SessionContext';
import { translations, getNestedTranslation } from './index';

type LanguageContextType = {
  t: (key: string) => string;
  language: string;
  setLanguage: (lang: 'marathi' | 'hindi' | 'english') => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useSession();

  const t = useCallback(
    (key: string) => {
      // Map session language to translation dictionary key
      const langKey = language === 'english' ? 'en' : language === 'hindi' ? 'hi' : 'mr';
      
      const translation = getNestedTranslation(translations[langKey], key);
      
      // Fallback to English dictionary if not found in selected language
      if (translation === undefined) {
        const fallback = getNestedTranslation(translations['en'], key);
        if (fallback !== undefined) return fallback;
        
        // If missing in all dictionaries, log warning in console and return humanized key segment
        console.warn(`[i18n] Missing translation key: "${key}" for language "${language}"`);
        const parts = key.split('.');
        const last = parts[parts.length - 1];
        return last.charAt(0).toUpperCase() + last.slice(1).replace(/([A-Z])/g, ' $1');
      }
      
      return translation;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
