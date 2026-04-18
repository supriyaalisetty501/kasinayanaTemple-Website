import { useLanguage } from "@/i18n/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageSwitcher = () => {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-card/80 px-3 py-1.5 shadow-soft backdrop-blur">
      <Languages className="h-4 w-4 text-primary" aria-hidden />
      <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
        🌐 {t("selectLanguage")}:
      </span>
      <button
        onClick={() => setLang("te")}
        className={`rounded-full px-3 py-1 text-sm font-semibold transition-smooth ${
          lang === "te"
            ? "bg-gradient-saffron text-primary-foreground shadow-soft"
            : "text-foreground hover:bg-muted"
        }`}
        aria-pressed={lang === "te"}
      >
        తెలుగు
      </button>
      <span className="text-muted-foreground">|</span>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 text-sm font-semibold transition-smooth ${
          lang === "en"
            ? "bg-gradient-saffron text-primary-foreground shadow-soft"
            : "text-foreground hover:bg-muted"
        }`}
        aria-pressed={lang === "en"}
      >
        English
      </button>
    </div>
  );
};
