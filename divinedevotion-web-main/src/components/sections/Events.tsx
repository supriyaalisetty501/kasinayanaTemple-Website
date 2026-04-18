import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays } from "lucide-react";

interface EventRow {
  id: string;
  title_te: string;
  title_en: string;
  description_te: string | null;
  description_en: string | null;
  event_date: string | null;
  image_url: string | null;
}

export const Events = () => {
  const { t, lang } = useLanguage();
  const [events, setEvents] = useState<EventRow[]>([]);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .order("event_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => setEvents((data as EventRow[]) ?? []));
  }, []);

  const fmt = (d: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString(lang === "te" ? "te-IN" : "en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  return (
    <section id="events" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="text-3xl">🗓️</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-gradient-saffron md:text-5xl">
            {t("eventsTitle")}
          </h2>
        </div>

        {events.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-primary/30 bg-card p-12 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-3 text-lg text-muted-foreground">{t("eventsEmpty")}</p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {events.map((e) => (
              <article
                key={e.id}
                className="overflow-hidden rounded-3xl border-2 border-primary/20 bg-card shadow-soft transition-smooth hover:shadow-glow"
              >
                {e.image_url && (
                  <img src={e.image_url} alt="" loading="lazy" className="h-48 w-full object-cover" />
                )}
                <div className="p-5">
                  {e.event_date && (
                    <p className="text-sm font-semibold text-primary">{fmt(e.event_date)}</p>
                  )}
                  <h3 className="mt-1 font-display text-2xl font-bold">
                    {lang === "te" ? e.title_te : e.title_en}
                  </h3>
                  <p className="mt-2 text-foreground/80">
                    {lang === "te" ? e.description_te : e.description_en}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
