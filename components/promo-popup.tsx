"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Gift, Sparkles, Clock, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  })

  const promoCode = "WELCOME15"

  useEffect(() => {
    // Check if popup was already shown
    const shown = localStorage.getItem("luqitchy_promo_shown")
    if (!shown) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
        localStorage.setItem("luqitchy_promo_shown", "true")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const copyCode = () => {
    navigator.clipboard.writeText(promoCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -30 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 30 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 rounded-3xl p-1 max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sparkle effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[22px] p-6 relative">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Gift Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Gift className="w-10 h-10 text-white" />
              </motion.div>

              {/* Content */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Welcome Gift! 🎉
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Get <span className="font-bold text-pink-500">15% OFF</span> on your first order!
                </p>
              </div>

              {/* Promo Code Box */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-4">
                <p className="text-xs text-gray-500 mb-2 text-center">Your exclusive code:</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold tracking-wider text-pink-600 font-mono">
                    {promoCode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-500 text-xs text-center mt-2"
                  >
                    Copied to clipboard! ✅
                  </motion.p>
                )}
              </div>

              {/* Countdown Timer */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Offer expires in:</span>
                </div>
                <div className="flex justify-center gap-2">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                      <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-lg px-3 py-2 min-w-[50px]">
                        <span className="text-xl font-bold">{String(value).padStart(2, '0')}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase">{unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => {
                  setIsOpen(false)
                  document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 rounded-full"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Shop Now & Save 15%
              </Button>

              <p className="text-center text-xs text-gray-400 mt-4">
                *Valid for first-time customers only
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
