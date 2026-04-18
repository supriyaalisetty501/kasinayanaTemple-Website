import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-temple.jpg";

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section id="hero" className="relative overflow-hidden">
      <img
        src={heroImg}
        alt=""
        className="h-[70vh] min-h-[480px] w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-hero-overlay" style={{ background: "var(--gradient-hero-overlay)" }} />
      <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-12 text-center md:pb-20">
        <div className="animate-float-up max-w-4xl">
          <p className="mb-3 text-3xl">🪔</p>
          <h2 className="font-display text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
            {t("heroWelcome")}
          </h2>
          <p className="mt-4 text-lg font-medium text-white/90 drop-shadow sm:text-xl md:text-2xl">
            {t("heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-14 bg-gradient-saffron text-base font-semibold shadow-glow hover:opacity-95">
              <a href="#timings">{t("heroDarshan")}</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 border-2 border-white/80 bg-white/10 text-base font-semibold text-white backdrop-blur hover:bg-white hover:text-foreground"
            >
              <a href="#donate">{t("heroDonate")}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
