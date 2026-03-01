"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles, ShoppingCart, Heart, Package } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import { QuickSearch } from "@/components/quick-search"

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Policies", href: "#policies" },
  { label: "FAQ", href: "#faq" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoTapCount, setLogoTapCount] = useState(0)
  const [logoTapTimer, setLogoTapTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()

  const handleLogoTap = () => {
    const nextCount = logoTapCount + 1
    setLogoTapCount(nextCount)

    if (logoTapTimer) {
      clearTimeout(logoTapTimer)
    }

    if (nextCount >= 5) {
      setLogoTapCount(0)
      router.push('/admin-access')
      return
    }

    const timer = setTimeout(() => {
      setLogoTapCount(0)
    }, 2000)

    setLogoTapTimer(timer)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl shadow-lg shadow-primary/10 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-22">
          <a href="#hero" onClick={handleLogoTap} className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent/30 blur-md group-hover:bg-accent/50 transition-all duration-300 animate-pulse" />
              <Image
                src="/images/logo.jpeg"
                alt="Luqitchy Cosmetics Logo"
                width={52}
                height={52}
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg shadow-primary/40 ring-2 ring-primary/30 group-hover:ring-accent/50 transition-all duration-300 group-hover:scale-105 object-cover"
              />
              <span className="absolute -top-1 -right-1 text-sm animate-sparkle">✨</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-lg sm:text-xl md:text-2xl font-bold gradient-text">Luqitchy</span>
              <span className="block text-[10px] sm:text-xs text-muted-foreground font-medium -mt-1">Cosmetics <span className="animate-heart-pop inline-block">💖</span></span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-muted-foreground hover:text-accent transition-colors font-medium group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent rounded-full group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <QuickSearch />
            {/* Wishlist Button */}
            <Link href="/wishlist" className="relative group">
              <Button variant="outline" size="icon" className="relative h-11 w-11 rounded-full hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 transition-all hover:scale-105 group-hover:animate-cute-wiggle">
                <Heart className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            {/* Orders History Button */}
            <Link href="/orders" className="relative">
              <Button variant="outline" size="icon" className="relative h-11 w-11 rounded-full hover:bg-accent/10 hover:border-accent transition-all hover:scale-105">
                <Package className="w-5 h-5" />
              </Button>
            </Link>
            {/* Cart Button - Direct link to cart page */}
            <Link href="/cart" className="relative group">
              <Button variant="outline" size="icon" className="relative h-11 w-11 rounded-full hover:bg-accent/10 hover:border-accent transition-all hover:scale-105 group-hover:animate-cute-wiggle">
                <ShoppingCart className="w-5 h-5 group-hover:text-accent transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-bounce">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="#products">
              <Button className="relative bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-7 py-5 shadow-lg shadow-accent/40 hover:shadow-xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105 group overflow-hidden btn-kawaii animate-glow-soft">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="animate-sparkle-burst mr-1">✨</span>
                <Sparkles className="w-4 h-4 mr-2 animate-sparkle" />
                Shop Now
                <span className="animate-heart-pop ml-1">💖</span>
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative md:hidden">
              <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full hover:bg-accent/10 hover:border-accent">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-bounce">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <button
              className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav
            className="md:hidden py-6 border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in-up"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-accent hover:bg-secondary/50 transition-all font-medium py-3 px-4 rounded-xl"
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.label}
                </a>
              ))}
              <Link href="/cart" className="w-full" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full mt-2 border-2 hover:bg-accent/10 hover:border-accent flex items-center justify-center gap-2 text-sm sm:text-base">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Button>
              </Link>
              <Link href="/wishlist" className="w-full" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full mt-2 border-2 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Button>
              </Link>
              <Link href="/orders" className="w-full" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full mt-2 border-2 hover:bg-accent/10 hover:border-accent flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  My Orders
                </Button>
              </Link>
              <Link href="#products" onClick={() => setIsOpen(false)}>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full mt-3 sm:mt-4 shadow-lg shadow-accent/30 w-full text-sm sm:text-base btn-kawaii">
                  <span className="animate-sparkle mr-1">✨</span>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Shop Now
                  <span className="animate-heart-pop ml-1">💖</span>
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
