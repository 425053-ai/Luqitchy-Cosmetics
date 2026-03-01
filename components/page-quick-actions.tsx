"use client"

import Link from "next/link"
import { Heart, Package, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import { useOrderHistory } from "@/context/OrderHistoryContext"

export function PageQuickActions() {
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const { orders } = useOrderHistory()

  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[60] flex items-center gap-2 rounded-full border border-border/60 bg-card/85 backdrop-blur-md p-1.5 shadow-lg">
      <Link href="/wishlist" className="relative">
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20"
          aria-label="Wishlist"
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
              {wishlistCount}
            </span>
          )}
        </Button>
      </Link>

      <Link href="/orders" className="relative">
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-accent/10 hover:border-accent"
          aria-label="My orders"
        >
          <Package className="w-4 h-4 sm:w-5 sm:h-5" />
          {orders.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
              {orders.length}
            </span>
          )}
        </Button>
      </Link>

      <Link href="/cart" className="relative">
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-accent/10 hover:border-accent"
          aria-label="Cart"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
              {totalItems}
            </span>
          )}
        </Button>
      </Link>
    </div>
  )
}
