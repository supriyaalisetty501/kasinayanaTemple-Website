import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { MapPin } from "lucide-react";

export const MapSection = () => {
  const { t, lang } = useLanguage();

  const [map] = useState({
    embed_url: "https://www.google.com/maps/embed?pb=!1m18!...",
    address_te: "కాశినాయన ఆశ్రమం, చౌడూరు",
    address_en: "Kasinayana Ashramam, Chowduru",
  });

  return (
    <section id="contact">
      <h2>{t("mapTitle")}</h2>
      <p>
        <MapPin /> {lang === "te" ? map.address_te : map.address_en}
      </p>

      <iframe
        src={map.embed_url}
        className="w-full h-[400px]"
        loading="lazy"
      />
    </section>
  );
};