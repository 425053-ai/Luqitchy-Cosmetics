"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

export function BrandStory() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section 
      ref={containerRef}
      className="py-24 md:py-40 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden"
    >
      {/* Parallax Background Elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y }}
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Story Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-8"
            >
              <span className="text-accent text-sm font-medium tracking-widest uppercase">Our Story</span>
              <span className="animate-pulse">💖</span>
            </motion.div>

            {/* Heading */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
              Beauty That{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-accent via-pink-500 to-accent bg-clip-text text-transparent">
                  Empowers
                </span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.path
                    d="M0 4C50 4 50 7 100 7C150 7 150 1 200 1"
                    stroke="url(#story-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="story-gradient" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#ec4899" />
                      <stop offset="0.5" stopColor="#d946ef" />
                      <stop offset="1" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
            </h2>

            {/* Story Paragraphs */}
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-foreground font-semibold">Luqitchy was born from a simple belief:</span> every person deserves to feel beautiful, confident, and radiant — without compromising on quality or ethics.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                We craft each product with <span className="text-accent font-semibold">passion and precision</span>, using only the finest ingredients that nourish your skin while delivering stunning, long-lasting color.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                From our signature lip glosses to our luxurious body care line, every Luqitchy product is a celebration of <span className="text-accent font-semibold">self-expression and self-love</span>.
              </motion.p>
            </div>

            {/* Founder Signature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-10 pt-8 border-t border-border/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-accent/30 shadow-lg">
                  <Image
                    src="/images/logo.jpeg"
                    alt="Luqitchy Logo"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <div className="font-serif text-lg font-bold text-foreground">Luqitchy Team</div>
                  <div className="text-sm text-muted-foreground">Founder & Creative Director</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative">
              {/* Decorative Frame */}
              <motion.div
                className="absolute -inset-4 md:-inset-8 border-2 border-accent/20 rounded-3xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              />
              
              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/images/black-honey.jpeg"
                    alt="Luqitchy Black Honey"
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                <motion.div
                  className="relative h-64 md:h-80 rounded-2xl overflow-hidden mt-8 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/images/strawberry-milk.jpeg"
                    alt="Luqitchy Strawberry Milk"
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                <motion.div
                  className="relative h-64 md:h-80 rounded-2xl overflow-hidden -mt-8 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/images/burgundy.jpeg"
                    alt="Luqitchy Burgundy"
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                <motion.div
                  className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/images/mocha.jpeg"
                    alt="Luqitchy Mocha"
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              </div>
            </div>

            {/* Floating Emojis */}
            <motion.span
              className="absolute -top-4 -left-4 text-4xl"
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ✨
            </motion.span>
            <motion.span
              className="absolute -bottom-4 -right-4 text-4xl"
              animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              💖
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
