import { CreditCard, ShieldCheck, Sparkles, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const policies = [
  {
    icon: CreditCard,
    title: "Deposit Required",
    description:
      "A deposit is required to confirm your order. This ensures we can provide you with the best service and product availability.",
    highlight: "Deposit is a must",
    emoji: "💳",
  },
  {
    icon: ShieldCheck,
    title: "Final Sale Policy",
    description:
      "All sales are final. We carefully craft each product, so please review your order carefully before confirming.",
    highlight: "No refund or exchange",
    emoji: "🛡️",
  },
  {
    icon: Heart,
    title: "Quality Guarantee",
    description:
      "While we don't offer refunds, we stand behind our product quality. Contact us if you receive a damaged item.",
    highlight: "High-end quality products",
    emoji: "💖",
  },
]

export function PoliciesSection() {
  return (
    <section
      id="policies"
      className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden"
      aria-labelledby="policies-heading"
    >
      <div className="absolute top-24 left-16 text-3xl animate-swing opacity-30">🎀</div>
      <div className="absolute bottom-20 right-20 text-2xl animate-sparkle opacity-30">✨</div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-card/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-primary/30 mb-8 shadow-lg shadow-primary/10 animate-fade-in-up">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">Our Policies</span>
            <Sparkles className="w-4 h-4 text-accent animate-sparkle" />
          </div>

          <h2
            id="policies-heading"
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            Shopping <span className="gradient-text">Policies</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Please review our policies before making a purchase to ensure a{" "}
            <span className="text-accent font-semibold">smooth shopping experience</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {policies.map((policy, index) => (
            <Card
              key={policy.title}
              className="relative bg-card border-border rounded-3xl shadow-lg shadow-primary/10 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-2 group overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background glow */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl group-hover:bg-accent/15 transition-colors duration-500" />

              <CardHeader className="text-center pb-3 relative">
                <div className="relative w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all shadow-lg">
                  <policy.icon className="w-8 h-8 text-accent" />
                  <span className="absolute -top-2 -right-2 text-lg animate-bounce-rotate">{policy.emoji}</span>
                </div>
                <CardTitle className="font-serif text-xl text-foreground group-hover:text-accent transition-colors">
                  {policy.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6 leading-relaxed">{policy.description}</p>
                <div className="inline-flex items-center gap-2 bg-accent/15 text-accent font-semibold px-5 py-2.5 rounded-full text-sm border border-accent/20 shadow-sm group-hover:bg-accent/25 transition-colors">
                  <Sparkles className="w-4 h-4" />
                  {policy.highlight}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
