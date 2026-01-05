"use client"

import { useEffect, useState } from "react"

const decorations = [
  // Top area
  { emoji: "✨", className: "top-16 left-[5%] text-2xl md:text-3xl", animation: "animate-sparkle", delay: "0s" },
  { emoji: "💖", className: "top-24 left-[15%] text-xl md:text-2xl", animation: "animate-heartbeat", delay: "0.3s" },
  { emoji: "💄", className: "top-32 left-[8%] text-lg md:text-xl", animation: "animate-bounce-rotate", delay: "0.6s" },
  { emoji: "🌸", className: "top-20 right-[10%] text-2xl md:text-3xl", animation: "animate-float-slow", delay: "0.2s" },
  { emoji: "💋", className: "top-36 right-[5%] text-xl md:text-2xl", animation: "animate-wiggle", delay: "0.8s" },
  { emoji: "✨", className: "top-28 right-[18%] text-lg md:text-xl", animation: "animate-twinkle", delay: "0.4s" },

  // Middle area
  { emoji: "🎀", className: "top-[35%] left-[3%] text-xl md:text-2xl", animation: "animate-swing", delay: "1s" },
  { emoji: "💕", className: "top-[42%] left-[12%] text-lg md:text-xl", animation: "animate-pulse-glow", delay: "0.5s" },
  { emoji: "✨", className: "top-[38%] right-[8%] text-2xl md:text-3xl", animation: "animate-sparkle", delay: "1.2s" },
  { emoji: "🌷", className: "top-[48%] right-[4%] text-xl md:text-2xl", animation: "animate-float", delay: "0.7s" },

  // Bottom area
  { emoji: "💖", className: "top-[60%] left-[6%] text-lg md:text-xl", animation: "animate-heartbeat", delay: "1.5s" },
  { emoji: "✨", className: "top-[68%] left-[14%] text-xl md:text-2xl", animation: "animate-twinkle", delay: "0.9s" },
  {
    emoji: "💄",
    className: "top-[72%] right-[10%] text-lg md:text-xl",
    animation: "animate-bounce-rotate",
    delay: "1.8s",
  },
  { emoji: "🎀", className: "top-[65%] right-[6%] text-xl md:text-2xl", animation: "animate-swing", delay: "1.1s" },
  { emoji: "💋", className: "top-[80%] left-[8%] text-lg md:text-xl", animation: "animate-wiggle", delay: "2s" },
  {
    emoji: "🌸",
    className: "top-[78%] right-[12%] text-xl md:text-2xl",
    animation: "animate-float-slow",
    delay: "1.4s",
  },
]

export function FloatingDecorations() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {decorations.map((dec, index) => (
        <span
          key={index}
          className={`absolute ${dec.className} ${dec.animation} opacity-40 md:opacity-50 transition-opacity duration-500`}
          style={{ animationDelay: dec.delay }}
        >
          {dec.emoji}
        </span>
      ))}

      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle, oklch(0.88 0.15 350) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-72 md:h-72 rounded-full opacity-15 blur-3xl animate-pulse"
        style={{
          background: "radial-gradient(circle, oklch(0.75 0.15 85) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
    </div>
  )
}
