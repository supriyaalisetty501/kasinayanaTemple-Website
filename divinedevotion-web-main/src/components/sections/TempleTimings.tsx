import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Clock } from "lucide-react";

interface Timings {
  morning_open: string;
  morning_close: string;
  evening_open: string;
  evening_close: string;
  pooja_morning: string;
  pooja_evening: string;
}

export const TempleTimings = () => {
  const { t } = useLanguage();
  const [timings, setTimings] = useState<Timings | null>(null);

  useEffect(() => {
    supabase
      .from("settings")
      .select("value")
      .eq("key", "timings")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setTimings(data.value as unknown as Timings);
      });
  }, []);

  const { lang } = useLanguage();

  return (
    <section id="timings" className="bg-gradient-divine py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="text-3xl">🔔</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-gradient-saffron md:text-5xl">
            {t("timingsTitle")}
          </h2>
        </div>

        <div className="mx-auto max-w-3xl rounded-3xl border-4 border-primary/30 bg-card p-10 text-center shadow-deep">
          <Clock className="mx-auto h-16 w-16 text-primary animate-flicker" />
          <p className="mt-4 font-display text-6xl font-bold text-gradient-saffron md:text-7xl">
            24 / 7
          </p>
          <p className="mt-3 text-lg font-semibold text-foreground/80 md:text-xl">
            {lang === "te"
              ? "ఆశ్రమం ఎల్లప్పుడూ తెరిచి ఉంటుంది — భక్తులకు ఎప్పుడైనా దర్శనం"
              : "The Ashramam is always open — devotees are welcome any time"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "te" ? "తెరవడం / మూసివేయడం లేదు" : "No opening or closing time"}
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-3xl border-2 border-secondary/40 bg-gradient-gold p-6 text-center shadow-soft">
          <Flame className="mx-auto h-8 w-8 text-secondary-foreground animate-flicker" />
          <h3 className="mt-2 font-display text-2xl font-bold text-secondary-foreground">
            {t("poojaTime")}
          </h3>
          <div className="mt-3 flex flex-wrap justify-center gap-6 text-secondary-foreground">
            <p className="text-lg font-semibold">🌅 {timings?.pooja_morning ?? "—"}</p>
            <p className="text-lg font-semibold">🌇 {timings?.pooja_evening ?? "—"}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
