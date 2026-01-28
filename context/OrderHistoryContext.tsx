"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  orderId: string
  items: OrderItem[]
  totalPrice: number
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  orderDate: string
  status: "pending" | "confirmed" | "shipped" | "delivered"
}

interface OrderHistoryContextType {
  orders: Order[]
  addOrder: (order: Order) => void
  clearHistory: () => void
  getOrderById: (orderId: string) => Order | undefined
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(undefined)

export function OrderHistoryProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem("luqitchy-order-history")
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders))
      } catch (e) {
        console.error("Failed to parse order history:", e)
      }
    }
  }, [])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("luqitchy-order-history", JSON.stringify(orders))
  }, [orders])

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev])
  }

  const clearHistory = () => {
    setOrders([])
  }

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.orderId === orderId)
  }

  return (
    <OrderHistoryContext.Provider value={{ orders, addOrder, clearHistory, getOrderById }}>
      {children}
    </OrderHistoryContext.Provider>
  )
}

export function useOrderHistory() {
  const context = useContext(OrderHistoryContext)
  if (context === undefined) {
    throw new Error("useOrderHistory must be used within an OrderHistoryProvider")
  }
  return context
}
