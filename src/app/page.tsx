import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import EraChangeSection from "@/components/sections/EraChangeSection";
import AchievementSection from "@/components/sections/AchievementSection";
import AboutSection from "@/components/sections/AboutSection";
import CurriculumSection from "@/components/sections/CurriculumSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-text-main">
      <Header />
      <main>
        <HeroSection />
        <EraChangeSection />
        <AchievementSection />
        <AboutSection />
        <CurriculumSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
