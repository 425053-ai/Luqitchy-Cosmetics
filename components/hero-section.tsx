"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart, Star, Award, Shield, Truck } from "lucide-react"
import { SkinTypeQuiz } from "@/components/skin-type-quiz"

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative pt-28 md:pt-36 pb-20 md:pb-32 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />
        
        {/* Animated gradient orbs - hidden on mobile for performance */}
        <div className="hidden md:block absolute top-0 left-1/4 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-3xl animate-morph" />
        <div
          className="hidden md:block absolute bottom-1/4 right-1/4 w-[250px] lg:w-[400px] h-[250px] lg:h-[400px] rounded-full bg-gradient-to-tr from-accent/20 via-primary/10 to-transparent blur-3xl animate-morph"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] rounded-full bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-pink-500/5 blur-3xl animate-rotate-slow"
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(236, 72, 153, 0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-primary/30 mb-8 shadow-lg shadow-primary/10 animate-slide-up opacity-0 hover-jelly" style={{ animationDelay: "0.1s" }}>
              <div className="relative">
                <Sparkles className="w-4 h-4 text-accent animate-sparkle" />
                <div className="absolute inset-0 animate-pulse-ring">
                  <Sparkles className="w-4 h-4 text-accent opacity-50" />
                </div>
              </div>
              <span className="text-sm font-medium text-foreground">Premium Beauty Collection</span>
              <span className="animate-heart-pop">💖</span>
              <span className="animate-sparkle-burst">✨</span>
            </div>

            {/* Main Heading with enhanced animation */}
            <h1
              id="hero-heading"
              className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight animate-slide-up opacity-0"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="gradient-text relative inline-block sparkle-decoration">
                Luqitchy
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 4C50 4 50 7 100 7C150 7 150 1 200 1" stroke="url(#underline-gradient)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#ec4899" />
                      <stop offset="0.5" stopColor="#d4a574" />
                      <stop offset="1" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              <span className="text-primary relative inline-block mt-2">
                Cosmetics
                <span className="absolute -top-2 -right-8 text-2xl animate-sparkle-burst">✨</span>
                <span className="absolute -bottom-1 -left-4 text-xl animate-float-rotate" style={{ animationDelay: "0.5s" }}>💫</span>
                <span className="absolute -top-4 -left-2 text-lg animate-star-twirl" style={{ animationDelay: "0.8s" }}>⭐</span>
                <span className="absolute -bottom-3 -right-6 text-lg animate-heart-pop" style={{ animationDelay: "1s" }}>💕</span>
              </span>
            </h1>

            {/* Subheading */}
            <p
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed text-balance animate-slide-up opacity-0"
              style={{ animationDelay: "0.3s" }}
            >
              <span className="font-semibold text-foreground">Elevate Your Beauty</span> with our premium collection. 
              <span className="inline-block animate-float mx-1">🌸</span>
              Experience luxury cosmetics crafted with passion, designed to make every moment
              <span className="text-shimmer font-semibold"> absolutely radiant</span>
              <span className="inline-block animate-sparkle ml-1">✨</span>
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up opacity-0"
              style={{ animationDelay: "0.4s" }}
            >
              <Link href="#products">
                <Button
                  size="lg"
                  className="luxury-btn btn-kawaii relative bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-10 py-6 text-lg font-semibold transition-all duration-300 group animate-glow-soft"
                >
                  <span className="animate-sparkle mr-2">✨</span>
                  <Sparkles className="w-5 h-5 mr-2 animate-sparkle" />
                  Shop Collection
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  <span className="animate-heart-pop ml-1">💖</span>
                </Button>
              </Link>
              <SkinTypeQuiz />
            </div>

            {/* Trust Badges removed as per request */}
          </div>

          {/* Hero Image Section */}
          <div className="flex-1 relative animate-slide-in-right opacity-0 w-full max-w-md lg:max-w-none" style={{ animationDelay: "0.3s" }}>
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px] mx-auto">
              {/* Multiple animated rings */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent/20 animate-rotate-slow" />
              <div className="absolute inset-4 rounded-full border border-primary/20 animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />
              
              {/* Glowing background */}
              <div className="absolute inset-0 rounded-full animate-glow-pulse" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/40 via-accent/30 to-primary/40 animate-morph" />
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm" />

              {/* Main Image */}
              <div className="absolute inset-8 rounded-full overflow-hidden shadow-2xl shadow-primary/50 ring-4 ring-white/20">
                <Image
                  src="/images/logo.jpeg"
                  alt="Luqitchy Cosmetics - Premium Beauty Brand"
                  fill
                  className="object-cover animate-float-3d rounded-full"
                  priority
                />
              </div>

              {/* Floating Elements - smaller and closer on mobile */}
              <span className="absolute -top-2 right-0 sm:-top-4 sm:-right-2 md:-top-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl animate-kawaii-bounce drop-shadow-lg">💄</span>
              <span className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 md:-left-6 text-2xl sm:text-3xl md:text-4xl animate-bounce-rotate drop-shadow-lg">💋</span>
              <span className="hidden sm:block absolute top-1/4 -right-4 md:-right-8 lg:-right-10 text-xl md:text-2xl lg:text-3xl animate-sparkle-burst drop-shadow-lg">✨</span>
              <span className="hidden sm:block absolute bottom-1/4 -left-4 md:-left-6 lg:-left-8 text-xl md:text-2xl lg:text-3xl animate-heart-pop drop-shadow-lg">💖</span>
              <span className="hidden md:block absolute top-1/2 -right-4 lg:-right-6 text-lg lg:text-xl xl:text-2xl animate-dance drop-shadow-lg">🎀</span>
              <span className="hidden lg:block absolute top-10 left-0 text-xl animate-star-twirl drop-shadow-lg" style={{ animationDelay: "1s" }}>⭐</span>
              <span className="hidden md:block absolute -bottom-6 right-1/4 text-xl animate-float-rotate drop-shadow-lg">🌸</span>
              <span className="hidden lg:block absolute top-1/3 -left-8 text-lg animate-glitter drop-shadow-lg">🦋</span>
              <span className="hidden xl:block absolute bottom-10 -right-8 text-xl animate-wiggle drop-shadow-lg">🍭</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
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
