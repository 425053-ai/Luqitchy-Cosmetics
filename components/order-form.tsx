"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import emailjs from "@emailjs/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

emailjs.init({
  publicKey: "ktl_e7JluBPYFFjM4",
  blockHeadless: false,
  limitRate: {
    id: "app",
    throttle: 50,
  },
})

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

      console.log("[v0] Form submission - Validating fields:", { name, email, phone, address })

      if (!name || !email || !phone || !address) {
        throw new Error("Please fill in all required fields (Name, Email, Phone, Address)")
      }

      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      const totalPrice = Number.parseInt(productPrice.replace(/[^0-9]/g, "")) * quantity

      const orderId = `ORD-${Date.now()}`
      const scentName = selectedScent && scents ? scents.find((s) => s.id === selectedScent)?.name : "Standard"

      console.log("[v0] Attempting to send emails with:", { email, name, totalPrice })

      await emailjs.send("service_cyg3pcs", "template_nq7ayum", {
        to_email: email,
        customer_name: name,
        order_id: orderId,
        product_name: productName,
        quantity: quantity.toString(),
        scent: scentName || "Standard",
        total_price: totalPrice.toString(),
        phone: phone,
        address: address,
        notes: notes || "No special notes",
      })

      console.log("[v0] Customer email sent successfully to:", email)

      await emailjs.send("service_cyg3pcs", "template_nn2n23j", {
        to_email: "luqitchycosmetics@gmail.com",
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        product_name: productName,
        quantity: quantity.toString(),
        scent: scentName || "Standard",
        total_price: totalPrice.toString(),
        delivery_address: address,
        special_notes: notes || "No special notes",
        order_id: orderId,
      })

      console.log("[v0] Admin email sent successfully")

      router.push(`/order/confirmation?order_id=${orderId}`)
    } catch (error: any) {
      console.error("[v0] Error processing order:", error.message)
      alert(`Error: ${error.message || "Order processing failed. Please try again."}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your full name"
          required
          className="focus-visible:ring-accent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          required
          className="focus-visible:ring-accent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
          required
          className="focus-visible:ring-accent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Delivery Address</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="Enter your complete delivery address"
          required
          className="focus-visible:ring-accent min-h-24"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Any special instructions or notes (optional)"
          className="focus-visible:ring-accent min-h-20"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2 rounded-lg transition-all duration-300"
      >
        {isSubmitting ? "Processing Order..." : "Confirm Order"}
      </Button>
    </form>
  )
}
