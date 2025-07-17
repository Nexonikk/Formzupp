import SafariDemo from "@/components/layout/demovideo";
import { FAQ } from "@/components/layout/faq";
import { Features } from "@/components/layout/features";
import { HeroSection } from "@/components/layout/Hero";
import HowItWorks from "@/components/layout/how-it-works";
import { HeroWrapper } from "@/components/wrappers/hero-wrapper";

export default function Home() {
  return (
    <main className="dark:bg-black">
      <HeroWrapper>
        <HeroSection />
        <HowItWorks />
        <Features />
        <SafariDemo />
        <FAQ />
      </HeroWrapper>
    </main>
  );
}
