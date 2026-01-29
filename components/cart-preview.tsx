"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, X, Minus, Plus, Trash2, ShoppingCart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"

export function CartPreview() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()
  
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Animate when item added
  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
  }, [itemCount])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all duration-300 hover:bg-primary/10 group ${
          isAnimating ? 'animate-add-success' : ''
        }`}
        aria-label="Shopping cart"
      >
        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:text-primary transition-colors" />
        
        {/* Item count badge */}
        {itemCount > 0 && (
          <span className={`absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-lg ${
            isAnimating ? 'animate-kawaii-bounce' : ''
          }`}>
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}

        {/* Sparkle effect on hover */}
        <Sparkles className="absolute -top-2 -right-2 w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card/95 backdrop-blur-xl rounded-2xl border-2 border-primary/20 shadow-2xl shadow-primary/10 z-50 overflow-hidden transform origin-top-right animate-in slide-in-from-top-2 fade-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h3 className="font-serif font-bold text-foreground">
                Your Cart ✨
              </h3>
              <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full font-semibold">
                {itemCount} items
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-secondary/50 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-80 overflow-y-auto px-4 py-3 space-y-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">Your cart is empty 🛒</p>
                <p className="text-muted-foreground/70 text-xs mt-1">Start adding some cute products!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex gap-3 p-2 rounded-xl hover:bg-secondary/30 transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary/50 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {item.name}
                    </h4>
                    {item.shade && (
                      <p className="text-xs text-muted-foreground truncate">
                        Shade: {item.shade}
                      </p>
                    )}
                    <p className="text-sm font-bold text-accent mt-1">
                      {item.price} EGP
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-1 bg-secondary/50 rounded-full p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-border/50 px-4 py-4 bg-secondary/20">
              {/* Total */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Subtotal:</span>
                <span className="font-bold text-lg text-foreground">
                  {getCartTotal()} EGP
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link href="/cart" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-2 border-primary/30 hover:border-primary/60 transition-all text-sm"
                  >
                    View Cart 🛒
                  </Button>
                </Link>
                <Link href="/cart" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button className="w-full rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30 text-sm animate-glow-pulse">
                    Checkout ✨
                  </Button>
                </Link>
              </div>

              {/* Free shipping notice */}
              <div className="mt-3 text-center">
                {getCartTotal() >= 500 ? (
                  <p className="text-xs text-green-600 font-medium">
                    🎉 You qualify for FREE shipping!
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Add {500 - getCartTotal()} EGP more for FREE shipping 🚚
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
