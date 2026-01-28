import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search, ShoppingBag } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-secondary via-background to-background">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 404 Display */}
        <div className="relative">
          <span className="text-[150px] md:text-[200px] font-serif font-bold text-accent/10 leading-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-2">
              <span className="text-5xl">💄</span>
              <p className="text-lg font-semibold text-foreground">Page Not Found</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Oops! This page has vanished
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Like your favorite lip gloss shade, this page seems to have disappeared. 
            Let&apos;s help you find what you&apos;re looking for!
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center gap-4 text-2xl">
          <span className="animate-float">💋</span>
          <span className="animate-sparkle">✨</span>
          <span className="animate-heartbeat">💖</span>
          <span className="animate-bounce-rotate">🎀</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button
              size="lg"
              className="gap-2 rounded-full px-8 w-full sm:w-auto luxury-btn"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
          <Link href="/#products">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-full px-8 w-full sm:w-auto"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Popular pages you might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { name: "Black Honey", href: "/order/black-honey" },
              { name: "Burgundy", href: "/order/burgundy" },
              { name: "Strawberry Milk", href: "/order/strawberry-milk" },
              { name: "Lip Balm", href: "/order/lip-balm" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm bg-card hover:bg-accent/10 rounded-full border border-border hover:border-accent/30 transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Go Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </Link>
      </div>
    </div>
  )
}
