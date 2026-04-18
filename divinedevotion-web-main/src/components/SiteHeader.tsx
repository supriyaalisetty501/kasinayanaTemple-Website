import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocationBar } from "./LocationBar";
import templeIcon from "@/assets/temple-icon-left.png";
import { Link } from "react-router-dom";
import {
  Home,
  Sparkles,
  HandHeart,
  Clock,
  Image as ImageIcon,
  Gift,
  Calendar,
  Phone,
  Lock,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "#hero", key: "navHome" as const, Icon: Home },
  { href: "#about", key: "navAbout" as const, Icon: Sparkles },
  { href: "#service", key: "navService" as const, Icon: HandHeart },
  { href: "#timings", key: "navTimings" as const, Icon: Clock },
  { href: "#gallery", key: "navGallery" as const, Icon: ImageIcon },
  { href: "#donate", key: "navDonate" as const, Icon: Gift },
  { href: "#events", key: "navEvents" as const, Icon: Calendar },
  { href: "#contact", key: "navContact" as const, Icon: Phone },
];

export const SiteHeader = () => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-primary/20 bg-gradient-divine/95 backdrop-blur-md shadow-soft">
      {/* Collapsible top section: location + language + title */}
      <div
        className={`grid overflow-hidden transition-all duration-500 ease-out ${
          scrolled ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
        }`}
      >
        <div className="min-h-0">
          <LocationBar />

          <div className="flex justify-end px-4 py-2">
            <LanguageSwitcher />
          </div>

          <div className="container mx-auto flex items-center justify-between gap-3 px-4 pb-4">
            <img
              src={templeIcon}
              alt=""
              className="h-14 w-14 shrink-0 animate-flicker drop-shadow-md sm:h-20 sm:w-20 md:h-24 md:w-24"
              aria-hidden
            />

            <div className="flex-1 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent sm:text-sm">
                ✦ ॐ ✦
              </p>
              <h1 className="mt-1 font-display text-sm font-bold leading-tight text-gradient-saffron sm:text-xl md:text-2xl lg:text-3xl">
                {t("siteName")}
              </h1>
              <p className="mt-1 text-[10px] font-semibold text-accent sm:text-sm md:text-base">
                {t("siteLocation")}
              </p>
              <p className="mt-1 hidden text-xs font-medium text-muted-foreground sm:block sm:text-sm md:text-base">
                ✦ {t("tagline")} ✦
              </p>
            </div>

            <img
              src={templeIcon}
              alt=""
              className="h-14 w-14 shrink-0 animate-flicker drop-shadow-md sm:h-20 sm:w-20 md:h-24 md:w-24"
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Devotional nav buttons — always visible, horizontally scrollable on mobile */}
      <nav
        aria-label="Primary"
        className="border-t border-primary/15 bg-background/70 backdrop-blur"
      >
        <div className="container mx-auto px-2 py-2">
          <ul className="flex items-center gap-2 overflow-x-auto scrollbar-none md:flex-wrap md:justify-center md:gap-3">
            {NAV_ITEMS.map(({ href, key, Icon }) => (
              <li key={key} className="shrink-0">
                <a
                  href={href}
                  className="group relative inline-flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-br from-background to-secondary/10 px-3 py-2 text-xs font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-gradient-saffron hover:text-primary-foreground hover:shadow-glow sm:text-sm md:px-4"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-saffron text-primary-foreground shadow-sm transition-transform group-hover:rotate-12 group-hover:bg-white group-hover:text-primary md:h-7 md:w-7">
                    <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </span>
                  <span className="whitespace-nowrap">{t(key)}</span>
                </a>
              </li>
            ))}
            <li className="shrink-0">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground sm:text-sm"
              >
                <Lock className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">{t("adminLogin")}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Compact title strip when scrolled, so devotees still see the name */}
        <div
          className={`grid overflow-hidden bg-gradient-maroon text-primary-foreground transition-all duration-500 ${
            scrolled ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <p className="truncate px-4 py-1 text-center text-[11px] font-semibold sm:text-sm">
              ॐ {t("siteName")} ॐ
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
};
