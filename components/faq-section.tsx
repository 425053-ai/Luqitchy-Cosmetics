"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Sparkles, MessageCircle, ChevronDown } from "lucide-react"
import Link from "next/link"
import { FloatingHearts } from "@/components/confetti-effect"
import { FloatingEmojis } from "@/components/kawaii-elements"

const faqs = [
  {
    question: "What products do you offer?",
    answer:
      "We offer a complete beauty collection: 5 stunning Lip Gloss shades (Black Honey, Burgundy, Wine, Mocha, and Strawberry Milk), a nourishing Lip Balm, and 2 luxurious Body Lotion + Splash Bundles (Mulberry and Sugar Drop). Each product is carefully crafted with premium ingredients.",
    emoji: "💄",
  },
  {
    question: "What are the Lip Gloss shades?",
    answer:
      "Our Lip Gloss collection features 5 beautiful shades: Black Honey (warm honey-brown with golden shimmer), Burgundy (deep berry red with cherry undertones), Wine (elegant wine-inspired red), Mocha (creamy coffee-inspired nude), and Strawberry Milk (sweet playful pink). Each shade complements various skin tones.",
    emoji: "🎨",
  },
  {
    question: "What's included in the Body Lotion Bundles?",
    answer:
      "Each Body Lotion + Splash Bundle includes a luxurious hydrating body lotion and a refreshing fragrant body splash. Available in Mulberry (wild berry scent) and Sugar Drop (sweet candy-like fragrance). Perfect as a gift or for your daily skincare routine!",
    emoji: "🧴",
  },
  {
    question: "How long do the products last?",
    answer:
      "Our Lip Gloss provides long-lasting wear of 4-6 hours. The Lip Balm offers all-day moisture protection. Body Lotion fragrance lasts 6-8 hours, while the Splash provides an instant refreshing burst that lingers beautifully.",
    emoji: "⏰",
  },
  {
    question: "What are the prices?",
    answer:
      "Lip Gloss shades are 100 EGP each, Lip Balm is 100 EGP, and Body Lotion + Splash Bundles are 300 EGP each. We offer premium quality at affordable prices!",
    emoji: "💰",
  },
  {
    question: "Is a deposit required for orders?",
    answer:
      "Yes, a deposit is required to confirm your order. This helps us manage inventory and ensure timely delivery of your products within 24-48 hours.",
    emoji: "💳",
  },
  {
    question: "What is your refund policy?",
    answer:
      "All sales are final with no refunds or exchanges. We encourage you to review product details carefully before ordering. If you receive a damaged item, please contact us immediately and we'll resolve the issue.",
    emoji: "📋",
  },
  {
    question: "Are the products cruelty-free?",
    answer:
      "Absolutely! All Luqitchy products are 100% cruelty-free. We never test on animals and use only ethically sourced, natural ingredients. Beauty should never come at the cost of our furry friends!",
    emoji: "🐰",
  },
  {
    question: "How do I store my products?",
    answer:
      "Store all products in a cool, dry place away from direct sunlight. Close caps tightly after use to maintain freshness and quality. Our products have a shelf life of 12-24 months when stored properly.",
    emoji: "💖",
  },
]

export function FAQSection() {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined)
  const [showHearts, setShowHearts] = useState(false)
  const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 })

  const handleAccordionChange = (value: string) => {
    setOpenItem(value)
    // Show floating hearts on open
    if (value) {
      setShowHearts(true)
      setTimeout(() => setShowHearts(false), 1500)
    }
  }

  return (
    <section id="faq" className="py-16 sm:py-20 md:py-28 lg:py-36 bg-gradient-to-b from-secondary/30 via-background to-secondary/20 relative overflow-hidden" aria-labelledby="faq-heading">
      {/* Floating Hearts Animation */}
      {showHearts && <FloatingHearts isActive={showHearts} />}
      
      {/* Floating Emojis Background */}
      <FloatingEmojis emojis={["❓", "💭", "✨", "💖", "🌸"]} count={6} />

      {/* Background Elements - hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hidden sm:block absolute top-16 right-20 text-3xl animate-float opacity-30">💭</div>
        <div className="hidden sm:block absolute bottom-24 left-16 text-2xl animate-float opacity-30" style={{ animationDelay: '1s' }}>🎀</div>
        <div className="hidden md:block absolute top-1/4 left-10 text-2xl animate-float opacity-25" style={{ animationDelay: '0.5s' }}>❓</div>
        <div className="hidden lg:block absolute bottom-1/4 right-16 text-3xl animate-pulse opacity-25">✨</div>
        <div className="hidden lg:block absolute top-2/3 left-20 text-2xl animate-float opacity-20" style={{ animationDelay: '1.5s' }}>💖</div>
        <div className="hidden xl:block absolute top-1/3 right-1/4 text-2xl animate-pulse opacity-20">🌟</div>
        <div className="hidden md:block absolute top-1/3 right-10 w-64 lg:w-80 h-64 lg:h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="hidden md:block absolute bottom-1/3 left-10 w-72 lg:w-96 h-72 lg:h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-card/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-primary/30 mb-6 sm:mb-8 shadow-lg shadow-primary/10 hover:scale-105 transition-transform duration-300 cursor-default">
            <span className="animate-bounce">❓</span>
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
            <span className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">Have Questions?</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent animate-pulse" />
            <span className="animate-pulse">💖</span>
          </div>

          <h2 id="faq-heading" className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 relative inline-block">
            <span className="absolute -top-4 -left-4 text-xl animate-float">✨</span>
            Frequently Asked <span className="rainbow-shimmer">Questions</span>
            <span className="absolute -top-2 -right-4 text-xl animate-pulse">🌟</span>
            <span className="absolute -bottom-2 right-1/4 text-lg animate-bounce">💬</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            <span className="inline-block animate-float mr-1">🌸</span>
            Everything you need to know about our products and services
            <span className="inline-block animate-sparkle ml-1">✨</span>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion 
            type="single" 
            collapsible 
            className="space-y-3 sm:space-y-4"
            value={openItem}
            onValueChange={handleAccordionChange}
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="group bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl px-4 sm:px-6 border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg data-[state=open]:text-accent transition-all duration-300 hover:no-underline">
                  <span className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center text-base sm:text-lg md:text-xl flex-shrink-0 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300 group-data-[state=open]:bg-accent/30 group-data-[state=open]:scale-110">
                      {faq.emoji}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{faq.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 sm:pb-5 md:pb-6 leading-relaxed text-xs sm:text-sm md:text-base pl-10 sm:pl-12 md:pl-14">
                  <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                    {faq.answer}
                    <span className="inline-block ml-2 animate-pulse">✨</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        {/* Contact CTA */}
        <div className="mt-10 sm:mt-12 md:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:scale-105 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 animate-glow-soft">
                <MessageCircle className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm sm:text-base flex items-center gap-1">
                  Still have questions?
                  <span className="animate-sparkle">✨</span>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                  We're here to help you
                  <span className="animate-heart-pop">💖</span>
                </p>
              </div>
            </div>
            <Link href="https://wa.me/201012622315" target="_blank" className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all inline-flex items-center gap-2 text-sm sm:text-base btn-kawaii">
              <span className="animate-wiggle">💬</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
              <span className="animate-sparkle">✨</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
