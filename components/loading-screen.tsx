"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    // Hide loading screen after animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-accent/20 via-primary/10 to-transparent blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-pink-500/20 via-purple-500/10 to-transparent blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </div>

          {/* Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center"
          >
            {/* Animated Logo Circle */}
            <motion.div
              className="relative w-32 h-32 mx-auto mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent/30 animate-glow-soft" />
              <motion.div
                className="absolute inset-2 rounded-full border border-primary/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
                <span className="text-4xl animate-kawaii-bounce">💄</span>
              </div>
              <span className="absolute -top-2 -right-2 text-xl animate-sparkle-burst">✨</span>
              <span className="absolute -bottom-2 -left-2 text-lg animate-heart-pop">💖</span>
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              className="font-serif text-4xl md:text-5xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="rainbow-text sparkle-decoration">
                Luqitchy
              </span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground font-medium tracking-[0.3em] uppercase text-sm flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <span className="animate-sparkle">✨</span>
              Cosmetics
              <span className="animate-heart-pop">💖</span>
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              className="mt-10 w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-accent via-pink-500 to-accent rounded-full animate-candy-shine"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>

            {/* Loading Text */}
            <motion.p
              className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="animate-dance">🌸</span>
              Loading beauty...
              <span className="animate-sparkle">✨</span>
            </motion.p>
          </motion.div>

          {/* Floating Elements */}
          <motion.span
            className="absolute top-1/4 left-1/4 text-3xl"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute bottom-1/3 right-1/4 text-3xl"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -10, 0],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            💋
          </motion.span>
          <motion.span
            className="absolute top-1/3 right-1/3 text-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            💖
          </motion.span>
          <motion.span
            className="absolute top-1/2 left-1/3 text-2xl"
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              rotate: [0, 360],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            🌟
          </motion.span>
          <motion.span
            className="absolute bottom-1/4 left-1/3 text-2xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 15, -15, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          >
            🎀
          </motion.span>
          <motion.span
            className="absolute top-2/3 right-1/3 text-xl"
            animate={{
              y: [0, 15, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            🦋
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
