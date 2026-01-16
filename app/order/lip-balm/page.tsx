"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import emailjs from "@emailjs/browser"
import { ArrowLeft, Star } from "lucide-react"
import { useRouter } from "next/navigation"

emailjs.init({
  publicKey: "ktl_e7JluBPYFFjM4",
  blockHeadless: false,
  limitRate: {
    id: "app",
    throttle: 50,
  },
})

const product = {
  id: "lip-balm",
  name: "LipBalm",
  image: "/images/lip-balm.jpeg",
  price: 100,
  features: ["Moisturizing formula", "Natural ingredients", "Subtle shine", "Portable size"],
}

export default function LipBalmPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    quantity: 1,
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const totalPrice = formData.quantity * product.price
      const orderId = `ORD-${Date.now()}`

      const templateData = {
        to_email: formData.email,
        customer_name: formData.name,
        order_id: orderId,
        product_name: product.name,
        quantity: formData.quantity.toString(),
        total_price: totalPrice.toString(),
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes || "No special notes",
      }

      // Send email to customer
      await emailjs.send("service_cyg3pcs", "template_nq7ayum", templateData)

      // Send email to admin
      await emailjs.send("service_cyg3pcs", "template_nn2n23j", {
        to_email: "luqitchycosmetics@gmail.com",
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        product_name: product.name,
        quantity: formData.quantity.toString(),
        total_price: totalPrice.toString(),
        delivery_address: formData.address,
        special_notes: formData.notes || "No special notes",
        order_id: orderId,
      })

      router.push(`/order/confirmation?order_id=${orderId}&product=${product.name}&total=${totalPrice}`)
    } catch (error: any) {
      console.error("[v0] Error processing order:", error)
      alert("Error: " + (error.message || "Order processing failed. Please try again."))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Link
        href="/"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-center gap-2 text-muted-foreground hover:text-accent mb-6"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Products
      </Link>

      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-primary/30">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <div className="text-2xl font-bold text-accent">{product.price} EGP</div>
          <ul className="grid grid-cols-2 gap-2">
            {product.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-accent fill-accent" /> {f}
              </li>
            ))}
          </ul>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Address *</label>
              <textarea
                name="address"
                placeholder="Enter your complete delivery address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent min-h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                min={1}
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes</label>
              <textarea
                name="notes"
                placeholder="Any special instructions (optional)"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent min-h-20"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Processing Order..." : "Confirm Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
