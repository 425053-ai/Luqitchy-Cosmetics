"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function LuxuryCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([])

  useEffect(() => {
    // Only show custom cursor on desktop
    if (typeof window !== "undefined" && window.innerWidth < 768) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Add to trail
      setTrail(prev => [...prev.slice(-10), { x: e.clientX, y: e.clientY, id: Date.now() }])
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.style.cursor === "pointer"
      ) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = () => setIsHovering(false)

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseout", handleMouseOut)

    // Hide default cursor
    document.body.style.cursor = "none"

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseOut)
      document.body.style.cursor = "auto"
    }
  }, [])

  // Don't render on mobile
  if (typeof window !== "undefined" && window.innerWidth < 768) return null

  return (
    <>
      {/* Trail */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: point.x - 4,
            top: point.y - 4,
          }}
        >
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400" />
        </motion.div>
      ))}

      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - (isHovering ? 20 : 10),
          y: mousePosition.y - (isHovering ? 20 : 10),
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            isHovering
              ? "w-10 h-10 bg-white/80 border-2 border-pink-400"
              : "w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500"
          }`}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.5 : 0.3,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
          mass: 0.8,
        }}
      >
        <div className="w-10 h-10 rounded-full border-2 border-pink-400/50" />
      </motion.div>

      {/* Sparkle on click */}
      {isClicking && (
        <motion.div
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: 2 }}
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: mousePosition.x - 15,
            top: mousePosition.y - 15,
          }}
        >
          <span className="text-2xl">✨</span>
        </motion.div>
      )}
    </>
  )
}
