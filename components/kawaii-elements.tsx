"use client"

import { useState, useEffect } from "react"

// Kawaii mascot that appears on different pages
export function KawaiiMascot({ 
  variant = "default",
  message,
  position = "bottom-right"
}: { 
  variant?: "default" | "happy" | "excited" | "love" | "thinking" | "wave"
  message?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(message)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const mascots: Record<string, string> = {
    default: "( ◕ᴗ◕ )",
    happy: "(◕‿◕)✧",
    excited: "ヽ(>∀<☆)ノ",
    love: "(♡´▽`♡)",
    thinking: "(•̀ᴗ•́)و",
    wave: "( ´ ▽ ` )ﾉ"
  }

  const messages: Record<string, string[]> = {
    default: ["Welcome to Luqitchy! 💖", "Need help? Just ask! ✨", "Have a beautiful day! 🌸"],
    happy: ["Yay! Great choice! 🎉", "So excited! ✨", "You're amazing! 💖"],
    excited: ["OMG! So pretty! ✨", "Can't wait! 🎊", "This is so cute! 💕"],
    love: ["Love this! 💗", "Perfect for you! 💝", "So beautiful! 💖"],
    thinking: ["Hmm, let me think... 🤔", "Good question! 💭", "Interesting! 💡"],
    wave: ["Hi there! 👋", "Hello beautiful! 🌸", "Welcome back! 💖"]
  }

  useEffect(() => {
    if (!message) {
      const variantMessages = messages[variant]
      setCurrentMessage(variantMessages[Math.floor(Math.random() * variantMessages.length)])
    }
  }, [message, variant])

  const positionClasses: Record<string, string> = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-20 right-4",
    "top-left": "top-20 left-4"
  }

  if (!isVisible) return null

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-40 animate-kawaii-bounce hidden md:block`}
      style={{ animationDelay: '0.5s' }}
    >
      <div className="relative group cursor-pointer">
        {/* Speech bubble */}
        {currentMessage && (
          <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-card rounded-2xl px-4 py-2 shadow-lg border-2 border-pink-200 dark:border-pink-800 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 min-w-max">
            <p className="text-sm font-medium text-pink-600 dark:text-pink-400 whitespace-nowrap">
              {currentMessage}
            </p>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-card border-r-2 border-b-2 border-pink-200 dark:border-pink-800 transform rotate-45" />
          </div>
        )}

        {/* Mascot body */}
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 rounded-full p-4 shadow-lg border-2 border-pink-300 dark:border-pink-700 hover:scale-110 transition-transform duration-300 hover:shadow-xl hover:shadow-pink-300/30">
          <span className="text-2xl font-bold select-none">
            {mascots[variant]}
          </span>
        </div>

        {/* Floating hearts on hover */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-pink-500 animate-float">💖</span>
        </div>
      </div>
    </div>
  )
}

// Cute loading dots
export function KawaiiLoading() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-muted-foreground ml-2">Loading cuteness...</span>
      <span className="animate-pulse">✨</span>
    </div>
  )
}

// Kawaii divider
export function KawaiiDivider({ emoji = "💖" }: { emoji?: string }) {
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1" />
      <span className="text-2xl animate-pulse">{emoji}</span>
      <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1" />
    </div>
  )
}

// Kawaii badge
export function KawaiiBadge({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode
  variant?: "default" | "new" | "sale" | "popular" | "limited"
}) {
  const variantStyles: Record<string, string> = {
    default: "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700",
    new: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    sale: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
    popular: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
    limited: "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700"
  }

  const emojis: Record<string, string> = {
    default: "✨",
    new: "🆕",
    sale: "🔥",
    popular: "⭐",
    limited: "💎"
  }

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2 ${variantStyles[variant]} animate-pulse`}>
      <span>{emojis[variant]}</span>
      {children}
    </span>
  )
}

// Cute tooltip
export function KawaiiTooltip({ 
  children, 
  content 
}: { 
  children: React.ReactNode
  content: string
}) {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-pink-500 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
        {content}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-500 rotate-45" />
      </div>
    </div>
  )
}

// Animated star rating
export function KawaiiStars({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => (
        <span 
          key={i} 
          className={`text-lg transition-all duration-300 ${
            i < rating 
              ? 'text-yellow-400 animate-pulse' 
              : 'text-gray-300 dark:text-gray-600'
          }`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

// Floating emojis background decoration
export function FloatingEmojis({ 
  emojis = ["💖", "✨", "🌸", "💕", "🎀", "💝"],
  count = 10 
}: { 
  emojis?: string[]
  count?: number 
}) {
  const [particles, setParticles] = useState<Array<{
    id: number
    emoji: string
    left: number
    delay: number
    duration: number
    size: number
  }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      size: 12 + Math.random() * 12
    }))
    setParticles(newParticles)
  }, [count, emojis])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-bubble opacity-30"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            fontSize: `${particle.size}px`
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  )
}
