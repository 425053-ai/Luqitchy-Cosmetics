"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const products = [
  { id: "black-honey", name: "Black Honey", price: 99, image: "/images/black-honey.jpeg", category: "Lip Gloss" },
  { id: "burgundy", name: "Burgundy", price: 99, image: "/images/burgundy.jpeg", category: "Lip Gloss" },
  { id: "wine", name: "Wine", price: 99, image: "/images/wine.jpeg", category: "Lip Gloss" },
  { id: "mocha", name: "Mocha", price: 99, image: "/images/mocha.jpeg", category: "Lip Gloss" },
  { id: "strawberry-milk", name: "Strawberry Milk", price: 100, image: "/images/strawberry-milk.jpeg", category: "Lip Gloss" },
  { id: "lip-balm", name: "Lip Balm", price: 100, image: "/images/lip-balm.jpeg", category: "Lip Care" },
]

export function QuickSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  // Keyboard shortcut to open search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all group border border-border/50"
        aria-label="Search products"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-background rounded border border-border text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
        aria-label="Search products"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div
            ref={containerRef}
            className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden animate-slide-up"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Start typing to search products...</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {["Lip Gloss", "Lip Balm", "Body Lotion"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 text-xs bg-muted rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <p>No products found for "{query}"</p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/order/${product.id}`}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery("")
                      }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate group-hover:text-accent transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-accent">{product.price} EGP</p>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all ml-auto" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
              <span>{filteredProducts.length} products found</span>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 bg-background rounded border border-border">ESC</kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
