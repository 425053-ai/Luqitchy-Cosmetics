import { Palette, Shield, Sparkles, Crown, Leaf, Truck, Package, Heart } from "lucide-react"

const reasons = [
  {
    icon: Crown,
    title: "Premium Quality",
    description: "Luxurious formulations using the finest ingredients for lip glosses, lip balm, and body care products.",
    emoji: "👑",
    gradient: "from-amber-500 to-orange-500",
    animation: "animate-float-rotate",
  },
  {
    icon: Palette,
    title: "8 Unique Products",
    description: "5 lip gloss shades, 1 nourishing lip balm, and 2 body lotion bundles - a complete beauty collection.",
    emoji: "🎨",
    gradient: "from-purple-500 to-pink-500",
    animation: "animate-dance",
  },
  {
    icon: Leaf,
    title: "Natural & Cruelty-Free",
    description: "100% cruelty-free products with natural ingredients. Beauty without compromise.",
    emoji: "🌿",
    gradient: "from-green-500 to-emerald-500",
    animation: "animate-swing",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick 24-48 hour delivery across Egypt. Your beauty essentials arrive when you need them.",
    emoji: "🚚",
    gradient: "from-blue-500 to-cyan-500",
    animation: "animate-wiggle",
  },
]

export function WhyChooseSection() {
  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-36 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden" aria-labelledby="why-choose-heading">
      {/* Background Elements - hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hidden sm:block absolute top-32 left-8 text-3xl animate-sparkle opacity-20">✨</div>
        <div className="hidden sm:block absolute bottom-24 right-12 text-2xl animate-heartbeat opacity-20">💖</div>
        <div className="hidden md:block absolute top-1/4 right-1/4 w-64 lg:w-96 h-64 lg:h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="animate-slide-in-left opacity-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-card/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-primary/30 mb-6 sm:mb-8 shadow-lg shadow-primary/10">
              <span className="animate-heartbeat text-base sm:text-lg">💖</span>
              <span className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">Why Choose Us</span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent animate-sparkle" />
            </div>

            <h2
              id="why-choose-heading"
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8"
            >
              Why Choose <span className="gradient-text">Luqitchy</span>?
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed text-pretty max-w-xl mx-auto lg:mx-0">
              We blend <span className="text-accent font-semibold">premium luxury</span> with playful charm to create
              a complete beauty collection. From our signature lip glosses to nourishing body care, every product is a{" "}
              <span className="text-shimmer font-semibold">celebration of your unique beauty</span>.
            </p>
            
            {/* Product count badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center lg:justify-start">
              {[
                { label: "5 Lip Glosses", emoji: "💄" },
                { label: "1 Lip Balm", emoji: "💋" },
                { label: "2 Body Bundles", emoji: "🧴" },
              ].map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5 sm:gap-2 bg-accent/10 border border-accent/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                  <span>{item.emoji}</span>
                  {item.label}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 sm:gap-6 justify-center lg:justify-start">
              {["✨", "💄", "💋", "🧴", "🎀"].map((emoji, index) => (
                <span
                  key={index}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl hover:scale-125 transition-transform cursor-default"
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

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {reasons.map((reason, index) => (
              <div
                key={reason.title}
                className="relative premium-card p-4 sm:p-5 md:p-7 rounded-2xl sm:rounded-3xl group animate-slide-up opacity-0"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                {/* Gradient glow on hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${reason.gradient} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`} />

                <div className="relative">
                  <div className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br ${reason.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 md:mb-5 group-hover:scale-110 transition-all shadow-lg`}>
                    <reason.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white group-hover:animate-pulse" />
                    <span className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-sm sm:text-base md:text-lg ${reason.animation}`}>{reason.emoji}</span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-accent transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
