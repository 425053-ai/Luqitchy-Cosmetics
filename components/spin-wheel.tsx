"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Gift, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const prizes = [
  { text: "10% OFF", color: "#FF6B9D", discount: 10 },
  { text: "Free Shipping", color: "#C44569", discount: 0 },
  { text: "15% OFF", color: "#FF8FB1", discount: 15 },
  { text: "5% OFF", color: "#E91E63", discount: 5 },
  { text: "20% OFF", color: "#FF4081", discount: 20 },
  { text: "Try Again", color: "#9C27B0", discount: 0 },
  { text: "Free Gift", color: "#FF6B9D", discount: 0 },
  { text: "25% OFF", color: "#C44569", discount: 25 },
]

export function SpinWheel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [prize, setPrize] = useState<string | null>(null)
  const [hasSpun, setHasSpun] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  const spinWheel = () => {
    if (isSpinning || hasSpun) return

    setIsSpinning(true)
    setPrize(null)

    // Random rotation between 1800 and 3600 degrees (5-10 full spins)
    const randomDegree = Math.floor(Math.random() * 1800) + 1800
    const prizeIndex = Math.floor((360 - (randomDegree % 360)) / (360 / prizes.length)) % prizes.length
    
    setRotation(prev => prev + randomDegree)

    setTimeout(() => {
      setIsSpinning(false)
      setPrize(prizes[prizeIndex].text)
      setHasSpun(true)
      
      // Save to localStorage
      localStorage.setItem("luqitchy_spin_prize", prizes[prizeIndex].text)
      localStorage.setItem("luqitchy_spin_discount", prizes[prizeIndex].discount.toString())
    }, 5000)
  }

  // Check if already spun
  useState(() => {
    if (typeof window !== "undefined") {
      const alreadySpun = localStorage.getItem("luqitchy_spin_prize")
      if (alreadySpun) {
        setHasSpun(true)
        setPrize(alreadySpun)
      }
    }
  })

  return (
    <>
      {/* Floating Spin Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 bottom-24 z-50 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
        animate={{ 
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        <Gift className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
          WIN!
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50 rounded-3xl p-6 max-w-md w-full relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Sparkles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className="absolute text-yellow-400 animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      fontSize: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              <div className="text-center mb-6 relative z-10">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  🎰 Spin & Win! 🎰
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  Try your luck and get amazing discounts!
                </p>
              </div>

              {/* Wheel */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                  <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-500 drop-shadow-lg" />
                </div>

                {/* Wheel */}
                <motion.div
                  ref={wheelRef}
                  className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400"
                  style={{
                    background: `conic-gradient(${prizes.map((p, i) => `${p.color} ${i * (100/prizes.length)}% ${(i + 1) * (100/prizes.length)}%`).join(", ")})`
                  }}
                  animate={{ rotate: rotation }}
                  transition={{ duration: 5, ease: "easeOut" }}
                >
                  {prizes.map((prize, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-full flex items-center justify-center"
                      style={{
                        transform: `rotate(${i * (360/prizes.length) + (180/prizes.length)}deg)`
                      }}
                    >
                      <span 
                        className="text-white text-xs font-bold absolute"
                        style={{
                          transform: `translateY(-90px) rotate(0deg)`,
                          textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
                        }}
                      >
                        {prize.text}
                      </span>
                    </div>
                  ))}
                </motion.div>

                {/* Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                  <span className="text-2xl">🎁</span>
                </div>
              </div>

              {/* Prize Display */}
              {prize && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center mb-4 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl"
                >
                  <p className="text-white font-bold text-lg">🎉 Congratulations! 🎉</p>
                  <p className="text-white text-2xl font-bold">{prize}</p>
                </motion.div>
              )}

              {/* Spin Button */}
              <Button
                onClick={spinWheel}
                disabled={isSpinning || hasSpun}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSpinning ? "🎰 Spinning..." : hasSpun ? "Already Claimed! ✅" : "🎯 SPIN NOW!"}
              </Button>

              {hasSpun && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Your discount will be applied at checkout!
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
