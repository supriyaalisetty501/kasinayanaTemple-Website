import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import swamyImg from "@/assets/swamy-portrait.jpg";
import { BookOpen, Heart, Sparkles } from "lucide-react";

export const About = () => {
  const { t, lang } = useLanguage();
  const [story, setStory] = useState<{ te: string; en: string }>({ te: "", en: "" });

  useEffect(() => {
    supabase
      .from("settings")
      .select("value")
      .eq("key", "about")
      .maybeSingle()
      .then(({ data }) => {
        const v = (data?.value ?? {}) as { story_te?: string; story_en?: string };
        setStory({ te: v.story_te ?? "", en: v.story_en ?? "" });
      });
  }, []);

  return (
    <section id="about" className="bg-gradient-divine py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="text-3xl">🕉️</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-gradient-saffron md:text-5xl">
            {t("aboutTitle")}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">{t("aboutLead")}</p>
        </div>

        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-4 rounded-full bg-gradient-saffron opacity-20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border-4 border-primary/30 shadow-deep">
              <img src={swamyImg} alt="Sri Kasinayana Swamy" loading="lazy" width={1024} height={1024} />
            </div>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-foreground/90 md:text-xl">
              {lang === "te" ? story.te : story.en}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Sparkles, label: t("teachTruth") },
                { icon: BookOpen, label: t("teachDharma") },
                { icon: Heart, label: t("teachSeva") },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border-2 border-primary/20 bg-card p-4 text-center shadow-soft"
                >
                  <Icon className="mx-auto mb-2 h-7 w-7 text-primary" />
                  <p className="text-sm font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
