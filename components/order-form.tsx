"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingBag, Sparkles, Check, Loader2 } from "lucide-react"

interface OrderFormProps {
  productName: string
  productPrice: string
}

export function OrderForm({ productName, productPrice }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Order Received! 🎉</h3>
        <p className="text-muted-foreground mb-2">
          Thank you for ordering <span className="text-accent font-semibold">{productName}</span>
        </p>
        <p className="text-sm text-muted-foreground">We will contact you soon to confirm your order.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-secondary/50 rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">Product:</span>
          <span className="font-semibold text-foreground">{productName}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">Price:</span>
          <span className="font-semibold text-accent">{productPrice}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Quantity:</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              -
            </button>
            <span className="font-semibold text-foreground w-8 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              +
            </button>
          </div>
        </div>
        <div className="border-t border-border mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Total:</span>
            <span className="font-bold text-xl text-accent">
              EGP {Number.parseInt(productPrice.replace(/[^0-9]/g, "")) * quantity}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-foreground font-medium">
            Full Name <span className="text-accent">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Enter your full name"
            className="mt-2 rounded-xl border-border focus:ring-accent"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-foreground font-medium">
            Phone Number <span className="text-accent">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="Enter your phone number"
            className="mt-2 rounded-xl border-border focus:ring-accent"
          />
        </div>

        <div>
          <Label htmlFor="address" className="text-foreground font-medium">
            Delivery Address <span className="text-accent">*</span>
          </Label>
          <Textarea
            id="address"
            name="address"
            required
            placeholder="Enter your full delivery address"
            className="mt-2 rounded-xl border-border focus:ring-accent min-h-24"
          />
        </div>

        <div>
          <Label htmlFor="notes" className="text-foreground font-medium">
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any special requests or notes..."
            className="mt-2 rounded-xl border-border focus:ring-accent"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full py-6 text-lg font-semibold shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02] group"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Place Order
            <Sparkles className="w-4 h-4 ml-2 animate-sparkle" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">By placing this order, you agree to our policies. 💖</p>
    </form>
  )
}
