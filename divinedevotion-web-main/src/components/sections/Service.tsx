import { useLanguage } from "@/i18n/LanguageContext";
import annadhanamImg from "@/assets/annadhanam.jpg";
import { Utensils, Calendar, HandHeart, BookOpen } from "lucide-react";

export const Service = () => {
  const { t } = useLanguage();
  const items = [
    { icon: Calendar, title: t("servicePournami"), desc: t("servicePournamiDesc") },
    { icon: Utensils, title: t("serviceDaily"), desc: t("serviceDailyDesc") },
    { icon: HandHeart, title: t("serviceFamily"), desc: t("serviceFamilyDesc") },
    { icon: BookOpen, title: t("serviceGuide"), desc: t("serviceGuideDesc") },
  ];

  return (
    <section id="service" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="text-3xl">🙏</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-gradient-saffron md:text-5xl">
            {t("serviceTitle")}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">{t("serviceLead")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border-4 border-secondary/40 shadow-deep">
            <img src={annadhanamImg} alt="Annadhanam service" loading="lazy" width={1280} height={832} className="h-full w-full object-cover" />
          </div>

          <div className="grid gap-4">
            {items.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border-2 border-primary/15 bg-card p-5 shadow-soft transition-smooth hover:border-primary/40 hover:shadow-glow"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-saffron text-primary-foreground shadow-soft">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground md:text-base">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
