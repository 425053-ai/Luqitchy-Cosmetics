"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, MessageCircle, ArrowRight } from "lucide-react"

export default function ConfirmationPage() {
  const params = useSearchParams()
  const orderId = params.get("orderId") || "N/A"
  const product = params.get("product") || "N/A"
  const quantity = params.get("quantity") || "N/A"
  const scent = params.get("scent") || "N/A"
  const total = params.get("total") || "N/A"

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl relative">

        {/* Animated background */}
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-20">✨</div>
        <div className="absolute bottom-32 right-16 text-5xl animate-bounce-rotate opacity-20">💖</div>

        {/* Card */}
        <div className="relative bg-card rounded-3xl border-2 border-primary/30 p-8 md:p-12 shadow-2xl shadow-primary/20 backdrop-blur-sm">

          {/* Success icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full w-32 h-32 animate-pulse" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-green-400 to-accent rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-foreground mb-4">Thank You! 🎉</h1>
          <p className="text-xl text-center text-muted-foreground mb-8 leading-relaxed">
            Your order has been received and is being processed with love. We're thrilled to prepare your Luqitchy Cosmetics for you!
          </p>

          {/* Order Details */}
          <div className="bg-secondary/50 rounded-2xl p-6 mb-8 border border-border">
            <h2 className="font-serif text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span>📋</span>
              Order Details
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-bold text-accent">{orderId}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Product:</span>
                <span className="text-foreground font-medium">{product}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Variant / Scent:</span>
                <span className="text-foreground font-medium">{scent}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="text-foreground font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-bold text-accent">{total} EGP</span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl p-4 border border-blue-200/50">
              <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-foreground mb-1">Email Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your inbox with all order details. Check your spam folder if you don't see it.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-gradient-to-r from-green-50 to-green-50/50 rounded-xl p-4 border border-green-200/50">
              <MessageCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-foreground mb-1">WhatsApp Updates</p>
                <p className="text-sm text-muted-foreground">
                  We'll send you order updates and shipping information via WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#products" className="flex-1">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full py-6 font-semibold shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02]">
                Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full rounded-full py-6 font-semibold border-2 border-primary/30 hover:border-primary/60 transition-colors duration-300 bg-transparent"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Made with <span className="text-red-500 animate-heartbeat inline-block">❤️</span> by Lingo for Luqitchy
        </p>
      </div>
    </main>
  )
}
