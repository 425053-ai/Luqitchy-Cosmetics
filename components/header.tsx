"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles } from "lucide-react"

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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18 md:h-22">
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent/30 blur-md group-hover:bg-accent/50 transition-all duration-300 animate-pulse" />
              <Image
                src="/images/logo.jpeg"
                alt="Luqitchy Cosmetics Logo"
                width={52}
                height={52}
                className="relative rounded-full shadow-lg shadow-primary/40 ring-2 ring-primary/30 group-hover:ring-accent/50 transition-all duration-300 group-hover:scale-105 object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl md:text-2xl font-bold gradient-text">Luqitchy</span>
              <span className="block text-xs text-muted-foreground font-medium -mt-1">Cosmetics</span>
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

          <div className="hidden md:flex items-center gap-4">
            <Link href="#products">
              <Button className="relative bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-7 py-5 shadow-lg shadow-accent/40 hover:shadow-xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105 group overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles className="w-4 h-4 mr-2 animate-sparkle" />
                Shop Now
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
              <Link href="#products">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full mt-4 shadow-lg shadow-accent/30 w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Shop Now
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
