import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Service } from "@/components/sections/Service";
import { TempleTimings } from "@/components/sections/TempleTimings";
import { Gallery } from "@/components/sections/Gallery";
import { Donation } from "@/components/sections/Donation";
import { MapSection } from "@/components/sections/MapSection";
import { Events } from "@/components/sections/Events";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Service />
        <TempleTimings />
        <Gallery />
        <Donation />
        <Events />
        <MapSection />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
