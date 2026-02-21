'use client';
import { Header } from "@/components/header"
import { HeroSectionPremium } from "@/components/hero-section-premium"
import { TrustBadges } from "@/components/trust-badges"
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

import { useEffect, useState } from "react";

export default function Home() {
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/review-images");
        const data = await res.json();
        setReviewImages(data.images || []);
      } catch {
        setReviewImages([]);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchImages();
  }, []);

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
        {/* Luqitchy's Girls Reviews Section (reviewImages logic removed, use API route for client) */}
        <section className="py-16 sm:py-20 md:py-28 lg:py-36 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden" aria-labelledby="girls-reviews-heading">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-10">
              <h2 id="girls-reviews-heading" className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">Luqitchy's Girls Reviews</h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Real girls, real reviews! Send your feedback and photo on WhatsApp or Instagram to be featured here 💖</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {loadingReviews ? (
                <div className="col-span-full text-center text-muted-foreground">Loading reviews...</div>
              ) : reviewImages.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground">No reviews yet.</div>
              ) : (
                reviewImages.map((src, i) => (
                  <div
                    key={src}
                    className="relative w-full aspect-[4/5] sm:aspect-[4/5] md:aspect-[4/5] rounded-xl shadow-lg overflow-hidden flex items-center justify-center bg-background border border-accent/20"
                  >
                    <img
                      src={src}
                      alt={`Review ${i + 1}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
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
  );
}

