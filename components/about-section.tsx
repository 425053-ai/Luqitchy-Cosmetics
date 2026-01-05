import { Heart, Star, Crown } from "lucide-react"

const features = [
  {
    icon: Crown,
    title: "Premium Quality",
    description: "Every product is crafted with the finest ingredients for a luxurious feel and lasting beauty.",
    emoji: "👑",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Each product is carefully designed to bring joy and confidence to your beauty routine.",
    emoji: "💖",
  },
  {
    icon: Star,
    title: "Unique Shades",
    description: "Our exclusive color palette is designed to complement every skin tone beautifully.",
    emoji: "✨",
  },
]

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 md:py-32 bg-background relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div className="absolute top-16 right-20 text-3xl animate-float opacity-30">🌷</div>
      <div className="absolute bottom-20 left-16 text-2xl animate-swing opacity-30">🎀</div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-secondary/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-primary/30 mb-8 shadow-lg shadow-primary/10 animate-fade-in-up">
            <Heart className="w-4 h-4 text-accent animate-heartbeat" />
            <span className="text-sm font-semibold text-foreground">Our Story</span>
            <span className="animate-sparkle">✨</span>
          </div>

          <h2 id="about-heading" className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8">
            About <span className="gradient-text">Luqitchy</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-16 leading-relaxed max-w-3xl mx-auto text-pretty">
            Born from a passion for beauty and self-expression,{" "}
            <span className="text-accent font-semibold">Luqitchy Cosmetics</span> brings you premium beauty products
            that celebrate femininity with a playful twist. We believe every person deserves to feel
            <span className="text-foreground font-semibold"> glamorous, confident, and utterly adorable</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="relative bg-card p-8 rounded-3xl border border-border shadow-lg shadow-primary/10 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-2 group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-500" />

                <div className="relative w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
                  <feature.icon className="w-9 h-9 text-accent" />
                  <span className="absolute -top-2 -right-2 text-xl animate-bounce-rotate">{feature.emoji}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
