"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Sparkles, Heart, ArrowRight } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import { useToast } from "@/components/ui/toast"

const products = [
// ...existing products...
    // ...existing products...
  {
    id: "burgundy",
    name: "Burgundy",
    description: "A deep, luxurious berry red with cherry undertones",
    image: "/images/burgundy.jpeg",
    color: "from-red-800 to-red-950",
    accent: "bg-red-800",
    price: 99,
    isNew: false,
    imageClass: "object-cover object-top",
    containerBg: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "A creamy coffee-inspired nude with warm undertones",
    image: "/images/mocha.jpeg",
    color: "from-amber-800 to-amber-950",
    accent: "bg-amber-800",
    price: 99,
    isNew: false,
    imageClass: "object-cover object-top",
    containerBg: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
  },
  {
    id: "strawberry-milk",
    name: "Strawberry Milk",
    description: "A sweet, playful pink with creamy shimmer",
    image: "/images/strawberry-milk.jpeg",
    color: "from-pink-400 to-pink-600",
    accent: "bg-pink-400",
    price: 99,
    isNew: false,
    imageClass: "object-cover object-top",
    containerBg: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
  },
  {
    id: "black-honey",
    name: "Black Honey",
    description: "A rich, warm honey-brown with golden shimmer",
    image: "/images/black-honey.jpeg",
    color: "from-amber-700 to-amber-900",
    accent: "bg-amber-600",
    price: 99,
    isNew: false,
    // Mobile: cover with top focus, Desktop: cover
    imageClass: "object-cover object-top",
    containerBg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
  },
  {
    id: "wine",
    name: "Wine",
    description: "An elegant wine-inspired red with a glossy finish",
    image: "/images/wine.jpeg",
    color: "from-red-600 to-red-800",
    accent: "bg-red-600",
    price: 100,
    isNew: false,
    imageClass: "object-cover object-top",
        containerBg: "bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30",
      },
      {
        id: "lip-balm",
        name: "Lip Balm",
        description: "Nourishing lip care with delicious flavor",
        image: "/images/lip-balm.jpeg",
        color: "from-rose-500 to-pink-500",
        accent: "bg-rose-500",
        price: 65,
        isNew: true,
        imageClass: "object-cover object-top",
        containerBg: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
      },
  {
    id: "body-lotion-splash-mulberry",
    name: "Body Lotion + Splash Bundle - Mulberry",
    description: "Luxury bundle with two delightful scents",
    image: "/images/body-lotion-splash-mulberry.png",
    color: "from-purple-600 to-pink-600",
    accent: "bg-purple-500",
    price: 300,
    isNew: true,
    // Bundle images need contain to show both products
    imageClass: "object-cover object-center",
    containerBg: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
  },
  {
    id: "body-lotion-splash-sugar-drop",
    name: "Body Lotion + Splash Bundle - Sugar Drop",
    description: "Sweet luxury bundle with irresistible fragrance",
    image: "/images/body-lotion-splash-sugar-drop.png",
    color: "from-pink-400 to-orange-300",
    accent: "bg-pink-400",
    price: 300,
    isNew: true,
    imageClass: "object-cover object-center",
    containerBg: "bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/30",
  },
  {
    id: "lotion-splash-travel",
    name: "Lotion & Splash travel Size",
    description: "Mixed scent dupe Burberry Her and Strawberry Bound Cake. Strawberry and berry mix to give you the feeling of refreshment after showering. Stability for 8 hours.",
    image: "/images/lotion-splash-travel.jpeg",
    color: "from-pink-300 to-purple-400",
    accent: "bg-pink-400",
    price: 175,
    isNew: true,
    imageClass: "object-cover object-center",
    containerBg: "bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30",
    originalPrice: 250,
    discount: 75,
  },
  {
    id: "eyebrow-gel",
    name: "Eyebrow Gel",
    description: "20g. Brow gel for natural shaping and all-day hold.",
    image: "/images/eyebrow-gel.jpeg",
    color: "from-gray-300 to-gray-500",
    accent: "bg-gray-500",
    price: 115,
    isNew: true,
    imageClass: "object-cover object-center",
    containerBg: "bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900/30 dark:to-gray-700/30",
    originalPrice: 0,
    discount: 0,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
}

export function ProductsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { showToast } = useToast()

  const handleQuickAdd = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.color,
      quantity: 1,
    })
    showToast(`${product.name} added to cart!`, "cart")
  }

  const toggleWishlist = (product: typeof products[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      showToast("Removed from wishlist", "info")
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: product.color,
      })
      showToast("Added to wishlist! ❤️", "success")
    }
  }

  return (
    <section
      id="products"
      className="py-24 md:py-36 bg-gradient-to-b from-secondary/30 via-background to-secondary/20 relative overflow-hidden"
      aria-labelledby="products-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="hidden sm:block absolute top-20 left-10 text-4xl opacity-30"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🌸
        </motion.div>
        <motion.div 
          className="hidden sm:block absolute bottom-32 right-16 text-3xl opacity-30"
          animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          💄
        </motion.div>
        <motion.div 
          className="hidden md:block absolute top-40 right-20 text-2xl opacity-25"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
        <motion.div 
          className="hidden lg:block absolute bottom-40 left-20 text-3xl opacity-25"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🎀
        </motion.div>
        <motion.div 
          className="hidden md:block absolute top-1/3 left-5 text-2xl opacity-20"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          💋
        </motion.div>
        <motion.div 
          className="hidden lg:block absolute top-2/3 right-10 text-3xl opacity-25"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          💖
        </motion.div>
        <motion.div 
          className="hidden xl:block absolute top-1/4 right-1/3 text-2xl opacity-20"
          animate={{ y: [0, -10, 0], rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          🦋
        </motion.div>
        <motion.div 
          className="hidden xl:block absolute bottom-1/4 left-1/3 text-2xl opacity-20"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          🌟
        </motion.div>
        <div className="hidden md:block absolute top-1/2 left-1/4 w-64 lg:w-96 h-64 lg:h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="hidden md:block absolute bottom-1/4 right-1/4 w-48 lg:w-72 h-48 lg:h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-3 bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/30 mb-8 shadow-lg shadow-primary/10 hover-jelly"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="animate-dance text-xl">💄</span>
            <span className="text-sm font-bold text-foreground uppercase tracking-wider">Our Collection</span>
            <Sparkles className="w-4 h-4 text-accent animate-sparkle-burst" />
            <span className="animate-heart-pop text-lg">💖</span>
          </motion.div>

          <h2
            id="products-heading"
            className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6 relative inline-block"
          >
            <span className="absolute -top-6 -left-6 text-2xl animate-float-rotate">✨</span>
            Luqitchy{" "}
            <span className="rainbow-text">
              Collection
            </span>
            <span className="absolute -top-4 -right-6 text-2xl animate-star-twirl">🌟</span>
            <span className="absolute -bottom-2 right-1/4 text-xl animate-kawaii-bounce">🎀</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            <span className="inline-block animate-float mr-1">🌸</span>
            Discover our stunning collection of premium cosmetics, each meticulously crafted to deliver the ultimate
            <span className="text-accent font-semibold"> luxury beauty experience</span>
            <span className="inline-block animate-sparkle ml-1">✨</span>
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {products.map((product, index) => (
            <motion.article 
              key={product.name} 
              variants={itemVariants}
              className="group relative"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Premium Card Container */}
              <div className="premium-card kawaii-card rounded-2xl sm:rounded-3xl overflow-hidden h-full bg-card border border-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent/10">
                {/* Product Image Container - consistent aspect ratio across all devices */}
                <div className={`relative aspect-[4/5] overflow-hidden ${product.containerBg}`}>
                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-30 transition-all duration-700`}
                  />

                  {/* Image - all loaded eagerly for instant display */}
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={`${product.name} Cosmetic Product`}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`${product.imageClass} transition-all duration-700 group-hover:scale-105`}
                    unoptimized
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  {/* Cute floating emoji on hover */}
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-kawaii-bounce pointer-events-none">💖</span>

                  {/* New badge */}
                  {product.isNew && (
                    <div className="absolute top-4 left-4 premium-badge px-3 py-1 rounded-full shadow-lg transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300 z-10 animate-glow-soft">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <span className="animate-sparkle">✨</span>
                        NEW
                        <span className="animate-star-twirl">🌟</span>
                      </span>
                    </div>
                  )}

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleWishlist(product)
                    }}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md border shadow-lg z-10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
                      isInWishlist(product.id)
                        ? "bg-red-500 border-red-400 text-white"
                        : "bg-card/90 border-white/20 text-muted-foreground hover:text-red-500"
                    }`}
                    aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  </button>

                  {/* Quick add button - appears on hover */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleQuickAdd(product)
                    }}
                    className="absolute bottom-4 right-4 bg-accent hover:bg-accent/90 text-white px-3 py-2 rounded-xl shadow-lg z-10 flex items-center gap-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 btn-kawaii"
                    aria-label={`Quick add ${product.name} to cart`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-xs font-semibold">Quick Add</span>
                    <span className="animate-sparkle">✨</span>
                  </button>

                  {/* Price badge */}
                  <motion.div 
                    className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg z-10"
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-lg font-bold text-accent">{product.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">EGP</span>
                    {/* Discount for Lip Gloss */}
                    {["black-honey", "burgundy", "wine", "mocha", "strawberry-milk"].includes(product.id) && (
                      <>
                        <span className="text-xs sm:text-sm text-muted-foreground line-through ml-2">150 EGP</span>
                        <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ml-2">Save 51 EGP</span>
                      </>
                    )}
                    {/* Discount for Lip Balm */}
                    {product.id === "lip-balm" && (
                      <>
                        <span className="text-xs sm:text-sm text-muted-foreground line-through ml-2">100 EGP</span>
                        <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ml-2">Save 35 EGP</span>
                      </>
                    )}
                    {/* Discount for Lotion & Splash travel Size */}
                    {product.id === "lotion-splash-travel" && (
                      <>
                        <span className="text-xs sm:text-sm text-muted-foreground line-through ml-2">250 EGP</span>
                        <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ml-2">Save 75 EGP</span>
                      </>
                    )}
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-5 md:p-6">

                  {/* Premium badges - below image */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 text-pink-600 dark:text-pink-300 px-2 py-1 rounded-full">
                      <span>💄</span>
                      <span className="font-medium">Premium Quality</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-500 dark:text-red-300 px-2 py-1 rounded-full">
                      <span>💖</span>
                      <span className="font-medium">Made with Love</span>
                    </span>
                  </div>

                  {/* Color indicator & name */}
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <motion.div 
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${product.accent} ring-2 ring-white shadow-lg flex-shrink-0`}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5 line-clamp-2 leading-relaxed">{product.description}</p>

                  {/* Price and Add to Cart */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-accent">{product.price} <span className="text-sm text-muted-foreground">EGP</span></span>
                      {/* Discount for Lip Gloss */}
                      {["black-honey", "burgundy", "wine", "mocha", "strawberry-milk"].includes(product.id) && (
                        <>
                          <span className="text-xs sm:text-sm text-muted-foreground line-through ml-2">150 EGP</span>
                          <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ml-2">Save 51 EGP</span>
                        </>
                      )}
                      {/* Discount for Lip Balm */}
                      {product.id === "lip-balm" && (
                        <>
                          <span className="text-xs sm:text-sm text-muted-foreground line-through ml-2">100 EGP</span>
                          <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ml-2">Save 35 EGP</span>
                        </>
                      )}
                      {/* Discount for Lotion & Splash travel Size */}
                      {product.id === "lotion-splash-travel" && (
                        <>
                          <span className="text-xs sm:text-sm text-muted-foreground line-through ml-2">250 EGP</span>
                          <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ml-2">Save 75 EGP</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button
                        className="w-1/2 bg-accent hover:bg-accent/90 text-white rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 group/btn h-10 sm:h-12 text-xs sm:text-base btn-kawaii animate-glow-soft"
                        size="default"
                        onClick={() => {
                          window.location.href = `/order/${product.id}`
                        }}
                      >
                        <span className="animate-wiggle mr-1">⚡</span>
                        <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                        <span>Order Now</span>
                      </Button>
                      <Button
                        className="w-1/2 bg-accent hover:bg-accent/90 text-white rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 group/btn h-10 sm:h-12 text-xs sm:text-base btn-kawaii animate-glow-soft"
                        size="default"
                        onClick={() => addToCart({
                          ...product,
                          price: product.price,
                          quantity: 1
                        })}
                      >
                        <span className="animate-wiggle mr-1">🛒</span>
                        <ShoppingBag className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                        <span>Add to Cart</span>
                        <span className="ml-1 animate-heart-pop">💖</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
