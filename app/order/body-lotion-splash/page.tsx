"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Heart } from "lucide-react"
import { OrderForm } from "@/components/order-form"

const product = {
  id: "body-lotion-splash",
  name: "Body Lotion + Splash Bundle",
  price: "300",
  features: ["Luxurious hydrating lotion", "Refreshing fragrant splash", "Premium packaging", "Perfect gift set"],
  scents: [
    {
      id: "mulberry",
      name: "Mulberry",
      description: "Sweet, sophisticated berry scent with floral notes",
      image: "/images/mulberry-scent.jpeg",
      color: "from-purple-600 to-pink-500",
    },
    {
      id: "sugar-drop",
      name: "Sugar Drop",
      description: "Playful, sugary fragrance with vanilla undertones",
      image: "/images/sugar-drop-scent.jpeg",
      color: "from-pink-500 to-rose-400",
    },
  ],
}

export default function BodyLotionSplashPage() {
  const [selectedScent, setSelectedScent] = useState(product.scents[0])
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-background to-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="flex flex-col gap-6">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
              <Image
                src={selectedScent.image || "/placeholder.svg"}
                alt={selectedScent.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Choose Your Scent</p>

              <div className="flex gap-4">
                {product.scents.map((scent) => (
                  <button
                    key={scent.id}
                    onClick={() => setSelectedScent(scent)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 group ${
                      selectedScent.id === scent.id
                        ? "border-accent bg-accent/5 shadow-lg shadow-accent/20"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="text-left space-y-1">
                      <h3
                        className={`font-semibold text-sm group-hover:text-accent transition-colors ${
                          selectedScent.id === scent.id ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {scent.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{scent.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-2 p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{selectedScent.name}:</span>{" "}
                  {selectedScent.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold font-serif">{product.name}</h1>
                <p className="text-lg text-accent font-semibold">{selectedScent.name}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-accent">{product.price} EGP</span>
                <span className="text-sm text-muted-foreground">per bundle</span>
              </div>

              <ul className="grid gap-3 mt-6">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-border hover:bg-secondary transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold min-w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-border hover:bg-secondary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="text-2xl font-bold text-accent">
                    {Number.parseInt(product.price) * quantity} EGP
                  </span>
                </div>
              </div>

              <OrderForm productName={`${product.name} - ${selectedScent.name}`} productPrice={product.price} />

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                <Heart className="w-4 h-4 text-accent" />
                <span>Made with love for your beauty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
