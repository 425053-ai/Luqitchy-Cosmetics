import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, MessageCircle, ArrowRight } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-2xl">
        {/* Animated background elements - hidden on mobile */}
        <div className="hidden sm:block absolute top-20 left-10 text-4xl md:text-6xl animate-float opacity-20">✨</div>
        <div className="hidden sm:block absolute bottom-32 right-16 text-3xl md:text-5xl animate-bounce-rotate opacity-20">💖</div>

        {/* Main card */}
        <div className="relative bg-card rounded-2xl sm:rounded-3xl border-2 border-primary/30 p-4 sm:p-6 md:p-8 lg:p-12 shadow-xl sm:shadow-2xl shadow-primary/20 backdrop-blur-sm">
          {/* Success icon */}
          <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 animate-pulse" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-400 to-accent rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-center text-foreground mb-2 sm:mb-4">Thank You! 🎉</h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-muted-foreground mb-4 sm:mb-6 md:mb-8 leading-relaxed px-2">
            Your order has been received and is being processed with love. We're thrilled to prepare your Luqitchy
            Cosmetics for you!
          </p>

          {/* Order details section */}
          <div className="bg-secondary/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-border">
            <h2 className="font-serif text-base sm:text-lg md:text-xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
              <span>📋</span>
              Order Details
            </h2>

            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2 sm:pb-3 md:pb-4 border-b border-border/50 gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-muted-foreground">Order ID:</span>
                <span className="font-mono font-bold text-accent text-xs sm:text-sm md:text-base break-all">ORD-{Date.now()}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2 sm:pb-3 md:pb-4 border-b border-border/50 gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-muted-foreground">Status:</span>
                <span className="inline-flex items-center gap-2 bg-green-100/20 text-green-600 px-2 sm:px-3 md:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold w-fit">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full animate-pulse" />
                  Processing
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-muted-foreground">Confirmation Sent:</span>
                <span className="text-foreground font-medium text-xs sm:text-sm">✓ Check your email</span>
              </div>
            </div>
          </div>

          {/* Communication channels */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 md:mb-8">
            <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-4 flex items-center gap-2">
              <span>📞</span>
              Stay Connected
            </h2>

            {/* Email notification */}
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/30 dark:to-blue-950/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200/50 dark:border-blue-800/30">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">Email Confirmation</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  A confirmation email has been sent to your inbox with all order details. Check your spam folder if you
                  don't see it.
                </p>
              </div>
            </div>

            {/* WhatsApp notification */}
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-950/30 dark:to-green-950/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200/50 dark:border-green-800/30">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">WhatsApp Updates</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  We'll send you order updates and shipping information via WhatsApp. We're here to help!
                </p>
              </div>
            </div>
          </div>

          {/* What's next section */}
          <div className="bg-secondary/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-border">
            <h3 className="font-serif font-bold text-foreground mb-2 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span>⏭️</span>
              What's Next?
            </h3>
            <ol className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li className="flex gap-2 sm:gap-3">
                <span className="font-bold text-accent min-w-fit">1.</span>
                <span>You'll receive a confirmation email with your order details</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="font-bold text-accent min-w-fit">2.</span>
                <span>Our team will prepare your order with love and care</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="font-bold text-accent min-w-fit">3.</span>
                <span>You'll get tracking info via email and WhatsApp</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="font-bold text-accent min-w-fit">4.</span>
                <span>Your beautiful Luqitchy Cosmetics will arrive at your doorstep</span>
              </li>
            </ol>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:gap-4 justify-center">
            <Link href="/#products" className="w-full">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full py-4 sm:py-5 md:py-6 font-semibold shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button
                variant="outline"
                className="w-full rounded-full py-4 sm:py-5 md:py-6 font-semibold border-2 border-primary/30 hover:border-primary/60 transition-colors duration-300 bg-transparent text-sm sm:text-base"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer message */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 md:mt-8">
          Made with <span className="text-red-500 animate-heartbeat inline-block">❤️</span> by Lingo for Luqitchy
        </p>
      </div>
    </main>
  )
}
