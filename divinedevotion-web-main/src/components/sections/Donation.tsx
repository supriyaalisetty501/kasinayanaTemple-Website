import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Heart } from "lucide-react";

export const Donation = () => {
  const { t } = useLanguage();
  const [phones, setPhones] = useState<{ phone1: string; phone2: string }>({
    phone1: "9160603071",
    phone2: "9000946770",
  });

  useEffect(() => {
    supabase
      .from("settings")
      .select("value")
      .eq("key", "donation")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setPhones(data.value as unknown as typeof phones);
      });
  }, []);

  return (
    <section id="donate" className="bg-gradient-saffron py-16 text-primary-foreground md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <Heart className="mx-auto h-12 w-12 animate-flicker" fill="currentColor" />
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
            {t("donateTitle")}
          </h2>
          <p className="mt-3 text-lg text-primary-foreground/90 md:text-xl">{t("donateSubtitle")}</p>
          <p className="mt-6 text-base md:text-lg">{t("donateAsk")}</p>

          <div className="mt-8 rounded-3xl bg-card p-6 text-foreground shadow-deep md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("contactNumbers")}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-x-8 gap-y-2 text-2xl font-bold text-primary md:text-3xl">
              <a href={`tel:${phones.phone1}`} className="hover:underline">
                📞 {phones.phone1}
              </a>
              <a href={`tel:${phones.phone2}`} className="hover:underline">
                📞 {phones.phone2}
              </a>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Button asChild size="lg" className="h-14 bg-gradient-saffron text-base font-semibold">
                <a href={`tel:${phones.phone1}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  {t("callNow")}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="h-14 bg-[hsl(142_70%_42%)] text-base font-semibold text-white hover:bg-[hsl(142_70%_38%)]"
              >
                <a
                  href={`https://wa.me/91${phones.phone1}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t("whatsapp")}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 border-2 border-primary text-base font-semibold text-primary"
              >
                <a href={`tel:${phones.phone2}`}>
                  <Heart className="mr-2 h-5 w-5" />
                  {t("donateNow")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
