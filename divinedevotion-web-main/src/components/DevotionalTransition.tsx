import { useEffect, useState } from "react";

/**
 * Shows a brief devotional spinning Om / diya overlay when navigating
 * via hash links (#about, #donate, etc.) and smoothly scrolls to the section.
 */
export const DevotionalTransition = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a") as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;

      const el = document.querySelector(href);
      if (!el) return;

      e.preventDefault();
      setActive(true);

      // After brief devotional animation, scroll smoothly
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", href);
      }, 450);

      window.setTimeout(() => setActive(false), 1100);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-background/40 backdrop-blur-[2px] animate-fade-in"
      aria-hidden
    >
      <div className="relative flex items-center justify-center">
        {/* Outer rotating chakra ring */}
        <div className="absolute h-40 w-40 rounded-full border-4 border-dashed border-primary/70 animate-[spin_2s_linear_infinite]" />
        {/* Inner counter-rotating gold ring */}
        <div className="absolute h-28 w-28 rounded-full border-4 border-dotted border-secondary animate-[spin_1.5s_linear_infinite_reverse]" />
        {/* Glowing Om */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-saffron shadow-glow">
          <span className="font-display text-4xl font-bold text-white drop-shadow-md animate-flicker">
            ॐ
          </span>
        </div>
      </div>
    </div>
  );
};
