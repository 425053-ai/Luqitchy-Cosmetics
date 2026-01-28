"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const badges = [
  {
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 md:w-16 md:h-16">
        <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/30" />
        <path d="M32 12c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 36c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z" fill="currentColor" className="text-accent" />
        <path d="M32 20c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm0 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="currentColor" className="text-accent/70" />
        <circle cx="32" cy="32" r="4" fill="currentColor" className="text-accent" />
        <path d="M44 24l4-4M20 24l-4-4M44 40l4 4M20 40l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent/50" />
      </svg>
    ),
    title: "Dermatologically Tested",
    description: "Clinically proven safe for all skin types",
    stat: "100%"
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 md:w-16 md:h-16">
        <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8z" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/30" />
        <path d="M32 16c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16z" fill="currentColor" className="text-pink-200" />
        <ellipse cx="26" cy="28" rx="3" ry="4" fill="currentColor" className="text-accent" />
        <ellipse cx="38" cy="28" rx="3" ry="4" fill="currentColor" className="text-accent" />
        <path d="M24 38c0 0 4 6 8 6s8-6 8-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent" />
        <circle cx="20" cy="32" r="3" fill="currentColor" className="text-pink-300" />
        <circle cx="44" cy="32" r="3" fill="currentColor" className="text-pink-300" />
        <path d="M28 12l-2-4M36 12l2-4M32 10V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent/50" />
      </svg>
    ),
    title: "Cruelty Free",
    description: "Never tested on animals. Ever.",
    stat: "0%"
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 md:w-16 md:h-16">
        <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/30" />
        <path d="M32 10c-2 0-4 8-4 14 0 4 2 8 4 10 2-2 4-6 4-10 0-6-2-14-4-14z" fill="currentColor" className="text-green-500" />
        <path d="M22 18c-1.5 1.5 4 10 8 14 3-1 6-4 7-7-2-4-10-10-15-7z" fill="currentColor" className="text-green-400" />
        <path d="M42 18c1.5 1.5-4 10-8 14-3-1-6-4-7-7 2-4 10-10 15-7z" fill="currentColor" className="text-green-400" />
        <path d="M18 30c-1 2 6 8 12 10 2-2 3-6 2-9-3-3-11-4-14-1z" fill="currentColor" className="text-green-500" />
        <path d="M46 30c1 2-6 8-12 10-2-2-3-6-2-9 3-3 11-4 14-1z" fill="currentColor" className="text-green-500" />
        <path d="M24 42c0 2 6 6 8 8 2-2 8-6 8-8-2-2-6-4-8-4s-6 2-8 4z" fill="currentColor" className="text-green-600" />
        <circle cx="32" cy="36" r="4" fill="currentColor" className="text-yellow-400" />
      </svg>
    ),
    title: "Vegan Formula",
    description: "Plant-based ingredients only",
    stat: "100%"
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 md:w-16 md:h-16">
        <rect x="12" y="20" width="40" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/30" />
        <path d="M20 20V16a12 12 0 0 1 24 0v4" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent" />
        <circle cx="32" cy="36" r="6" fill="currentColor" className="text-accent" />
        <path d="M32 38v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-accent-foreground" />
        <rect x="16" y="24" width="32" height="24" rx="2" fill="currentColor" className="text-accent/20" />
      </svg>
    ),
    title: "Secure & Safe",
    description: "Your data is always protected",
    stat: "256-bit"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

export function TrustBadges() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.span
            className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Why Trust Us
          </motion.span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Clean Beauty.{" "}
            <span className="bg-gradient-to-r from-accent via-pink-500 to-accent bg-clip-text text-transparent">
              Real Results.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every product is crafted with love, tested rigorously, and made with ingredients you can trust.
          </p>
        </motion.div>

        {/* Trust Badges Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="group relative"
            >
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-6 md:p-8 text-center h-full transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <motion.div
                  className="relative z-10 flex justify-center mb-4 text-accent"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {badge.icon}
                </motion.div>

                {/* Stat Badge */}
                <div className="absolute top-4 right-4 bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded-full">
                  {badge.stat}
                </div>

                {/* Content */}
                <h3 className="relative z-10 font-serif text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {badge.title}
                </h3>
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">
                  {badge.description}
                </p>

                {/* Bottom Accent Line */}
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "60%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Trust Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-card/50 backdrop-blur-sm px-8 py-4 rounded-full border border-border/50">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-pink-500 border-2 border-background flex items-center justify-center text-xs text-white font-bold"
                >
                  {i === 5 ? "+" : "★"}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="font-bold text-foreground">10,000+ Happy Customers</div>
              <div className="text-xs text-muted-foreground">Trusted across Egypt</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
