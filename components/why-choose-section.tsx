import { Palette, Shield, Sparkles, Crown } from "lucide-react"

const reasons = [
  {
    icon: Crown,
    title: "High-End Quality",
    description: "Premium ingredients and formulations for a luxurious, long-lasting glossy finish.",
    emoji: "👑",
  },
  {
    icon: Palette,
    title: "Curated Shades",
    description: "Expertly designed colors that complement every skin tone and occasion.",
    emoji: "🎨",
  },
  {
    icon: Shield,
    title: "Safe & Gentle",
    description: "Carefully formulated to be gentle on your lips while delivering stunning results.",
    emoji: "🛡️",
  },
  {
    icon: Sparkles,
    title: "Stunning Shine",
    description: "Our signature glossy formula catches the light for that perfect, radiant pout.",
    emoji: "✨",
  },
]

export function WhyChooseSection() {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden" aria-labelledby="why-choose-heading">
      <div className="absolute top-32 left-8 text-3xl animate-sparkle opacity-30">✨</div>
      <div className="absolute bottom-24 right-12 text-2xl animate-heartbeat opacity-30">💖</div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-3 bg-secondary/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-primary/30 mb-8 shadow-lg shadow-primary/10 animate-fade-in-up">
              <span className="animate-heartbeat text-lg">💖</span>
              <span className="text-sm font-semibold text-foreground">Why Choose Us</span>
              <Sparkles className="w-4 h-4 text-accent animate-sparkle" />
            </div>

            <h2
              id="why-choose-heading"
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8"
            >
              Why Choose <span className="gradient-text">Luqitchy</span>?
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed text-pretty">
              We blend <span className="text-accent font-semibold">high-end luxury</span> with playful charm to create
              lip glosses that make you feel confident, beautiful, and utterly fabulous. Every product is a{" "}
              <span className="text-foreground font-semibold">celebration of your unique beauty</span>.
            </p>

            <div className="flex items-center gap-6">
              {["✨", "💄", "💋", "💖", "🎀"].map((emoji, index) => (
                <span
                  key={index}
                  className="text-4xl md:text-5xl hover:scale-125 transition-transform cursor-default"
                  style={{
                    animation: `float 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <div
                key={reason.title}
                className="relative bg-card p-7 rounded-3xl border border-border shadow-lg shadow-primary/10 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-2 group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background accent */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-500" />

                <div className="relative w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all shadow-md">
                  <reason.icon className="w-7 h-7 text-accent" />
                  <span className="absolute -top-1 -right-1 text-sm animate-wiggle">{reason.emoji}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {reason.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
