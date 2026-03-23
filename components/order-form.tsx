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
    price: 99,
  },
  {
    id: "burgundy",
    name: "Burgundy",
    description: "A deep, luxurious berry red with cherry undertones",
    image: "/images/burgundy.jpeg",
    color: "from-red-800 to-red-950",
    accent: "bg-red-800",
    price: 99,
  },
  {
    id: "wine",
    name: "Wine",
    description: "An elegant wine-inspired red with a glossy finish",
    image: "/images/wine.jpeg",
    color: "from-red-600 to-red-800",
    accent: "bg-red-600",
    price: 99,
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "A creamy coffee-inspired nude with warm undertones",
    image: "/images/mocha.jpeg",
    color: "from-amber-800 to-amber-950",
    accent: "bg-amber-800",
    price: 99,
  },
  {
    id: "strawberry-milk",
    name: "Strawberry Milk",
    description: "A sweet, playful pink with creamy shimmer",
    image: "/images/strawberry-milk.jpeg",
    color: "from-pink-400 to-pink-600",
    accent: "bg-pink-400",
    price: 65,
  },
  {
    id: "body-lotion-splash-mulberry",
    name: "Body Lotion + Splash Bundle - Mulberry",
    description: "Luxury bundle with delightful scents",
    image: "/images/body-lotion-splash-mulberry.png",
    color: "from-purple-600 to-pink-600",
    accent: "bg-purple-500",
    price: 300,
  },
  {
    id: "lip-balm",
    name: "Lip Balm",
    description: "Nourishing lip care with delicious flavor",
    image: "/images/lip-balm.jpeg",
    color: "from-rose-500 to-pink-500",
    accent: "bg-rose-400",
    price: 100,
  },
  {
    id: "eyebrow-gel-20g",
    name: "Eyebrow Gel 20g",
    description: "20g. Brow gel for natural shaping and all-day hold.",
    image: "/images/eyebrow-gel-20g.jpeg",
    color: "from-gray-300 to-gray-500",
    accent: "bg-gray-500",
    price: 115,
  },
  {
    id: "eyebrow-gel-10g",
    name: "Eyebrow Gel 10g",
    description: "10g. Brow gel for natural shaping and all-day hold.",
    image: "/images/eyebrow-gel-10g.jpeg",
    color: "from-gray-200 to-gray-400",
    accent: "bg-gray-400",
    price: 60,
  },
  {
    id: "dri-oil",
    name: "Dry Oil",
    description: "Glow من غير أي إحساس دهني - خفيف وناعم مع ريحة أنثوية",
    image: "/images/dri-oil.jpeg",
    color: "from-yellow-400 to-amber-500",
    accent: "bg-amber-500",
    price: 250,
    oldPrice: 350,
  },
  {
    id: "body-care-strawberry",
    name: "Body Care",
    description: "Mini size lotion + splash بريحة Strawberry Pound Cake الحلوة",
    image: "/images/body-care-strawberry.jpeg",
    color: "from-pink-400 to-rose-500",
    accent: "bg-pink-500",
    price: 199,
    oldPrice: 250,
  },
]

export function ProductsSection() {
  return (
    <section
      id="products"
      className="py-20 md:py-32 bg-gradient-to-b from-secondary/50 via-background to-secondary/30 relative overflow-hidden"
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

          <span className="text-accent font-semibold"> beauty experience</span>.
        </div>

        <div className="space-y-32">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <Link
                  href={`/order/${product.id}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="relative"
                  aria-label={`View ${product.name} order page`}
                >
                  <span className="sr-only">Order {product.name}</span>
                  <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl shadow-primary/30 transition-all duration-500 group-hover:shadow-3xl group-hover:shadow-accent/40 group-hover:scale-105 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-8 h-8 bg-accent/20 rounded-full blur-md animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 w-6 h-6 bg-accent/30 rounded-full blur-md animate-floating-sparkles opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${product.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gloss-shine`}
                    />
                  </div>
                </Link>

                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">{product.name}</h3>
                    <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-foreground">{product.price} EGP</span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="inline-block animate-sparkle">✨</span>
                      Premium Quality
                    </div>
                  </div>

                  <Link href={`/order/${product.id}`}>
                    <Button
                      className={`w-full md:w-auto px-8 py-3 ${product.accent} hover:opacity-90 text-white font-semibold transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg relative overflow-hidden`}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>

              <div
                className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-50 blur transition-opacity duration-300 pointer-events-none -z-10 animate-pulse`}
                style={{
                  background: `linear-gradient(135deg, ${product.color})`,
                }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
