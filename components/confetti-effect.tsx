"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  speedX: number
  speedY: number
  rotationSpeed: number
  shape: 'circle' | 'square' | 'heart' | 'star'
}

interface ConfettiEffectProps {
  isActive: boolean
  duration?: number
  pieceCount?: number
}

const colors = [
  '#ff4d6d', // Pink
  '#ff85a1', // Light Pink
  '#ffc2d1', // Soft Pink
  '#ffb3c6', // Rose
  '#fb6f92', // Hot Pink
  '#ff8fab', // Salmon Pink
  '#ffd700', // Gold
  '#ff69b4', // Hot Pink
  '#da70d6', // Orchid
  '#ee82ee', // Violet
]

const shapes = ['circle', 'square', 'heart', 'star'] as const

export function ConfettiEffect({ isActive, duration = 5000, pieceCount = 150 }: ConfettiEffectProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const newPieces: ConfettiPiece[] = []
      for (let i = 0; i < pieceCount; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          y: -10 - Math.random() * 20,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 8 + Math.random() * 12,
          speedX: (Math.random() - 0.5) * 4,
          speedY: 2 + Math.random() * 4,
          rotationSpeed: (Math.random() - 0.5) * 10,
          shape: shapes[Math.floor(Math.random() * shapes.length)]
        })
      }
      setPieces(newPieces)
      setIsVisible(true)

      // Hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false)
        setPieces([])
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isActive, duration, pieceCount])

  if (!isVisible || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            '--speed-x': piece.speedX,
            '--speed-y': piece.speedY,
            '--rotation-speed': piece.rotationSpeed,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 0.5}s`,
          } as React.CSSProperties}
        >
          {piece.shape === 'circle' && (
            <div
              className="rounded-full"
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
              }}
            />
          )}
          {piece.shape === 'square' && (
            <div
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
              }}
            />
          )}
          {piece.shape === 'heart' && (
            <div
              style={{
                fontSize: piece.size,
                color: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
              }}
            >
              💖
            </div>
          )}
          {piece.shape === 'star' && (
            <div
              style={{
                fontSize: piece.size,
                color: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
              }}
            >
              ✨
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Floating Hearts Component for Wishlist
interface FloatingHeartsProps {
  isActive: boolean
  x?: number
  y?: number
}

export function FloatingHearts({ isActive, x = 50, y = 50 }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<{ id: number; offsetX: number; delay: number }[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      const newHearts = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        offsetX: (Math.random() - 0.5) * 60,
        delay: Math.random() * 0.3,
      }))
      setHearts(newHearts)
      setIsVisible(true)

      const timer = setTimeout(() => {
        setIsVisible(false)
        setHearts([])
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isActive])

  if (!isVisible) return null

  return (
    <div 
      className="fixed pointer-events-none z-[9999]"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up-fade"
          style={{
            left: heart.offsetX,
            animationDelay: `${heart.delay}s`,
          }}
        >
          <span className="text-2xl">💖</span>
        </div>
      ))}
    </div>
  )
}
