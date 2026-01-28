"use client"

import { useEffect, useState } from "react"

const decorations = [
  // Top area - More emojis with varied animations
  { emoji: "✨", className: "top-16 left-[5%] text-2xl md:text-3xl", animation: "animate-sparkle", delay: "0s" },
  { emoji: "💖", className: "top-24 left-[15%] text-xl md:text-2xl", animation: "animate-heart-pop", delay: "0.3s" },
  { emoji: "💄", className: "top-32 left-[8%] text-lg md:text-xl", animation: "animate-bounce-rotate", delay: "0.6s" },
  { emoji: "🌸", className: "top-20 right-[10%] text-2xl md:text-3xl", animation: "animate-float-slow", delay: "0.2s" },
  { emoji: "💋", className: "top-36 right-[5%] text-xl md:text-2xl", animation: "animate-wiggle", delay: "0.8s" },
  { emoji: "✨", className: "top-28 right-[18%] text-lg md:text-xl", animation: "animate-twinkle", delay: "0.4s" },
  { emoji: "🦋", className: "top-14 left-[25%] text-xl md:text-2xl", animation: "animate-float-rotate", delay: "0.7s" },
  { emoji: "🌟", className: "top-40 right-[25%] text-lg md:text-xl", animation: "animate-star-twirl", delay: "0.9s" },
  { emoji: "💕", className: "top-12 right-[35%] text-xl md:text-2xl", animation: "animate-heartbeat", delay: "0.5s" },
  { emoji: "🎀", className: "top-44 left-[30%] text-lg md:text-xl", animation: "animate-dance", delay: "1.1s" },

  // Middle area - More cute elements
  { emoji: "🎀", className: "top-[35%] left-[3%] text-xl md:text-2xl", animation: "animate-swing", delay: "1s" },
  { emoji: "💕", className: "top-[42%] left-[12%] text-lg md:text-xl", animation: "animate-pulse-glow", delay: "0.5s" },
  { emoji: "✨", className: "top-[38%] right-[8%] text-2xl md:text-3xl", animation: "animate-sparkle-burst", delay: "1.2s" },
  { emoji: "🌷", className: "top-[48%] right-[4%] text-xl md:text-2xl", animation: "animate-float", delay: "0.7s" },
  { emoji: "🍬", className: "top-[32%] right-[15%] text-lg md:text-xl", animation: "animate-kawaii-bounce", delay: "1.4s" },
  { emoji: "🧸", className: "top-[45%] left-[6%] text-xl md:text-2xl", animation: "animate-wobble", delay: "1.6s" },
  { emoji: "💫", className: "top-[40%] left-[20%] text-lg md:text-xl", animation: "animate-glitter", delay: "1.8s" },
  { emoji: "🌈", className: "top-[50%] right-[20%] text-xl md:text-2xl", animation: "animate-float-slow", delay: "2s" },
  { emoji: "🦄", className: "top-[36%] left-[35%] text-lg md:text-xl", animation: "animate-dance", delay: "2.2s" },
  { emoji: "⭐", className: "top-[55%] left-[8%] text-xl md:text-2xl", animation: "animate-star-twirl", delay: "2.4s" },

  // Bottom area - More girly decorations
  { emoji: "💖", className: "top-[60%] left-[6%] text-lg md:text-xl", animation: "animate-heart-pop", delay: "1.5s" },
  { emoji: "✨", className: "top-[68%] left-[14%] text-xl md:text-2xl", animation: "animate-twinkle", delay: "0.9s" },
  { emoji: "💄", className: "top-[72%] right-[10%] text-lg md:text-xl", animation: "animate-bounce-rotate", delay: "1.8s" },
  { emoji: "🎀", className: "top-[65%] right-[6%] text-xl md:text-2xl", animation: "animate-swing", delay: "1.1s" },
  { emoji: "💋", className: "top-[80%] left-[8%] text-lg md:text-xl", animation: "animate-wiggle", delay: "2s" },
  { emoji: "🌸", className: "top-[78%] right-[12%] text-xl md:text-2xl", animation: "animate-float-slow", delay: "1.4s" },
  { emoji: "🍭", className: "top-[62%] right-[25%] text-lg md:text-xl", animation: "animate-kawaii-bounce", delay: "2.6s" },
  { emoji: "🎵", className: "top-[75%] left-[25%] text-xl md:text-2xl", animation: "animate-dance", delay: "2.8s" },
  { emoji: "💝", className: "top-[85%] right-[30%] text-lg md:text-xl", animation: "animate-heartbeat", delay: "3s" },
  { emoji: "🌺", className: "top-[70%] left-[35%] text-xl md:text-2xl", animation: "animate-float-rotate", delay: "3.2s" },
  { emoji: "🦩", className: "top-[82%] left-[15%] text-lg md:text-xl", animation: "animate-float", delay: "3.4s" },
  { emoji: "💅", className: "top-[88%] right-[8%] text-xl md:text-2xl", animation: "animate-sparkle", delay: "3.6s" },
]

// Bubble decorations that float up
const bubbles = [
  { size: "w-3 h-3", left: "10%", delay: "0s", duration: "8s" },
  { size: "w-2 h-2", left: "20%", delay: "2s", duration: "10s" },
  { size: "w-4 h-4", left: "30%", delay: "1s", duration: "9s" },
  { size: "w-2 h-2", left: "50%", delay: "3s", duration: "11s" },
  { size: "w-3 h-3", left: "70%", delay: "0.5s", duration: "8.5s" },
  { size: "w-2 h-2", left: "85%", delay: "2.5s", duration: "10s" },
  { size: "w-3 h-3", left: "95%", delay: "1.5s", duration: "9.5s" },
]

export function FloatingDecorations() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Floating emojis */}
      {decorations.map((dec, index) => (
        <span
          key={index}
          className={`absolute ${dec.className} ${dec.animation} opacity-30 md:opacity-40 transition-opacity duration-500 hover:opacity-60`}
          style={{ animationDelay: dec.delay }}
        >
          {dec.emoji}
        </span>
      ))}

      {/* Cute bubbles */}
      {bubbles.map((bubble, index) => (
        <div
          key={`bubble-${index}`}
          className={`absolute bottom-0 ${bubble.size} rounded-full bg-gradient-to-br from-pink-300/40 to-purple-300/40 backdrop-blur-sm`}
          style={{
            left: bubble.left,
            animation: `bubble-rise ${bubble.duration} ease-in-out infinite`,
            animationDelay: bubble.delay,
          }}
        />
      ))}

      {/* Gradient orbs */}
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
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[500px] md:h-[500px] rounded-full opacity-10 blur-3xl animate-morph"
        style={{
          background: "radial-gradient(circle, oklch(0.7 0.2 320) 0%, transparent 70%)",
          animationDelay: "2s",
        }}
      />

      {/* Sparkle stars scattered around */}
      <div className="absolute top-[15%] left-[40%] text-yellow-400/30 animate-glitter text-xl">★</div>
      <div className="absolute top-[25%] right-[45%] text-pink-400/30 animate-glitter text-lg" style={{ animationDelay: "0.5s" }}>★</div>
      <div className="absolute top-[55%] left-[55%] text-purple-400/30 animate-glitter text-xl" style={{ animationDelay: "1s" }}>★</div>
      <div className="absolute top-[75%] right-[40%] text-pink-400/30 animate-glitter text-lg" style={{ animationDelay: "1.5s" }}>★</div>
    </div>
  )
}
