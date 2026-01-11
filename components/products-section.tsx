"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Sparkles } from "lucide-react"

const products = [
  {
    id: "black-honey",
    name: "Black Honey",
    description: "A rich, warm honey-brown with golden shimmer",
    image: "/images/black-honey.jpeg",
    color: "from-amber-700 to-amber-900",
    accent: "bg-amber-600",
  },
  {
    id: "burgundy",
    name: "Burgundy",
    description: "A deep, luxurious berry red with cherry undertones",
    image: "/images/burgundy.jpeg",
    color: "from-red-800 to-red-950",
    accent: "bg-red-800",
  },
  {
    id: "wine",
    name: "Wine",
    description: "An elegant wine-inspired red with a glossy finish",
    image: "/images/wine.jpeg",
    color: "from-red-600 to-red-800",
    accent: "bg-red-600",
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "A creamy coffee-inspired nude with warm undertones",
    image: "/images/mocha.jpeg",
    color: "from-amber-800 to-amber-950",
    accent: "bg-amber-800",
  },
  {
    id: "strawberry-milk",
    name: "Strawberry Milk",
    description: "A sweet, playful pink with creamy shimmer",
    image: "/images/strawberry-milk.jpeg",
    color: "from-pink-400 to-pink-600",
    accent: "bg-pink-400",
  },
  {
    id: "body-lotion-splash",
    name: "Body Lotion + Splash Bundle",
    description: "Luxury bundle with two delightful scents",
    image: "/images/body-lotion-splash-bundle.jpeg",
    color: "from-purple-600 to-pink-600",
    accent: "bg-purple-500",
  },
  {
    id: "lip-balm",
    name: "LipBalm",
    description: "Nourishing lip care with delicious flavor",
    image: "/images/lip-balm.jpeg",
    color: "from-rose-500 to-pink-500",
    accent: "bg-rose-400",
  },
]

export function ProductsSection() {
  return (
    <section
      id="products"
      className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden"
      aria-labelledby="products-heading"
    >
      <div className="absolute top-20 left-10 text-4xl animate-float opacity-30">🌸</div>
      <div className="absolute bottom-32 right-16 text-3xl animate-bounce-rotate opacity-30">💄</div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 bg-card/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-primary/30 mb-8 shadow-lg shadow-primary/10 animate-fade-in-up">
            <span className="animate-wiggle text-xl">💄</span>
            <span className="text-sm font-semibold text-foreground">Our Collection</span>
            <Sparkles className="w-4 h-4 text-accent animate-sparkle" />
          </div>

          <h2
            id="products-heading"
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            Luqitchy <span className="gradient-text">Cosmetics</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Discover our stunning collection of high-end cosmetics, each crafted to perfection for the ultimate
            <span className="text-accent font-semibold"> beauty experience</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 md:gap-10">
          {products.map((product, index) => (
            <article key={product.name} className="group relative" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* 3D Floating Product Container */}
              <div className="relative h-80 mb-6 perspective-1000">
                {/* Glow effect behind product */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-20 blur-3xl rounded-full transform scale-75 group-hover:scale-100 group-hover:opacity-40 transition-all duration-700`}
                />

                {/* Floating 3D Product Image */}
                <div
                  className="relative w-full h-full transform-gpu transition-all duration-700 group-hover:scale-110 animate-float-slow"
                  style={{
                    transformStyle: "preserve-3d",
                    animation: `float-slow ${3 + index * 0.5}s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl shadow-primary/30 group-hover:shadow-accent/50 transition-shadow duration-500 transform rotate-y-12 group-hover:rotate-y-0"
                    style={{
                      transform: "rotateY(-5deg) rotateX(5deg)",
                      transition: "transform 0.7s ease-out",
                    }}
                  >
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={`${product.name} Cosmetic Product`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Shimmer overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full"
                      style={{ transition: "transform 1s ease-out, opacity 0.3s ease-out" }}
                    />
                  </div>

                  {/* Floating sparkles */}
                  <span className="absolute -top-4 -right-2 text-2xl animate-sparkle opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✨
                  </span>
                  <span
                    className="absolute -bottom-2 -left-2 text-xl animate-heartbeat opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ animationDelay: "0.5s" }}
                  >
                    💖
                  </span>
                </div>

                {/* New badge */}
                <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm px-4 py-1.5 rounded-full border border-primary/30 shadow-md transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300 z-10">
                  <span className="text-xs font-bold text-accent flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    New
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center px-2">
                <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors flex items-center justify-center gap-2">
                  {product.name}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity animate-sparkle">✨</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">{product.description}</p>

                {/* Color indicator */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className={`w-5 h-5 rounded-full ${product.accent} ring-2 ring-white shadow-lg`} />
                </div>

                <Link href={`/order/${product.id}`}>
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02] group/btn"
                    size="default"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                    Order Now
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
