import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Clock } from "lucide-react";

export const LocationBar = () => {
  const { lang } = useLanguage();
  const [address, setAddress] = useState({
    te: "శ్రీ కాశినాయన ఆశ్రమం, చౌడూరు, ఆంధ్రప్రదేశ్",
    en: "Sri Kasinayana Ashramam, Chowduru, Andhra Pradesh",
  });

  useEffect(() => {
    supabase
      .from("settings")
      .select("value")
      .eq("key", "map")
      .maybeSingle()
      .then(({ data }) => {
        const v = (data?.value ?? {}) as { address_te?: string; address_en?: string };
        if (v.address_te || v.address_en) {
          setAddress({
            te: v.address_te ?? address.te,
            en: v.address_en ?? address.en,
          });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full bg-gradient-maroon text-primary-foreground">
      <div className="container mx-auto flex flex-col items-center justify-center gap-1 px-4 py-2 text-center text-xs font-medium sm:flex-row sm:gap-6 sm:text-sm">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <a
            href="#contact"
            className="underline-offset-2 hover:underline"
          >
            {lang === "te" ? address.te : address.en}
          </a>
        </span>
        <span className="hidden h-4 w-px bg-primary-foreground/40 sm:inline-block" />
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {lang === "te" ? "24 గంటలూ తెరిచి ఉంటుంది" : "Open 24 / 7"}
        </span>
      </div>
    </div>
  );
};
