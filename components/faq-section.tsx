import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Sparkles } from "lucide-react"

const faqs = [
  {
    question: "What shades are available?",
    answer:
      "We offer 5 stunning shades: Black Honey, Burgundy, Wine, Mocha, and Strawberry Milk. Each shade is carefully crafted to complement various skin tones.",
    emoji: "💄",
  },
  {
    question: "How long does the gloss last?",
    answer:
      "Our high-quality formula provides long-lasting wear of 4-6 hours depending on activities. For best results, avoid oily foods and reapply as needed.",
    emoji: "⏰",
  },
  {
    question: "Is a deposit required for orders?",
    answer:
      "Yes, a deposit is required to confirm your order. This helps us manage inventory and ensure timely delivery of your products.",
    emoji: "💳",
  },
  {
    question: "What is your refund policy?",
    answer:
      "All sales are final with no refunds or exchanges. We encourage you to review product details carefully before ordering. If you receive a damaged item, please contact us immediately.",
    emoji: "📋",
  },
  {
    question: "How do I care for my lip gloss?",
    answer:
      "Store your lip gloss in a cool, dry place away from direct sunlight. Always close the cap tightly after use to maintain the product's quality and freshness.",
    emoji: "💖",
  },
  {
    question: "Are the products cruelty-free?",
    answer:
      "Yes! Luqitchy Glossy products are cruelty-free. We never test on animals and are committed to ethical beauty practices.",
    emoji: "🐰",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden" aria-labelledby="faq-heading">
      <div className="absolute top-16 right-20 text-3xl animate-float opacity-30">💭</div>
      <div className="absolute bottom-24 left-16 text-2xl animate-wiggle opacity-30">🎀</div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-card/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-primary/30 mb-8 shadow-lg shadow-primary/10 animate-fade-in-up">
            <HelpCircle className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">Have Questions?</span>
            <Sparkles className="w-4 h-4 text-accent animate-sparkle" />
          </div>

          <h2 id="faq-heading" className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-2xl px-6 shadow-md hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 data-[state=open]:shadow-xl data-[state=open]:shadow-accent/10 data-[state=open]:border-primary/30 group"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent py-6 text-lg group-data-[state=open]:text-accent">
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{faq.emoji}</span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
