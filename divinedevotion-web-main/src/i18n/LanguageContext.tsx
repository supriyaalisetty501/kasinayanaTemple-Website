import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "ashramam-lang";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>("te");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "te" || stored === "en") setLangState(stored);
    document.documentElement.lang = stored ?? "te";
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  };

  const t = (key: TranslationKey) => translations[key][lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className={lang === "te" ? "lang-te" : "lang-en"}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
