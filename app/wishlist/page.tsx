"use client"

import { useWishlist } from "@/context/WishlistContext"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/components/ui/toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Heart, ArrowLeft, ShoppingBag, Trash2, X } from "lucide-react"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const handleAddToCart = (item: typeof wishlist[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      color: item.color,
      quantity: 1,
    })
    showToast(`${item.name} added to cart! 🛒`, "cart")
  }

  const handleRemove = (id: string, name: string) => {
    removeFromWishlist(id)
    showToast(`${name} removed from wishlist`, "info")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-secondary via-background to-background">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              Save your favorite products and order them anytime
            </p>
          </div>

          {wishlist.length === 0 ? (
            /* Empty State */
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t added any products yet. Click the heart ❤️ to add a product.
              </p>
              <Link href="/#products">
                <Button className="luxury-btn rounded-full px-8">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Clear Wishlist Button */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  {wishlist.length} {wishlist.length === 1 ? "product" : "products"} in wishlist
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearWishlist}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-md"
                        aria-label={`Remove ${item.name} from wishlist`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-accent mb-4">
                        {item.price} EGP
                      </p>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 luxury-btn rounded-xl"
                          size="sm"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Link href={`/order/${item.id}`} className="flex-1">
                          <Button variant="outline" className="w-full rounded-xl" size="sm">
                            Order Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
