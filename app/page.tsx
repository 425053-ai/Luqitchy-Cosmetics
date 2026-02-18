'use client';
import { Header } from "@/components/header"
import { HeroSectionPremium } from "@/components/hero-section-premium"
import { AboutSection } from "@/components/about-section"
import { ProductsSection } from "@/components/products-section"
import { BrandStory } from "@/components/brand-story"
import { WhyChooseSection } from "@/components/why-choose-section"
import { PoliciesSection } from "@/components/policies-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { FloatingDecorations } from "@/components/floating-decorations"
import { BackToTop } from "@/components/back-to-top"
import { LoadingScreen } from "@/components/loading-screen"
import { WhatsAppChat } from "@/components/whatsapp-chat"

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <main className="relative min-h-screen overflow-hidden">
        <FloatingDecorations />
        <Header />
        <HeroSectionPremium />
        <TrustBadges />
        <AboutSection />
        <ProductsSection />
        <BrandStory />
        <WhyChooseSection />
        <PoliciesSection />
        <FAQSection />
        <Footer />
        <BackToTop />
        {/* WhatsApp Chat */}
        <WhatsAppChat />
      </main>
    </>
  )
}
