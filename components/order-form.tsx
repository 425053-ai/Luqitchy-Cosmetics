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
      const name = formData.get("name") as string
      const phone = formData.get("phone") as string
      const email = formData.get("email") as string
      const address = formData.get("address") as string
      const notes = formData.get("notes") as string
      const totalPrice = Number.parseInt(productPrice.replace(/[^0-9]/g, "")) * quantity

      if (!email || email.trim() === "") {
        throw new Error("Email address is required")
      }

      const orderId = `ORD-${Date.now()}`
      const scent = selectedScent ? scents?.find((s) => s.id === selectedScent)?.name : ""

      const customerEmailParams = {
        to_email: email,
        from_name: "Luqitchy Cosmetics",
        customer_name: name,
        order_id: orderId,
        product_name: productName,
        quantity: quantity.toString(),
        scent: scent || "N/A",
        total_price: totalPrice.toString(),
        phone: phone,
        address: address,
      }

      const adminEmailParams = {
        to_email: "luqitchycosmetics@gmail.com",
        from_name: "Luqitchy Cosmetics",
        order_id: orderId,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        product_name: productName,
        quantity: quantity.toString(),
        scent: scent || "N/A",
        total_price: totalPrice.toString(),
        delivery_address: address,
        special_notes: notes,
      }

      // Send customer confirmation email
      await emailjs.send("service_cyg3pcs", "template_nq7ayum", customerEmailParams)

      // Send admin notification email
      await emailjs.send("service_cyg3pcs", "template_nn2n23j", adminEmailParams)

      const whatsappMessage = `New Order Received! 🎉\n\nOrder ID: ${orderId}\nCustomer: ${name}\nPhone: ${phone}\nEmail: ${email}\nProduct: ${productName}\nScent: ${scent || "N/A"}\nQuantity: ${quantity}\nTotal: EGP ${totalPrice}\nAddress: ${address}\nNotes: ${notes || "None"}`

      try {
        await fetch("/api/send-whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: whatsappMessage,
            phone: "201012622315",
            orderId,
            customerName: name,
            customerPhone: phone,
            customerEmail: email,
            productName,
            quantity,
            scent: scent || "N/A",
            totalPrice,
            address,
            notes,
          }),
        })
      } catch (error) {
        console.error("WhatsApp notification failed, but order was processed:", error)
      }

      setIsSubmitting(false)
      router.push("/order/confirmation")
    } catch (error) {
      console.error("Error processing order:", error)
      setIsSubmitting(false)
      alert("There was an error processing your order. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-secondary/50 rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">Product:</span>
          <span className="font-semibold text-foreground">{productName}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">Price:</span>
          <span className="font-semibold text-accent">{productPrice}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Quantity:</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              -
            </button>
            <span className="font-semibold text-foreground w-8 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              +
            </button>
          </div>
        </div>
        <div className="border-t border-border mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Total:</span>
            <span className="font-bold text-xl text-accent">
              EGP {Number.parseInt(productPrice.replace(/[^0-9]/g, "")) * quantity}
            </span>
          </div>
        </div>
      </div>

      {scents && scents.length > 0 && (
        <div>
          <Label className="text-foreground font-medium mb-3 block">
            Select Scent <span className="text-accent">*</span>
          </Label>
          <div className="space-y-3">
            {scents.map((scent) => (
              <label
                key={scent.id}
                className="flex items-start gap-3 p-4 rounded-2xl border-2 border-border cursor-pointer hover:border-accent hover:bg-secondary/50 transition-all"
              >
                <input
                  type="radio"
                  name="scent"
                  value={scent.id}
                  checked={selectedScent === scent.id}
                  onChange={(e) => setSelectedScent(e.target.value)}
                  className="mt-1 w-4 h-4 cursor-pointer accent-accent"
                />
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{scent.name}</div>
                  <div className="text-sm text-muted-foreground">{scent.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Customer Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-foreground font-medium">
            Full Name <span className="text-accent">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Enter your full name"
            className="mt-2 rounded-xl border-border focus:ring-accent"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-foreground font-medium">
            Email Address <span className="text-accent">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email for order confirmation"
            className="mt-2 rounded-xl border-border focus:ring-accent"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-foreground font-medium">
            Phone Number <span className="text-accent">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="Enter your phone number"
            className="mt-2 rounded-xl border-border focus:ring-accent"
          />
        </div>

        <div>
          <Label htmlFor="address" className="text-foreground font-medium">
            Delivery Address <span className="text-accent">*</span>
          </Label>
          <Textarea
            id="address"
            name="address"
            required
            placeholder="Enter your full delivery address"
            className="mt-2 rounded-xl border-border focus:ring-accent min-h-24"
          />
        </div>

        <div>
          <Label htmlFor="notes" className="text-foreground font-medium">
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any special requests or notes..."
            className="mt-2 rounded-xl border-border focus:ring-accent"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full py-6 text-lg font-semibold shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02] group"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Place Order
            <Sparkles className="w-4 h-4 ml-2 animate-sparkle" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">By placing this order, you agree to our policies. 💖</p>
    </form>
  )
}
