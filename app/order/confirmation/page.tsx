import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, MessageCircle, ArrowRight } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-20">✨</div>
        <div className="absolute bottom-32 right-16 text-5xl animate-bounce-rotate opacity-20">💖</div>

        {/* Main card */}
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

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-foreground mb-4">Thank You! 🎉</h1>

          <p className="text-xl text-center text-muted-foreground mb-8 leading-relaxed">
            Your order has been received and is being processed with love. We're thrilled to prepare your Luqitchy
            Cosmetics for you!
          </p>

          {/* Order details section */}
          <div className="bg-secondary/50 rounded-2xl p-6 mb-8 border border-border">
            <h2 className="font-serif text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span>📋</span>
              Order Details
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-bold text-accent">ORD-{Date.now()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-muted-foreground">Status:</span>
                <span className="inline-flex items-center gap-2 bg-green-100/20 text-green-600 px-4 py-1 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                  Processing
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Confirmation Sent:</span>
                <span className="text-foreground font-medium">✓ Check your email</span>
              </div>
            </div>
          </div>

          {/* Communication channels */}
          <div className="space-y-4 mb-8">
            <h2 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span>📞</span>
              Stay Connected
            </h2>

            {/* Email notification */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/30 dark:to-blue-950/10 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30">
              <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-foreground mb-1">Email Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your inbox with all order details. Check your spam folder if you
                  don't see it.
                </p>
              </div>
            </div>

            {/* WhatsApp notification */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-950/30 dark:to-green-950/10 rounded-xl p-4 border border-green-200/50 dark:border-green-800/30">
              <MessageCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-foreground mb-1">WhatsApp Updates</p>
                <p className="text-sm text-muted-foreground">
                  We'll send you order updates and shipping information via WhatsApp. We're here to help!
                </p>
              </div>
            </div>
          </div>

          {/* What's next section */}
          <div className="bg-secondary/30 rounded-xl p-6 mb-8 border border-border">
            <h3 className="font-serif font-bold text-foreground mb-4 flex items-center gap-2">
              <span>⏭️</span>
              What's Next?
            </h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-accent min-w-fit">1.</span>
                <span>You'll receive a confirmation email with your order details</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent min-w-fit">2.</span>
                <span>Our team will prepare your order with love and care</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent min-w-fit">3.</span>
                <span>You'll get tracking info via email and WhatsApp</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent min-w-fit">4.</span>
                <span>Your beautiful Luqitchy Cosmetics will arrive at your doorstep</span>
              </li>
            </ol>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#products" className="flex-1">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full py-6 font-semibold shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02]">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
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

        {/* Footer message */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Made with <span className="text-red-500 animate-heartbeat inline-block">❤️</span> by Lingo for Luqitchy
        </p>
      </div>
    </main>
  )
}
