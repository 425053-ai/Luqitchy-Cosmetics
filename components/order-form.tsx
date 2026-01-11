"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import emailjs from "emailjs-com"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingBag, Sparkles, Loader2 } from "lucide-react"

emailjs.init("ktl_e7JluBPYFFjM4")

interface Scent {
  id: string
  name: string
  description: string
}

interface OrderFormProps {
  productName: string
  productPrice: string
  scents?: Scent[]
}

export function OrderForm({ productName, productPrice, scents }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedScent, setSelectedScent] = useState<string>(scents?.[0]?.id || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      const name = String(formData.get("name") || "").trim()
      const phone = String(formData.get("phone") || "").trim()
      const email = String(formData.get("email") || "").trim()
      const address = String(formData.get("address") || "").trim()
      const notes = String(formData.get("notes") || "").trim()

      if (!name || !email || !phone || !address) {
        throw new Error("Missing required fields")
      }

      const totalPrice =
        Number.parseInt(productPrice.replace(/[^0-9]/g, "")) * quantity

      const orderId = `ORD-${Date.now()}`
      const scent =
        selectedScent && scents
          ? scents.find((s) => s.id === selectedScent)?.name
          : "N/A"

      // ✅ CUSTOMER EMAIL
      await emailjs.send("service_cyg3pcs", "template_nq7ayum", {
        email, // ✅ REQUIRED BY EMAILJS
        customer_name: name,
        order_id: orderId,
        product_name: productName,
        quantity: quantity.toString(),
        scent,
        total_price: totalPrice.toString(),
        phone,
        address,
      })

      // ✅ ADMIN EMAIL
      await emailjs.send("service_cyg3pcs", "template_nn2n23j", {
        email: "luqitchycosmetics@gmail.com", // ✅ REQUIRED
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        product_name: productName,
        quantity: quantity.toString(),
        scent,
        total_price: totalPrice.toString(),
        delivery_address: address,
        special_notes: notes,
        order_id: orderId,
      })

      router.push("/order/confirmation")
    } catch (error) {
      console.error("Error processing order:", error)
      alert("Order failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input name="name" placeholder="Full Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="phone" placeholder="Phone" required />
      <Textarea name="address" placeholder="Delivery Address" required />
      <Textarea name="notes" placeholder="Notes (optional)" />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Place Order"}
      </Button>
    </form>
  )
}
