"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get("order_id") || `ORD-${Date.now()}`
    setOrderId(id)
  }, [searchParams])

  if (!orderId) return <div>Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
      <p className="text-lg">Thank you for your order!</p>
      <p className="mt-2 text-blue-600 font-medium">Your Order ID: {orderId}</p>
    </div>
  )
}
