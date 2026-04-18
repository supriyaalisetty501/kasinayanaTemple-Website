import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Camera } from "lucide-react";

interface GalleryItem {
  id: string;
  image_url: string;
  caption_te: string | null;
  caption_en: string | null;
}

export const Gallery = () => {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    supabase
      .from("gallery")
      .select("id,image_url,caption_te,caption_en")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems(data ?? []));
  }, []);

  return (
    <section id="gallery" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="text-3xl">📸</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-gradient-saffron md:text-5xl">
            {t("galleryTitle")}
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-primary/30 bg-card p-12 text-center">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-3 text-lg text-muted-foreground">{t("galleryEmpty")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <figure
                key={item.id}
                className="group overflow-hidden rounded-2xl border-2 border-primary/20 bg-card shadow-soft transition-smooth hover:shadow-glow"
              >
                <img
                  src={item.image_url}
                  alt={(lang === "te" ? item.caption_te : item.caption_en) ?? ""}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-smooth group-hover:scale-105"
                />
                {(item.caption_te || item.caption_en) && (
                  <figcaption className="p-3 text-sm font-medium">
                    {(lang === "te" ? item.caption_te : item.caption_en) ?? ""}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
