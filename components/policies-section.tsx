import { CreditCard, ShieldCheck, Sparkles, Heart, Truck, Package, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const policies = [
  {
    icon: CreditCard,
    title: "Deposit Required",
    description:
      "A deposit is required to confirm your order. This ensures we can manage inventory and provide timely delivery of your products.",
    highlight: "Secure your order",
    emoji: "💳",
    gradient: "from-blue-500 to-cyan-500",
    animation: "animate-wiggle",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Orders are delivered within 24-48 hours across Egypt. We ensure your products arrive safely and on time.",
    highlight: "24-48h delivery",
    emoji: "🚚",
    gradient: "from-green-500 to-emerald-500",
    animation: "animate-dance",
  },
  {
    icon: ShieldCheck,
    title: "Final Sale Policy",
    description:
      "All sales are final with no refunds or exchanges. Please review product details carefully before ordering.",
    highlight: "No refund or exchange",
    emoji: "🛡️",
    gradient: "from-amber-500 to-orange-500",
    animation: "animate-float-rotate",
  },
  {
    icon: Heart,
    title: "Quality Guarantee",
    description:
      "We stand behind our premium quality. If you receive a damaged item, contact us immediately and we'll resolve it.",
    highlight: "Premium quality assured",
    emoji: "💖",
    gradient: "from-pink-500 to-rose-500",
    animation: "animate-heart-pop",
  },
]

export function PoliciesSection() {
  return (
    <section
      id="policies"
      className="py-24 md:py-36 bg-gradient-to-b from-secondary/30 via-background to-secondary/20 relative overflow-hidden"
      aria-labelledby="policies-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hidden md:block absolute top-24 left-16 text-3xl animate-swing opacity-20">🎀</div>
        <div className="hidden md:block absolute bottom-20 right-20 text-2xl animate-sparkle opacity-20">✨</div>
        <div className="hidden sm:block absolute top-1/3 left-10 w-60 md:w-80 h-60 md:h-80 bg-accent/5 rounded-full blur-2xl md:blur-3xl" />
        <div className="hidden sm:block absolute bottom-1/4 right-10 w-72 md:w-96 h-72 md:h-96 bg-primary/5 rounded-full blur-2xl md:blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-card/80 backdrop-blur-sm px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full border border-primary/30 mb-5 sm:mb-6 md:mb-8 shadow-lg shadow-primary/10 animate-slide-up opacity-0">
            <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
            <span className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">Our Policies</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent animate-sparkle" />
          </div>

          <h2
            id="policies-heading"
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6 animate-slide-up opacity-0 px-2"
            style={{ animationDelay: "0.1s" }}
          >
            Shopping <span className="gradient-text">Policies</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty animate-slide-up opacity-0 px-2" style={{ animationDelay: "0.2s" }}>
            Please review our policies before making a purchase to ensure a{" "}
            <span className="text-accent font-semibold">smooth shopping experience</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto px-2">
          {policies.map((policy, index) => (
            <Card
              key={policy.title}
              className="relative premium-card border-none rounded-2xl sm:rounded-3xl group overflow-hidden animate-slide-up opacity-0"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              {/* Gradient glow on hover */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${policy.gradient} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`} />

              <div className="relative">
                <CardHeader className="text-center pb-2 sm:pb-3">
                  <div className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br ${policy.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-5 group-hover:scale-110 transition-all shadow-lg`}>
                    <policy.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white group-hover:animate-pulse" />
                    <span className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-sm sm:text-base md:text-lg ${policy.animation}`}>{policy.emoji}</span>
                  </div>
                  <CardTitle className="font-serif text-base sm:text-lg text-foreground group-hover:text-accent transition-colors">
                    {policy.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-3 sm:px-4 md:px-6 px-3 sm:px-4 md:px-6">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 md:mb-5 leading-relaxed line-clamp-4">{policy.description}</p>
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-accent/10 text-accent font-semibold px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs border border-accent/20 shadow-sm group-hover:bg-accent/20 transition-colors">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {policy.highlight}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info Banner */}
        <div className="mt-10 sm:mt-12 md:mt-16 max-w-4xl mx-auto animate-slide-up opacity-0 px-2" style={{ animationDelay: "0.7s" }}>
          <div className="premium-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 md:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
              {/* Help, delivery, and quality info removed as requested */}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
