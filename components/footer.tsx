import Image from "next/image"
import { Heart, Instagram, Sparkles, Mail, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-foreground text-background py-12 sm:py-16 md:py-24 relative overflow-hidden" role="contentinfo">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="hidden sm:block absolute top-10 left-10 text-4xl md:text-6xl animate-float-rotate">✨</div>
        <div className="hidden sm:block absolute top-20 right-20 text-3xl md:text-5xl animate-dance">💄</div>
        <div className="hidden md:block absolute bottom-10 left-1/3 text-4xl animate-heart-pop">💖</div>
        <div className="hidden md:block absolute top-1/2 right-1/4 text-3xl animate-kawaii-bounce">🧴</div>
        <div className="hidden lg:block absolute top-1/4 left-1/4 text-2xl animate-sparkle-burst">🌟</div>
        <div className="hidden lg:block absolute bottom-1/4 right-1/3 text-3xl animate-star-twirl">⭐</div>
        <div className="hidden xl:block absolute top-2/3 left-10 text-2xl animate-wiggle">🎀</div>
        <div className="hidden xl:block absolute bottom-20 right-10 text-2xl animate-glitter">💕</div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 text-center md:text-left lg:col-span-1">
            <div className="flex items-center gap-3 sm:gap-4 justify-center md:justify-start mb-4 sm:mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-glow-soft" />
                <Image
                  src="/images/logo.jpeg"
                  alt="Luqitchy Cosmetics"
                  width={60}
                  height={60}
                  className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-[60px] md:h-[60px] rounded-full ring-2 ring-primary/50 object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-1 -right-1 text-sm animate-sparkle">✨</span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold block">Luqitchy</span>
                <span className="text-xs sm:text-sm text-background/60">Cosmetics <span className="animate-heart-pop inline-block">💖</span></span>
              </div>
            </div>
            <p className="text-background/80 mb-2 sm:mb-3 font-medium text-sm sm:text-base">
              <span className="animate-sparkle inline-block mr-1">✨</span>
              Highlight Your Beauty With Our Touches
              <span className="animate-heart-pop inline-block ml-1">💕</span>
            </p>
            <p className="text-xs sm:text-sm text-background/50 leading-relaxed">
              Premium cosmetics collection featuring 5 lip gloss shades, nourishing lip balm, and luxurious body care bundles.
              <span className="inline-block animate-float ml-1">🌸</span>
            </p>
          </div>

          {/* Products Column */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2">
              Our Products
              <span className="text-sm sm:text-base animate-dance">💄</span>
              <span className="text-sm animate-sparkle">✨</span>
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {[
                { name: "Black Honey", href: "/order/black-honey" },
                { name: "Burgundy", href: "/order/burgundy" },
                { name: "Wine", href: "/order/wine" },
                { name: "Mocha", href: "/order/mocha" },
                { name: "Strawberry Milk", href: "/order/strawberry-milk" },
                { name: "Lip Balm", href: "/order/lip-balm" },
                { name: "Body Lotion Bundles", href: "/#products" },
              ].map((product) => (
                <li key={product.name}>
                  <Link
                    href={product.href}
                    className="text-background/60 hover:text-primary transition-colors inline-flex items-center gap-1.5 sm:gap-2 group"
                  >
                    <span className="hidden sm:block w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300" />
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2">
              Quick Links
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-sparkle-burst" />
              <span className="text-sm animate-star-twirl">🌟</span>
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                {[
                  { name: "Our Products", href: "#products" },
                  { name: "About Us", href: "#about" },
                  { name: "Why Choose Us", href: "#about" },
                  { name: "Policies", href: "#policies" },
                  { name: "FAQ", href: "#faq" },
                  { name: "Shopping Cart", href: "/cart" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-background/60 hover:text-primary transition-colors inline-flex items-center gap-1.5 sm:gap-2 group"
                    >
                      <span className="hidden sm:block w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Follow Us Column */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2">
              Follow Us
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-heart-pop" />
              <span className="text-sm animate-kawaii-bounce">💕</span>
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <li>
                <a
                  href="https://www.instagram.com/luqitchyglossy?igsh=OWNlcnFqMmttMWhw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start text-background/60 hover:text-primary transition-colors group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 animate-glow-soft">
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-dance" />
                  </div>
                  <div>
                    <span className="block font-medium text-background/80 group-hover:text-primary text-xs sm:text-sm">Instagram</span>
                    <span className="text-[10px] sm:text-xs text-background/50">@luqitchyglossy</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@luqitchyglossy3?_r=1&_t=ZS-92uEz8OxLJh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start text-background/60 hover:text-primary transition-colors group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-black via-gray-800 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 animate-glow-soft">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-white animate-wiggle"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.26 6.26 0 0 0-1-.08A6.25 6.25 0 1 0 16.25 12c0-.17 0-.34-.02-.51A4.18 4.18 0 0 0 19.59 6.69Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-medium text-background/80 group-hover:text-primary text-xs sm:text-sm">TikTok</span>
                    <span className="text-[10px] sm:text-xs text-background/50">@luqitchyglossy3</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center justify-center sm:justify-start gap-2">
              Contact Info
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-sparkle" />
              <span className="text-sm animate-wiggle">📞</span>
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <li className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-background/10 rounded-full flex items-center justify-center flex-shrink-0 animate-glow-soft">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-float" />
                </div>
                <span className="text-background/60">Egypt</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-background/10 rounded-full flex items-center justify-center flex-shrink-0 animate-glow-soft">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-wiggle" />
                </div>
                <span className="text-background/60">24-48h Delivery</span>
              </li>
            </ul>
            
            {/* Trust Badge */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-background/5 rounded-lg sm:rounded-xl border border-background/10">
              {/* Cruelty-Free and Premium Quality removed as per request */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Made with love by Lingo removed as per request */}
            <p className="text-[10px] sm:text-xs text-background/40 flex items-center gap-1 flex-wrap justify-center md:justify-start">
              © {currentYear} Luqitchy Cosmetics. All rights reserved.
              <span className="animate-glitter">✨</span>
              <span className="animate-heart-pop">💖</span>
              <span className="mx-2">|</span>
              <span className="text-background/60">Made with <span className="animate-heart-pop">💖</span> by <span className="font-bold">Lingo</span> for <span className="font-bold">Luqitchy</span> <span className="animate-sparkle">✨</span></span>
            </p>
          </div>
          
          {/* Contact with LINGO */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-background/10 text-center">
            <p className="text-[10px] sm:text-xs text-background/50 mb-2 sm:mb-3 flex items-center justify-center gap-1">
              <span className="animate-sparkle">✨</span>
              Want a website like this?
              <span className="animate-sparkle">✨</span>
            </p>
            <a
              href="https://wa.me/201220293461"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all hover:scale-105 btn-kawaii"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact with LINGO
              <span className="animate-sparkle">💬</span>
            </a>
          </div>
        </div>

        {/* Made with love section removed as per request */}
      </div>
    </footer>
  )
}
