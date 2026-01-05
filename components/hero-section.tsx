"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative pt-28 md:pt-36 pb-20 md:pb-32 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-primary/30 mb-8 shadow-lg shadow-primary/10 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-accent animate-sparkle" />
              <span className="text-sm font-medium text-foreground">Premium Cosmetics</span>
              <span className="animate-heartbeat">💖</span>
            </div>

            <h1
              id="hero-heading"
              className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="gradient-text">Luqitchy</span>
              <br />
              <span className="text-primary relative inline-block">
                Cosmetics
                <span className="absolute -top-2 -right-6 text-2xl animate-sparkle">✨</span>
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed text-balance animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="font-semibold text-foreground">Highlight Your Beauty</span> With Our Touches. Experience
              high-end quality cosmetics that make every moment shine.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="#products">
                <Button
                  size="lg"
                  className="relative bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-10 py-6 shadow-xl shadow-accent/40 text-lg font-semibold hover:scale-105 transition-all duration-300 group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Sparkles className="w-5 h-5 mr-2 animate-sparkle" />
                  Shop Now
                </Button>
              </Link>
              <Link href="#products">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 py-6 border-2 border-primary hover:bg-primary/10 text-foreground text-lg font-semibold bg-transparent hover:scale-105 transition-all duration-300 group"
                >
                  <Heart className="w-5 h-5 mr-2 group-hover:animate-heartbeat text-accent" />
                  Explore Products
                </Button>
              </Link>
            </div>

            <div
              className="flex items-center gap-8 mt-12 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              {[
                { value: "5+", label: "Unique Products", icon: "💄" },
                { value: "100%", label: "High Quality", icon: "✨" },
                { value: "💖", label: "Made with Love", isEmoji: true },
              ].map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="text-2xl md:text-3xl font-bold text-accent group-hover:scale-110 transition-transform">
                    {stat.isEmoji ? <span className="animate-heartbeat inline-block">{stat.value}</span> : stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative w-80 h-80 md:w-[420px] md:h-[420px] mx-auto">
              <div className="absolute inset-0 rounded-full animate-glow-ring" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/40 via-accent/30 to-primary/40 animate-pulse" />
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20" />

              <Image
                src="/images/logo.jpeg"
                alt="Luqitchy Cosmetics - Premium Beauty Brand"
                fill
                className="object-cover rounded-full shadow-2xl shadow-primary/50 ring-4 ring-primary/20"
                priority
              />

              <span className="absolute -top-6 -right-2 text-4xl md:text-5xl animate-float drop-shadow-lg">💄</span>
              <span className="absolute -bottom-4 -left-6 text-3xl md:text-4xl animate-bounce-rotate drop-shadow-lg">
                💋
              </span>
              <span className="absolute top-1/4 -right-10 text-2xl md:text-3xl animate-sparkle drop-shadow-lg">✨</span>
              <span className="absolute bottom-1/4 -left-8 text-2xl md:text-3xl animate-heartbeat drop-shadow-lg">
                💖
              </span>
              <span className="absolute top-1/2 -right-6 text-xl md:text-2xl animate-swing drop-shadow-lg">🎀</span>

              <div
                className="absolute -bottom-2 right-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 shadow-lg animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-sm font-semibold text-foreground">Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
            className="text-background"
          />
        </svg>
      </div>
    </section>
  )
}
