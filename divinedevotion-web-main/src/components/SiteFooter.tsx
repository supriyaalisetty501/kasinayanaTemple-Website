import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";

export const SiteFooter = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-3xl">🪔</p>
        <h3 className="mt-3 font-display text-2xl font-bold md:text-3xl">{t("siteName")}</h3>
        <p className="mt-2 text-base text-background/80">{t("footerLine")}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-6 text-lg font-semibold">
          <a href="tel:9160603071" className="hover:text-primary-glow">📞 9160603071</a>
          <a href="tel:9000946770" className="hover:text-primary-glow">📞 9000946770</a>
        </div>
        <div className="mt-6 border-t border-background/20 pt-6 text-sm text-background/60">
          <p>© {new Date().getFullYear()} Kasinayana Ashramam Chowduru</p>
          <Link to="/admin" className="mt-1 inline-block text-xs hover:text-primary-glow">
            {t("adminLogin")}
          </Link>
        </div>
      </div>
    </footer>
  );
};
