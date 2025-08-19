import { AppBar } from "@/components/landing/AppBar";
import { CtaSection } from "@/components/landing/CtaSection";
import { FeaturesSection } from "@/components/landing/FeatureSection";
import { SiteFooter } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { InfoSection } from "@/components/landing/InfoSection";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <AppBar />
      <Hero />
      <FeaturesSection />
      <InfoSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
}
