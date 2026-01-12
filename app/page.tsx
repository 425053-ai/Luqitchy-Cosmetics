"use client"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProductsSection } from "@/components/products-section"
import { WhyChooseSection } from "@/components/why-choose-section"
import { PoliciesSection } from "@/components/policies-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { FloatingDecorations } from "@/components/floating-decorations"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingDecorations />
      <Header />
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <WhyChooseSection />
      <PoliciesSection />
      <FAQSection />
      <Footer />
    </main>
  )
}
