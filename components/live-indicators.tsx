"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, ShoppingBag, Clock, Flame, Users } from "lucide-react"

// Live viewers indicator for product pages
export function LiveViewers({ productName }: { productName?: string }) {
  const [viewers, setViewers] = useState(0)
  
  useEffect(() => {
    // Random initial viewers
    setViewers(Math.floor(Math.random() * 20) + 5)
    
    // Update viewers periodically
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(3, Math.min(30, prev + change))
      })
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-sm"
    >
      <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full">
        <Eye className="w-4 h-4" />
        <span className="font-semibold">{viewers}</span>
        <span className="hidden sm:inline">watching now</span>
      </div>
    </motion.div>
  )
}

// Stock indicator
export function StockIndicator({ stock = 10 }: { stock?: number }) {
  const isLow = stock <= 5
  const percentage = Math.min(100, (stock / 20) * 100)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className={`flex items-center gap-1 ${isLow ? 'text-orange-500' : 'text-green-500'}`}>
          {isLow ? (
            <>
              <Flame className="w-4 h-4 animate-pulse" />
              <span className="font-semibold">Only {stock} left!</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>In Stock</span>
            </>
          )}
        </span>
      </div>
      {isLow && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
          />
        </div>
      )}
    </div>
  )
}

// Recent purchase notification
export function RecentPurchaseNotification() {
  const [show, setShow] = useState(false)
  const [purchase, setPurchase] = useState({
    name: "",
    product: "",
    location: "",
    time: ""
  })

  const names = ["Sara", "Nour", "Mariam", "Yasmin", "Hana", "Layla", "Aya", "Fatma", "Mona", "Dina"]
  const products = ["Black Honey Lip Gloss", "Burgundy Lip Gloss", "Strawberry Milk", "Body Lotion", "Wine Lip Gloss", "Mocha Lip Gloss"]
  const locations = ["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta", "Aswan", "Luxor"]
  const times = ["Just now", "2 mins ago", "5 mins ago", "10 mins ago"]

  useEffect(() => {
    const showNotification = () => {
      setPurchase({
        name: names[Math.floor(Math.random() * names.length)],
        product: products[Math.floor(Math.random() * products.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        time: times[Math.floor(Math.random() * times.length)]
      })
      setShow(true)
      
      setTimeout(() => setShow(false), 5000)
    }

    // Show first notification after 10 seconds
    const initialTimer = setTimeout(showNotification, 10000)
    
    // Then show every 30-60 seconds
    const interval = setInterval(() => {
      showNotification()
    }, Math.random() * 30000 + 30000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed bottom-24 left-4 z-40 max-w-xs"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                🛍️
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {purchase.name} from {purchase.location}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  just purchased <span className="text-pink-500 font-medium">{purchase.product}</span>
                </p>
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {purchase.time}
                </p>
              </div>
              <button
                onClick={() => setShow(false)}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Trending badge
export function TrendingBadge() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-2 -right-2 z-10"
    >
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
        <Flame className="w-3 h-3" />
        TRENDING
      </div>
    </motion.div>
  )
}

// Visitors count
export function VisitorsCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(Math.floor(Math.random() * 500) + 1200)
    
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 5))
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Users className="w-4 h-4" />
      <span><strong>{count.toLocaleString()}</strong> people visited today</span>
    </div>
  )
}

// Sold count badge
export function SoldCount({ count = 150 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <ShoppingBag className="w-3 h-3" />
      <span>{count}+ sold</span>
    </div>
  )
}
