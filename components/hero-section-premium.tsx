"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Award, Shield, Truck, ArrowRight } from "lucide-react"
import { SkinTypeQuiz } from "@/components/skin-type-quiz"
import { useRef } from "react"
import { Lipstick3D } from "@/components/animations-3d"

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
}

const textReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
}

export function HeroSectionPremium() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center pt-32 sm:pt-36 md:pt-28 lg:pt-0 pb-12 md:pb-0 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Premium Background */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />
        
        {/* Animated Gradient Orbs - Hidden on mobile for performance */}
        <motion.div
          className="hidden md:block absolute top-0 left-1/4 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] rounded-full bg-gradient-to-br from-accent/30 via-pink-500/20 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="hidden md:block absolute bottom-1/4 right-1/4 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] rounded-full bg-gradient-to-tr from-pink-500/20 via-purple-500/10 to-transparent blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Subtle Grid - Hidden on mobile */}
        <div 
          className="hidden md:block absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(236, 72, 153, 0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ y, opacity }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-20">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left w-full lg:max-w-2xl order-2 lg:order-1">
            {/* Main Heading - Luqitchy Cosmetics */}
            <div className="overflow-hidden mb-4 sm:mb-6">
              <motion.h1
                id="hero-heading"
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1]"
              >
                <motion.span
                  className="block"
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={textReveal}
                >
                  <span className="bg-gradient-to-r from-accent via-pink-500 to-accent bg-[length:200%_100%] animate-shimmer bg-clip-text text-transparent">
                    Luqitchy
                  </span>
                </motion.span>
                <motion.span
                  className="block mt-1 sm:mt-2"
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={textReveal}
                >
                  <span className="text-foreground">
                    Cosmetics
                  </span>
                </motion.span>
              </motion.h1>
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-6 sm:mb-8"
            >
              <span className="font-serif text-base sm:text-xl md:text-2xl text-muted-foreground italic">
                Highlight Your Beauty With Our Touches ✨
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Experience luxury cosmetics crafted with passion.{" "}
              <span className="text-foreground font-medium">Vegan • Cruelty-Free • Premium Quality</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link href="#products">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="relative bg-accent hover:bg-accent/90 text-white rounded-full px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg font-semibold overflow-hidden group w-full sm:w-auto"
                  >
                    {/* Shimmer Effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span>Shop Collection</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <SkinTypeQuiz />
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6 mt-8 sm:mt-12 justify-center lg:justify-start"
            >
              {[
                { icon: Award, label: "Premium", value: "100%" },
                { icon: Shield, label: "Secure", value: "Safe" },
                { icon: Truck, label: "Delivery", value: "Fast" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -5, borderColor: "rgba(236, 72, 153, 0.5)" }}
                  className="flex items-center gap-2 sm:gap-3 bg-card/50 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-border/50 transition-all duration-300"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{item.label}</div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none order-first lg:order-last"
          >
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[450px] xl:h-[450px] mx-auto">
              {/* Animated Rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-dashed border-accent/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border border-primary/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/40 via-pink-500/30 to-accent/40 blur-2xl animate-pulse" />
              
              {/* Inner Circle */}
              <div className="absolute inset-6 sm:inset-8 rounded-full bg-gradient-to-br from-accent/20 to-pink-500/20 backdrop-blur-sm" />

              {/* Main Image */}
              <motion.div
                className="absolute inset-8 sm:inset-12 rounded-full overflow-hidden shadow-2xl shadow-accent/30 ring-2 sm:ring-4 ring-white/20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/logo.jpeg"
                  alt="Luqitchy Cosmetics"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Floating Elements - Hidden on mobile for cleaner look */}
              <motion.span
                className="hidden sm:block absolute -top-4 right-4 text-4xl lg:text-5xl drop-shadow-lg"
                variants={floatingVariants}
                animate="animate"
              >
                💄
              </motion.span>
              <motion.span
                className="hidden sm:block absolute -bottom-4 -left-4 text-3xl lg:text-4xl drop-shadow-lg"
                animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                💋
              </motion.span>
              <motion.span
                className="hidden md:block absolute top-1/4 -right-6 lg:-right-8 text-2xl lg:text-3xl drop-shadow-lg"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.span>
              <motion.span
                className="hidden md:block absolute bottom-1/4 -left-4 lg:-left-6 text-2xl lg:text-3xl drop-shadow-lg"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                💖
              </motion.span>
              
              {/* 3D Lipstick Animation - Hidden on small screens */}
              <motion.div 
                className="hidden xl:block absolute -right-16 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <Lipstick3D color="#c44569" size="medium" />
              </motion.div>
              <motion.div 
                className="hidden xl:block absolute -left-20 top-1/3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <Lipstick3D color="#8b4513" size="small" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-accent/50 rounded-full flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-3 bg-accent rounded-full"
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

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
