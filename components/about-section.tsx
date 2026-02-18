import { Heart, Star, Crown, Sparkles, Award, Leaf } from "lucide-react"
import { Emoji } from './ui/emoji'

const features = [
  {
    icon: Crown,
    title: "Premium Quality",
    description: "Every product is crafted with the finest ingredients for a luxurious feel and lasting beauty.",
    emoji: "👑",
    gradient: "from-amber-500 to-orange-500",
    animation: "animate-float-rotate",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Each product is carefully designed to bring joy and confidence to your beauty routine.",
    emoji: "💖",
    gradient: "from-pink-500 to-rose-500",
    animation: "animate-heart-pop",
  },
  {
    icon: Star,
    title: "Unique Shades",
    description: "Our exclusive color palette is designed to complement every skin tone beautifully.",
    emoji: "✨",
    gradient: "from-purple-500 to-pink-500",
    animation: "animate-sparkle-burst",
  },
]

const stats = [
  { value: "8", label: "Products", icon: "💄", animation: "animate-dance" },
  { value: "100%", label: "Never tested on animals.", icon: "🐰", animation: "animate-kawaii-bounce" },
  { value: "24-48h", label: "Delivery", icon: "🚚", animation: "animate-wiggle" },
  { value: "5.0", label: "Rating", icon: "⭐", animation: "animate-star-twirl" },
]

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 md:py-36 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hidden md:block absolute top-16 right-20 text-3xl animate-float-rotate opacity-30">🌷</div>
        <div className="hidden md:block absolute bottom-20 left-16 text-2xl animate-dance opacity-30">🎀</div>
        <div className="hidden lg:block absolute top-1/4 left-5 text-2xl animate-kawaii-bounce opacity-25">💖</div>
        <div className="hidden lg:block absolute bottom-1/3 right-10 text-3xl animate-sparkle-burst opacity-25">✨</div>
        <div className="hidden xl:block absolute top-1/2 right-5 text-2xl animate-heart-pop opacity-20">💕</div>
        <div className="hidden xl:block absolute top-2/3 left-10 text-2xl animate-star-twirl opacity-20">🌟</div>
        <div className="hidden sm:block absolute top-1/3 left-10 w-60 md:w-80 h-60 md:h-80 bg-accent/5 rounded-full blur-2xl md:blur-3xl" />
        <div className="hidden sm:block absolute bottom-1/3 right-10 w-72 md:w-96 h-72 md:h-96 bg-primary/5 rounded-full blur-2xl md:blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-card/80 backdrop-blur-sm px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full border border-primary/30 mb-5 sm:mb-6 md:mb-8 shadow-lg shadow-primary/10 animate-slide-up opacity-0 hover-jelly">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-accent animate-heart-pop" />
              <span className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">Our Story</span>
              <Emoji emoji="✨" className="animate-sparkle-burst text-sm sm:text-base" />
              <Emoji emoji="🎀" className="animate-dance text-sm" />
            </div>

            <h2 
              id="about-heading" 
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-5 sm:mb-6 md:mb-8 animate-slide-up opacity-0 px-2 relative inline-block"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="absolute -top-4 -left-4 text-xl animate-float-rotate">🌸</span>
              About <span className="rainbow-text sparkle-decoration">Luqitchy</span>
              <span className="absolute -top-2 -right-4 text-xl animate-star-twirl">⭐</span>
              <Emoji emoji="💖" className="absolute -bottom-2 right-1/4 text-lg animate-kawaii-bounce" />
            </h2>

            <p 
              className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-7 md:mb-8 leading-relaxed max-w-3xl mx-auto text-pretty animate-slide-up opacity-0 px-2"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="inline-block animate-float mr-1">🦋</span>
              Born from a passion for beauty and self-expression,{" "}
              <span className="text-accent font-semibold">Luqitchy Cosmetics</span> brings you premium beauty products
              that celebrate femininity with a playful twist. We believe every person deserves to feel
              <span className="text-shimmer font-semibold"> glamorous, confident, and utterly beautiful</span>
              <Emoji emoji="✨" className="inline-block animate-sparkle ml-1" />
            </p>

            {/* Stats Row */}
            <div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 animate-slide-up opacity-0 px-2"
              style={{ animationDelay: "0.3s" }}
            >
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="text-center group hover-jelly"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-2 sm:mb-3 rounded-xl sm:rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:border-accent/30 transition-all duration-300 group-hover:-translate-y-1 kawaii-card">
                    <span className={`text-xl sm:text-2xl md:text-3xl ${stat.animation}`} style={{ animationDelay: `${index * 0.2}s` }}>{stat.icon}</span>
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground group-hover:text-accent transition-colors">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="relative premium-card kawaii-card p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl h-full group hover-jelly">
                  {/* Gradient glow on hover */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`} />
                  
                  <div className="relative">
                    {/* Icon container */}
                    <div className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-glow-soft`}>
                      <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white animate-pulse-glow" />
                        <Emoji emoji={feature.emoji} className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-lg sm:text-xl md:text-2xl ${feature.animation}`} />
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 text-center group-hover:text-accent transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center line-clamp-3">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div 
            className="mt-10 sm:mt-12 md:mt-16 text-center animate-slide-up opacity-0 px-2"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-accent/5 border border-accent/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 hover-jelly">
                <Emoji emoji="🌿" className="animate-float" />
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span className="text-xs sm:text-sm font-medium text-center">Never tested on animals. Made with natural ingredients.</span>
                <Emoji emoji="💖" className="animate-heart-pop" />
              <Award className="hidden sm:block w-5 h-5 text-accent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
