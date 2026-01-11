import Image from "next/image"
import { Heart, Instagram, Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 md:py-20 relative overflow-hidden" role="contentinfo">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">✨</div>
        <div className="absolute top-20 right-20 text-5xl">💄</div>
        <div className="absolute bottom-10 left-1/3 text-4xl">💖</div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-md" />
                <Image
                  src="/images/logo.jpeg"
                  alt="Luqitchy Cosmetics"
                  width={60}
                  height={60}
                  className="relative rounded-full ring-2 ring-primary/50 object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold block">Luqitchy</span>
                <span className="text-sm text-background/60">Cosmetics</span>
              </div>
            </div>
            <p className="text-background/80 mb-3 font-medium">Highlight Your Beauty With Our Touches</p>
            <p className="text-sm text-background/50 leading-relaxed">
              High-end quality cosmetics for the modern, confident you.
            </p>
          </div>

          <div className="text-center">
            <h3 className="font-serif text-xl font-bold mb-6 flex items-center justify-center gap-2">
              Quick Links
              <Sparkles className="w-4 h-4 text-primary" />
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {["Products", "About", "Policies", "FAQ"].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-background/70 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300" />
                      {link === "Products" ? "Our Products" : link === "About" ? "About Us" : link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="text-center md:text-right">
            <h3 className="font-serif text-xl font-bold mb-6 flex items-center justify-center md:justify-end gap-2">
              Follow Us
              <Heart className="w-4 h-4 text-primary animate-heartbeat" />
            </h3>
            <div className="flex gap-4 justify-center md:justify-end mb-6">
              <a
                href="https://www.instagram.com/luqitchyglossy?igsh=OWNlcnFqMmttMWhw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-foreground hover:scale-110 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:animate-wiggle" />
              </a>
              <a
                href="https://www.tiktok.com/@luqitchyglossy3?_r=1&_t=ZS-92uEz8OxLJh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-foreground hover:scale-110 transition-all duration-300 group"
                aria-label="TikTok"
              >
                <svg
                  className="w-5 h-5 group-hover:animate-wiggle fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.26 6.26 0 0 0-1-.08A6.25 6.25 0 1 0 16.25 12c0-.17 0-.34-.02-.51A4.18 4.18 0 0 0 19.59 6.69Z" />
                </svg>
              </a>
            </div>
            <p className="text-sm text-background/50">Beauty & Cosmetics</p>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center">
          <p className="text-sm text-background/60 flex items-center justify-center gap-2">
            Made with <span className="text-red-500 animate-heartbeat inline-block">❤️</span> by Lingo for Luqitchy
          </p>
          <p className="text-xs text-background/40 mt-3">
            © {new Date().getFullYear()} Luqitchy. All rights reserved. ✨
          </p>
        </div>
      </div>
    </footer>
  )
}
