"use client"

import { useOrderHistory } from "@/context/OrderHistoryContext"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Package, Calendar, MapPin, ArrowLeft, ShoppingBag, Trash2 } from "lucide-react"

export default function OrderHistoryPage() {
  const { orders, clearHistory } = useOrderHistory()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "confirmed":
        return "Confirmed"
      case "shipped":
        return "Shipped"
      case "delivered":
        return "Delivered"
      default:
        return status
    }
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
              <Package className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Order History
            </h1>
            <p className="text-muted-foreground">
              Track your previous orders and their status
            </p>
          </div>

          {orders.length === 0 ? (
            /* Empty State */
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t placed any orders yet. Browse our products and order now!
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
              {/* Clear History Button */}
              <div className="flex justify-end mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              </div>

              {/* Orders List */}
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="p-4 sm:p-6 border-b border-border bg-muted/30">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                          <p className="font-mono font-semibold text-foreground">{order.orderId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(order.orderDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 sm:p-6">
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} × {item.price} EGP
                              </p>
                            </div>
                            <p className="font-semibold text-accent">
                              {item.quantity * item.price} EGP
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="mt-6 pt-4 border-t border-border">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate max-w-[200px]">{order.deliveryAddress}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-xl font-bold text-accent">{order.totalPrice} EGP</p>
                          </div>
                        </div>
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
