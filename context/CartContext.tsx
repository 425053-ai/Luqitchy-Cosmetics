"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { trackEvent } from '@/lib/analytics-client'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  color: string
  shade?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('luqitchy-cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('luqitchy-cart', JSON.stringify(items))
  }, [items])

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id && i.shade === item.shade)
      
      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id && i.shade === item.shade
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      }
      
      return [...currentItems, { ...item, quantity: item.quantity || 1 }]
    })

    // Track add to cart event
    trackEvent('add_to_cart', {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      shade: item.shade,
    })
  }

  const removeFromCart = (id: string) => {
    // Find item to get product details for tracking
    const removedItem = items.find(item => item.id === id)
    
    setItems(currentItems => currentItems.filter(item => item.id !== id))

    // Track remove from cart event
    if (removedItem) {
      trackEvent('remove_from_cart', {
        productId: removedItem.id,
        productName: removedItem.name,
        price: removedItem.price,
        quantity: removedItem.quantity,
        shade: removedItem.shade,
      })
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
      suppressHydrationWarning
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
