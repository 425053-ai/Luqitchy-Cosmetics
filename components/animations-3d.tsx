"use client"

import { useEffect, useRef, useState } from "react"

// 3D Floating Product Card with rotation
export function Product3DCard({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect */}
      {isHovered && (
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-xl -z-10"
          style={{
            transform: 'translateZ(-50px)'
          }}
        />
      )}
      {children}
    </div>
  )
}

// CSS-based 3D Lipstick Animation
export function Lipstick3D({ 
  color = "#c44569",
  size = "medium" 
}: { 
  color?: string
  size?: "small" | "medium" | "large"
}) {
  const sizes = {
    small: { width: 40, height: 100 },
    medium: { width: 60, height: 150 },
    large: { width: 80, height: 200 }
  }
  
  const { width, height } = sizes[size]

  return (
    <div 
      className="relative animate-lipstick-3d"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Lipstick cap */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-t-full shadow-lg"
        style={{
          width: `${width}px`,
          height: `${height * 0.3}px`,
          background: 'linear-gradient(135deg, #2d2d2d 0%, #4a4a4a 50%, #2d2d2d 100%)',
          transform: 'translateZ(5px)'
        }}
      >
        {/* Cap shine */}
        <div 
          className="absolute inset-x-0 top-2 h-2 mx-2 rounded-full opacity-30"
          style={{ background: 'linear-gradient(90deg, transparent, white, transparent)' }}
        />
      </div>

      {/* Lipstick body/tube */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-b-lg shadow-lg"
        style={{
          width: `${width}px`,
          height: `${height * 0.5}px`,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%)',
        }}
      >
        {/* Gold ring decoration */}
        <div 
          className="absolute top-0 inset-x-0 h-3"
          style={{
            background: 'linear-gradient(180deg, #ffd700 0%, #b8860b 50%, #ffd700 100%)',
          }}
        />
        {/* Brand text area */}
        <div className="absolute inset-x-2 top-6 bottom-2 rounded bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          <span className="text-xs font-serif text-gold-gradient tracking-wider" style={{ color: '#ffd700' }}>
            L
          </span>
        </div>
      </div>

      {/* Lipstick color/bullet */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 rounded-t-full shadow-inner"
        style={{
          width: `${width * 0.7}px`,
          height: `${height * 0.25}px`,
          top: `${height * 0.28}px`,
          background: `linear-gradient(135deg, ${color} 0%, ${adjustBrightness(color, -20)} 50%, ${color} 100%)`,
          boxShadow: `inset 2px 2px 8px rgba(255,255,255,0.3), inset -2px -2px 8px rgba(0,0,0,0.3)`
        }}
      >
        {/* Shine effect on lipstick */}
        <div 
          className="absolute top-2 left-2 w-2 h-4 rounded-full opacity-50"
          style={{ background: 'rgba(255,255,255,0.6)' }}
        />
      </div>
    </div>
  )
}

// Helper function to adjust color brightness
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (
    0x1000000 + 
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1)
}

// Makeup brush with swipe animation
export function MakeupBrush({ type = "powder" }: { type?: "powder" | "lip" | "eyeshadow" }) {
  const brushColors: Record<string, { bristles: string; handle: string }> = {
    powder: { bristles: '#d4a574', handle: '#2d2d2d' },
    lip: { bristles: '#e8c4c4', handle: '#8b4513' },
    eyeshadow: { bristles: '#a89078', handle: '#4a4a4a' }
  }

  const { bristles, handle } = brushColors[type]

  return (
    <div className="relative w-12 h-32 animate-brush-swipe">
      {/* Brush bristles */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-8 rounded-t-full"
        style={{ background: bristles }}
      />
      {/* Ferrule (metal part) */}
      <div 
        className="absolute top-7 left-1/2 -translate-x-1/2 w-6 h-4"
        style={{ background: 'linear-gradient(90deg, #silver, #d4d4d4, #silver)' }}
      />
      {/* Handle */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-20 rounded-b-lg"
        style={{ background: handle }}
      />
    </div>
  )
}

// Animated sparkle trail following cursor
export function SparkleTrail() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    let id = 0
    const handleMouseMove = (e: MouseEvent) => {
      const newSparkle = { id: id++, x: e.clientX, y: e.clientY }
      setSparkles(prev => [...prev.slice(-15), newSparkle])
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => prev.slice(1))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 hidden md:block">
      {sparkles.map((sparkle, i) => (
        <span
          key={sparkle.id}
          className="absolute text-yellow-400 star-trail-particle"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            fontSize: `${8 + i}px`,
            opacity: i / sparkles.length,
            transform: 'translate(-50%, -50%)'
          }}
        >
          ✨
        </span>
      ))}
    </div>
  )
}

// Product hover shine effect
export function ShineEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
    </div>
  )
}

// Animated gradient border
export function GradientBorder({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative p-[2px] rounded-2xl overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-gradient-x" />
      <div className="relative bg-card rounded-2xl p-4">
        {children}
      </div>
    </div>
  )
}

// Floating product animation
export function FloatingProduct({ 
  children,
  intensity = "medium"
}: { 
  children: React.ReactNode
  intensity?: "subtle" | "medium" | "strong"
}) {
  const floatPixels = {
    subtle: 5,
    medium: 10,
    strong: 15
  }

  return (
    <div 
      className="animate-float"
      style={{
        // @ts-ignore
        '--float-distance': `${floatPixels[intensity]}px`
      }}
    >
      {children}
    </div>
  )
}
