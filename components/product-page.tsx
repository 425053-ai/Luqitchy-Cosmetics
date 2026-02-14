"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, ShoppingCart, Plus, Minus, Check } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useOrderHistory } from "@/context/OrderHistoryContext"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

interface ProductPageProps {
  product: {
    id: string
    name: string
    image: string
    price: number
    color: string
    features: string[]
    description?: string
  }
}

export function ProductPage({ product }: ProductPageProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { addOrder } = useOrderHistory()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    governorate: "",
    city: "",
    streetAddress: "",
    landmark: "",
    notes: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [sameAsPhone, setSameAsPhone] = useState(true)
  const [transferImage, setTransferImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Save submitted order data
  const [submittedOrder, setSubmittedOrder] = useState<{
    orderId: string;
    productName: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    customerData: typeof formData;
    orderTime: string;
  } | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 10MB - will be compressed automatically)
      if (file.size > 10 * 1024 * 1024) {
        alert("❌ Image is too large. Please select an image smaller than 10MB")
        return
      }

      // Warn if image is larger than 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert("⚠️ Large image detected. Compressing... This may take a moment.")
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("❌ Please select a valid image file")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new window.Image()
        img.onload = () => {
          // Compress image for Vercel payload limits
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) return

          // Set canvas size with reduced dimensions for better compression
          const maxWidth = 900  // Reduced from 1200
          const maxHeight = 900  // Reduced from 1200
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)

          // Convert compressed image to blob and create new file
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                })
                console.log(`📷 Image compressed: ${(file.size / 1024).toFixed(1)}KB → ${(blob.size / 1024).toFixed(1)}KB`)
                setTransferImage(compressedFile)
                setImagePreview(canvas.toDataURL('image/jpeg', 0.65))
              }
            },
            'image/jpeg',
            0.65  // Reduced from 0.85 for better compression
          )
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.color,
      quantity: quantity,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent double submission
    if (isSubmitting) return

    // Validate transfer image
    if (!transferImage) {
      alert("❌ Please attach a Vodafone Cash payment confirmation screenshot")
      return
    }
    
    setIsSubmitting(true)
    const total_price = quantity * product.price
    
    // Generate sequential order ID
    let order_id: string
    try {
      const orderIdResponse = await fetch('/api/orderCounter', { method: 'POST' })
      if (orderIdResponse.ok) {
        const { orderId } = await orderIdResponse.json()
        order_id = orderId
      } else {
        // Fallback to timestamp if API fails
        order_id = `ORD-${Date.now()}`
      }
    } catch {
      order_id = `ORD-${Date.now()}`
    }
    
    const order_date = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    try {
      // Upload transfer image and get base64
      setUploadingImage(true)
      const imageFormData = new FormData()
      imageFormData.append('transferImage', transferImage)
      imageFormData.append('orderId', order_id)
      imageFormData.append('customerName', formData.fullName)
      imageFormData.append('customerEmail', formData.email)
      imageFormData.append('phone', formData.phone)
      imageFormData.append('amount', total_price.toString())
      imageFormData.append('bankName', '01012622315')

      const bankTransferResponse = await fetch('/api/bankTransfer', {
        method: 'POST',
        body: imageFormData,
      })

      if (!bankTransferResponse.ok) {
        const errorData = await bankTransferResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to process image. Please try again.')
      }

      const bankTransferData = await bankTransferResponse.json()
      setUploadingImage(false)

      // Save to localStorage for admin dashboard
      const existingProofs = JSON.parse(localStorage.getItem('transfer-proofs') || '[]')
      const newProof = {
        orderId: order_id,
        customerName: formData.fullName,
        customerEmail: formData.email,
        phone: formData.phone,
        amount: total_price.toString(),
        uploadedAt: order_date,
        imageData: bankTransferData.imageData,
        imageMime: bankTransferData.mimeType,
        verified: false,
      }
      existingProofs.push(newProof)
      localStorage.setItem('transfer-proofs', JSON.stringify(existingProofs))

      // Send email notification with image
      console.log('═══════════════════════════════════════════════════');
      console.log('📧 [Order Flow] STEP 1: Sending email notification');
      console.log('   To:', formData.email);
      console.log('   Order ID:', order_id);
      console.log('═══════════════════════════════════════════════════');
      
      const emailResponse = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          orderId: order_id,
          cart: [{
            name: product.name,
            quantity: quantity,
            price: product.price,
          }],
          total: quantity * product.price,
        }),
      })

      if (!emailResponse.ok) {
        const emailError = await emailResponse.json().catch(() => ({}))
        console.error('❌ [Order Flow] STEP 1 FAILED - Email sending error:');
        console.error('   Status:', emailResponse.status);
        console.error('   Response:', emailError);
      } else {
        const emailResult = await emailResponse.json()
        console.log('✅ [Order Flow] STEP 1 SUCCESS - Email sent successfully');
        console.log('   Response:', emailResult);
      }

      // Send Telegram notification with image via server API
      console.log('────────────────────────────────────────────────────');
      console.log('🤖 [Order Flow] STEP 2: Sending Telegram notification');
      console.log('   Order ID:', order_id);
      console.log('   Message Type:', 'bank_transfer');
      console.log('────────────────────────────────────────────────────');
      
      try {
        const telegramResponse = await fetch('/api/sendTelegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'bank_transfer',
            orderData: {
              order_id: order_id,
              product_name: product.name,
              quantity: quantity,
              price: product.price,
              total_amount: total_price,
              customer_name: formData.fullName,
              phone: formData.phone,
              customer_email: formData.email,
              governorate: formData.governorate,
              city: formData.city,
              street: formData.streetAddress,
              landmark: formData.landmark,
              notes: formData.notes || 'بدون ملاحظات',
              payment_method: 'تحويل بنكي للرقم 01012622315',
              order_date: order_date,
            },
            imageData: bankTransferData.imageData,
          }),
        })

        const telegramData = await telegramResponse.json()
        if (telegramData.success) {
          console.log('✅ [Order Flow] STEP 2 SUCCESS - Telegram notification sent');
          console.log('   Response:', telegramData);
        } else {
          console.warn('❌ [Order Flow] STEP 2 FAILED - Telegram error:');
          console.warn('   Status:', telegramResponse.status);
          console.warn('   Error:', telegramData.error);
          console.warn('   Details:', telegramData.details);

        }
      } catch (telegramError: any) {
        console.error('❌ [Order Flow] STEP 2 EXCEPTION - Telegram error:');
        console.error('   Error Name:', telegramError.name);
        console.error('   Error Message:', telegramError.message);
        console.error('   Error Stack:', telegramError.stack);
      }

      // Save to order history
      const fullAddressForHistory = `${formData.streetAddress}${formData.landmark ? ` (${formData.landmark})` : ''}, ${formData.city}, ${formData.governorate}`;
      addOrder({
        orderId: order_id,
        items: [{
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
        }],
        totalPrice: total_price,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        deliveryAddress: fullAddressForHistory,
        orderDate: new Date().toISOString(),
        status: "pending",
      })

      // Save order data
      setSubmittedOrder({
        orderId: order_id,
        productName: product.name,
        productImage: product.image,
        quantity: quantity,
        unitPrice: product.price,
        totalPrice: total_price,
        customerData: { ...formData },
        orderTime: order_date,
      })

      // Save order ID to localStorage for confirmation page
      localStorage.setItem('lastOrderId', order_id)
      
      // Save transfer image for confirmation page
      if (imagePreview) {
        localStorage.setItem('lastTransferImage', imagePreview)
      }

      // Scroll to top of page
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
      setSubmitted(true)
    } catch (err: any) {
      console.error("Order Error:", err)
      const errorMessage = err?.message || "Failed to process order"
      console.error("Detailed error:", errorMessage)
      alert(`❌ Error: ${errorMessage}\n\nTip: Make sure the image is compressed and smaller than 2MB`)
    } finally {
      setIsSubmitting(false)
      setUploadingImage(false)
    }
  }

  if (submitted && submittedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background relative overflow-hidden">
        {/* Animated Background Elements - Hidden on mobile for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hidden sm:block absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-green-500/10 rounded-full blur-3xl animate-morph" />
          <div className="hidden sm:block absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-morph" style={{ animationDelay: "2s" }} />
          
          {/* Confetti-like particles - fewer on mobile */}
          {[...Array(6)].map((_, i) => (
            <span 
              key={i}
              className="hidden sm:block absolute text-xl sm:text-2xl animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {['✨', '💖', '🎉', '⭐', '💫'][i % 5]}
            </span>
          ))}
        </div>

        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 py-6 sm:py-8 md:py-12 px-3 sm:px-4 relative z-10">
          {/* Success Animation Header */}
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-pulse-ring">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-green-500/20" />
              </div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 animate-success-check">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-2 sm:space-y-3 animate-slide-up opacity-0" style={{ animationDelay: "0.3s" }}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-serif font-bold">
                <span className="gradient-text">Thank You!</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground px-2">
                Your order has been confirmed successfully
              </p>
            </div>
          </div>

          {/* Screenshot Notice */}
          <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.4s" }}>
            <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl animate-bounce-subtle">📸</span>
                <div className="text-center">
                  <p className="text-yellow-700 dark:text-yellow-400 font-bold text-sm sm:text-base md:text-lg">Save Your Order Details</p>
                  <p className="text-yellow-600/80 dark:text-yellow-500/80 text-xs sm:text-sm">Take a screenshot of this receipt for your records</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Order Receipt Card */}
          <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.5s" }}>
            <div className="premium-card rounded-2xl sm:rounded-3xl overflow-hidden">
              {/* Receipt Header */}
              <div className="relative bg-gradient-to-r from-accent via-pink-500 to-accent text-white p-4 sm:p-6 md:p-8 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] opacity-50" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-4">
                    <span className="text-xs sm:text-sm font-medium">Order Confirmed</span>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Order Receipt</h2>
                  <p className="font-mono text-sm sm:text-base md:text-xl tracking-wider break-all">{submittedOrder.orderId}</p>
                  <p className="text-white/70 text-xs sm:text-sm mt-1 sm:mt-2">{submittedOrder.orderTime}</p>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="receipt-pattern">
                {/* Customer Info */}
                <div className="p-3 sm:p-4 md:p-6 border-b border-border/50">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center">
                      <span className="text-base sm:text-xl">👤</span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold">Customer Information</h3>
                  </div>
                  <div className="grid gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm bg-muted/30 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                      <span className="text-muted-foreground">Full Name</span>
                      <span className="font-semibold">{submittedOrder.customerData.fullName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-semibold font-mono" dir="ltr">{submittedOrder.customerData.phone}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                      <span className="text-muted-foreground">WhatsApp</span>
                      <span className="font-semibold font-mono" dir="ltr">{submittedOrder.customerData.whatsapp}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-semibold text-xs sm:text-sm font-mono break-all" dir="ltr">{submittedOrder.customerData.email}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-3 sm:p-4 md:p-6 border-b border-border/50">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center">
                      <span className="text-base sm:text-xl">📍</span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold">Delivery Address</h3>
                  </div>
                  <div className="bg-muted/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                      <span className="text-muted-foreground">Governorate</span>
                      <span className="font-semibold">{submittedOrder.customerData.governorate}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                      <span className="text-muted-foreground">City</span>
                      <span className="font-semibold">{submittedOrder.customerData.city}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-2">
                      <span className="text-muted-foreground">Street</span>
                      <span className="font-semibold sm:text-right sm:max-w-[60%]">{submittedOrder.customerData.streetAddress}</span>
                    </div>
                    {submittedOrder.customerData.landmark && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-2">
                        <span className="text-muted-foreground">Landmark</span>
                        <span className="font-semibold sm:text-right sm:max-w-[60%]">{submittedOrder.customerData.landmark}</span>
                      </div>
                    )}
                    {submittedOrder.customerData.notes && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-2 pt-2 border-t border-border/50">
                        <span className="text-muted-foreground">Notes</span>
                        <span className="font-semibold sm:text-right sm:max-w-[60%] italic">{submittedOrder.customerData.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product */}
                <div className="p-3 sm:p-4 md:p-6 border-b border-border/50">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center">
                      <span className="text-base sm:text-xl">📦</span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold">Product Details</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-5 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 order-card">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-white/50">
                      <Image src={submittedOrder.productImage} alt={submittedOrder.productName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <p className="font-bold text-base sm:text-lg md:text-xl mb-1">{submittedOrder.productName}</p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span className="bg-accent/10 px-2 sm:px-3 py-1 rounded-full">Qty: {submittedOrder.quantity}</span>
                        <span>{submittedOrder.unitPrice} EGP each</span>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-xs sm:text-sm text-muted-foreground">Subtotal</p>
                      <p className="font-bold text-accent text-xl sm:text-2xl">{submittedOrder.totalPrice} EGP</p>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                    <div>
                      <span className="text-muted-foreground text-sm">Grand Total</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💰</span>
                        <span className="font-bold text-lg sm:text-xl md:text-2xl">Total Amount</span>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent">{submittedOrder.totalPrice}</span>
                      <span className="text-base sm:text-lg md:text-xl font-semibold text-accent ml-1">EGP</span>
                    </div>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="p-3 sm:p-4 md:p-6 text-center space-y-3 sm:space-y-4 bg-gradient-to-b from-transparent to-muted/20">
                  <div className="inline-flex items-center gap-2 sm:gap-3 bg-green-500/10 border border-green-500/30 px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-bold text-green-700 dark:text-green-400 text-xs sm:text-sm md:text-base">Order Successfully Placed!</span>
                  </div>
                  
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base px-2">
                    We will contact you at <strong className="text-foreground font-mono break-all" dir="ltr">{submittedOrder.customerData.phone}</strong>
                    <br />to confirm delivery details within 24-48 hours
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 sm:gap-6 pt-2 sm:pt-4 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 sm:gap-2 break-all">
                      <span>📧</span> <span className="hidden sm:inline">luqitchycosmetics@gmail.com</span><span className="sm:hidden">Email us</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:gap-4 justify-center animate-slide-up opacity-0" style={{ animationDelay: "0.6s" }}>
            <Link 
              href="/" 
              className="luxury-btn inline-flex items-center justify-center gap-2 text-white font-semibold h-11 sm:h-12 md:h-14 px-6 sm:px-8 md:px-10 rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base"
            >
              <span>🏠</span> Return to Home
            </Link>
            <Link 
              href="/#products" 
              className="inline-flex items-center justify-center gap-2 border-2 border-accent/30 hover:border-accent hover:bg-accent/5 font-semibold h-11 sm:h-12 md:h-14 px-6 sm:px-8 md:px-10 rounded-xl sm:rounded-2xl transition-all duration-300 backdrop-blur-sm bg-card/50 text-sm sm:text-base"
            >
              <span>🛍️</span> Continue Shopping
            </Link>
          </div>

          {/* Brand Footer */}
          <div className="text-center pt-4 sm:pt-6 animate-slide-up opacity-0" style={{ animationDelay: "0.7s" }}>
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-accent/50" />
              <span className="text-xl sm:text-2xl">✨</span>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-accent/50" />
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold gradient-text">Luqitchy Cosmetics</p>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Your beauty journey starts here</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hidden sm:block absolute top-20 right-10 w-60 md:w-96 h-60 md:h-96 bg-accent/5 rounded-full blur-2xl md:blur-3xl" />
        <div className="hidden sm:block absolute bottom-40 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/5 rounded-full blur-2xl md:blur-3xl" />
      </div>

      <div className="relative z-10 p-3 sm:p-4 md:p-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-accent mb-4 sm:mb-6 md:mb-8 transition-all duration-300 group bg-card/50 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-border/50 hover:border-accent/30 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" /> 
          <span>Back to Products</span>
        </Link>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="animate-slide-in-left opacity-0" style={{ animationDelay: "0.1s" }}>
            <div className="sticky top-4 sm:top-6 md:top-8">
              <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl shadow-primary/20 group bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                  priority
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Premium overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Floating badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 premium-badge px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm shadow-lg">
                  ✨ Premium
                </div>
              </div>
              
              {/* Image thumbnails/indicators */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${i === 0 ? 'bg-accent' : 'bg-muted'} transition-colors cursor-pointer hover:bg-accent/70`} />
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-slide-in-right opacity-0" style={{ animationDelay: "0.2s" }}>
            <div>
              {/* Product Name & Price */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold gradient-text leading-tight">{product.name}</h1>
                <div className="flex-shrink-0 bg-accent/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-accent/20 inline-flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
                  <span className="text-[10px] sm:text-xs text-muted-foreground">In Stock</span>
                  <span className="text-xs sm:text-sm font-bold text-green-500">● Available</span>
                </div>
              </div>
              
              {/* Price Section */}
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent">{product.price}</span>
                <span className="text-lg sm:text-xl md:text-2xl font-semibold text-accent">EGP</span>
                <span className="text-base sm:text-lg md:text-xl text-muted-foreground line-through">{product.price + 50} EGP</span>
                <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  Save {50} EGP
                </span>
              </div>
              
              {/* Product Description */}
              {product.description && (
                <div className="bg-muted/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-border/50 mb-4 sm:mb-6">
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
              
              {/* Features */}
              <div className="premium-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-accent fill-accent" />
                  <span>Product Features</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm group">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors flex-shrink-0">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                      </div>
                      <span className="group-hover:text-accent transition-colors">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="premium-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
              <label className="block text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Select Quantity</label>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 bg-muted/50 rounded-xl sm:rounded-2xl p-1.5 sm:p-2">
                  <Button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl hover:bg-accent/20 transition-colors"
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <span className="text-2xl sm:text-3xl font-bold w-12 sm:w-16 text-center">{quantity}</span>
                  <Button
                    onClick={() => setQuantity(quantity + 1)}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl hover:bg-accent/20 transition-colors"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
                <div className="flex-1 text-center sm:text-right">
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">Subtotal</div>
                  <div className="text-2xl sm:text-3xl font-bold text-accent">{quantity * product.price} <span className="text-base sm:text-lg">EGP</span></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 sm:gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl luxury-btn transition-all duration-300"
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                onClick={() => router.push('/cart')}
                variant="outline"
                className="h-12 sm:h-14 md:h-16 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 border-accent/30 hover:border-accent hover:bg-accent/5 transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="ml-1.5 sm:ml-2 font-bold text-sm sm:text-base">{quantity}</span>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {[
                { icon: "🚚", label: "Fast Delivery", desc: "24-48 hours" },
                { icon: "💯", label: "Premium Quality", desc: "Guaranteed" },
                { icon: "🔒", label: "Secure Order", desc: "Protected" },
              ].map((badge) => (
                <div key={badge.label} className="text-center p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 hover:border-accent/30 transition-colors">
                  <span className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 block">{badge.icon}</span>
                  <span className="text-[10px] sm:text-xs font-semibold block">{badge.label}</span>
                  <span className="text-[9px] sm:text-xs text-muted-foreground">{badge.desc}</span>
                </div>
              ))}
            </div>

            {/* Direct Order Section */}
            <div className="premium-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-pink-600 flex items-center justify-center text-white shadow-lg shadow-accent/30">
                  <span className="text-xl">📝</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Quick Order</h3>
                  <p className="text-sm text-muted-foreground">Fill in your details to order directly</p>
                </div>
              </div>
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <span>👤</span> Full Name (4 parts) <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="e.g. Ahmed Mohamed Ali Hassan"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="premium-input w-full p-4 rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <span>📧</span> Email <span className="text-accent">*</span>
                  </label>
                  <p className="text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800/50 font-medium flex items-center gap-2">
                    <span>⚠️</span> Please enter a correct email - Your order confirmation will be sent here
                  </p>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="premium-input w-full p-4 rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <span>📱</span> Phone Number <span className="text-accent">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="01xxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => {
                      handleChange(e);
                      if (sameAsPhone) {
                        setFormData(prev => ({ ...prev, whatsapp: e.target.value }));
                      }
                    }}
                    required
                    className="premium-input w-full p-4 rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span>📱</span> WhatsApp <span className="text-accent">*</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-accent transition-colors">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => {
                          setSameAsPhone(e.target.checked);
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, whatsapp: prev.phone }));
                          }
                        }}
                        className="rounded border-accent text-accent focus:ring-accent"
                      />
                      Same as phone
                    </label>
                  </div>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="01xxxxxxxxx"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    disabled={sameAsPhone}
                    className="premium-input w-full p-4 rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Address Section */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="text-lg">📍</span> Delivery Address
                  </div>
                  
                  {/* Governorate & City */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium">Governorate <span className="text-accent">*</span></label>
                      <input
                        type="text"
                        name="governorate"
                        placeholder="e.g. Cairo"
                        value={formData.governorate}
                        onChange={handleChange}
                        required
                        className="premium-input w-full p-4 rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium">City/District <span className="text-accent">*</span></label>
                      <input
                        type="text"
                        name="city"
                        placeholder="e.g. Nasr City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="premium-input w-full p-4 rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium">Street Address <span className="text-accent">*</span></label>
                    <input
                      type="text"
                      name="streetAddress"
                      placeholder="Building number, Street name, Floor, Apartment"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      required
                      className="premium-input w-full p-4 rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none text-sm"
                    />
                  </div>

                  {/* Landmark */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium">Nearest Landmark <span className="text-muted-foreground">(Optional)</span></label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="e.g. Near City Stars Mall"
                      value={formData.landmark}
                      onChange={handleChange}
                      className="premium-input w-full p-4 rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <span>📝</span> Additional Notes <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Any special instructions for your order..."
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="premium-input w-full p-4 rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none resize-none"
                  />
                </div>

                {/* Payment Method - Vodafone Cash Wallet Only */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="text-lg">📱</span> Payment Method <span className="text-accent">*</span>
                  </div>
                  
                  <div className="premium-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 bg-gradient-to-br from-red-500/10 to-pink-500/10 border-2 border-red-500/30">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">📱</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">Vodafone Cash Wallet</h3>
                        <p className="text-sm text-muted-foreground mb-3">Send payment to Vodafone Cash wallet and attach the payment confirmation screenshot</p>
                        <div className="bg-white/30 dark:bg-black/30 rounded-lg p-3 mb-3 border border-red-500/20">
                          <p className="text-sm text-muted-foreground mb-1">Vodafone Cash Wallet:</p>
                          <p className="text-sm font-mono font-bold text-lg text-red-600 dark:text-red-400">📱 <span dir="ltr">01012622315</span></p>
                        </div>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>✅ Secure wallet payment</li>
                          <li>✅ Instant confirmation</li>
                          <li>✅ Protected transaction</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Image Upload */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span>📸</span> Attach Payment Confirmation <span className="text-accent">*</span>
                    </label>
                    
                    <div className="relative">
                      <input
                        type="file"
                        id="transferImage"
                        onChange={handleImageChange}
                        accept="image/*"
                        required
                        className="hidden"
                      />
                      
                      <label 
                        htmlFor="transferImage"
                        className="block w-full p-4 rounded-xl border-2 border-dashed border-accent/50 hover:border-accent bg-accent/5 hover:bg-accent/10 cursor-pointer transition-all duration-300 text-center"
                      >
                        {imagePreview ? (
                          <div className="space-y-2">
                            <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden border border-accent/30">
                              <img src={imagePreview} alt="Payment confirmation" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-sm font-medium text-accent">✅ Screenshot attached</p>
                            <p className="text-xs text-muted-foreground">{transferImage?.name}</p>
                          </div>
                        ) : (
                          <div className="space-y-2 py-6">
                            <p className="text-3xl">📸</p>
                            <p className="text-sm font-medium">Click to select payment confirmation screenshot</p>
                            <p className="text-xs text-muted-foreground">or drag screenshot here</p>
                          </div>
                        )}
                      </label>

                      {transferImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setTransferImage(null)
                            setImagePreview("")
                          }}
                          className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full hover:bg-destructive/90 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                      <div className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                        <span>ℹ️</span>
                        <div>
                          <p className="mb-2">Screenshot must be clear and show:</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            <li>Your Vodafone Cash wallet transaction</li>
                            <li>Amount paid</li>
                            <li>Payment status (Completed/Success)</li>
                            <li>Receiver number (01012622315)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* REMOVED - Only Vodafone Cash Now */}

                {/* Order Summary */}
                <div className="bg-accent/5 rounded-2xl p-4 border border-accent/20">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Order Total:</span>
                    <span className="text-2xl font-bold text-accent">{quantity * product.price} EGP</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || uploadingImage || !transferImage}
                  className="w-full h-16 luxury-btn text-xl rounded-2xl transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : uploadingImage ? (
                    <>Uploading Image...</>
                  ) : (
                    <>
                      <span className="mr-2">🏦</span>
                      Submit Order
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground">
                  By placing this order, you agree to our terms and conditions
                </p>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
