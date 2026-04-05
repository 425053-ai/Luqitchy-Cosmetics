"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, MessageCircle, ArrowRight, Sparkles, CreditCard, Smartphone, Wallet, Building2, Ticket } from "lucide-react"
import { ConfettiEffect } from "@/components/confetti-effect"
import { PageQuickActions } from "@/components/page-quick-actions"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface OrderData {
  orderId: string
  items: OrderItem[]
  amount: number
  customerData: {
    fullName: string
    email: string
    phone: string
    whatsapp?: string
    governorate: string
    city: string
    streetAddress: string
    landmark?: string
    notes?: string
  }
  paymentMethod: string
  billReference?: string
  shippingFee?: number
}

// Payment method display info
const paymentMethodInfo: Record<string, { icon: React.ReactNode; label: string; color: string; bgColor: string; description: string }> = {
  cash: {
    icon: <Wallet className="w-6 h-6" />,
    label: "💵 Cash on Delivery",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30 border-green-200/50 dark:border-green-800/30",
    description: "Pay when your order arrives at your doorstep"
  },
  visa: {
    icon: <CreditCard className="w-6 h-6" />,
    label: "💳 Visa/MasterCard",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/30",
    description: "Payment completed securely via card"
  },
  vodafone_instapay: {
    icon: <Smartphone className="w-6 h-6" />,
    label: "💳 Vodafone Cash & InstaPay",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30 border-red-200/50 dark:border-red-800/30",
    description: "Check your phone or bank app for payment confirmation"
  },
  paypal: {
    icon: <CreditCard className="w-6 h-6" />,
    label: "🅿️ PayPal",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200/50 dark:border-indigo-800/30",
    description: "Payment completed via PayPal"
  },
  cashcollection: {
    icon: <Building2 className="w-6 h-6" />,
    label: "🏪 Aman/Masary",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30 border-orange-200/50 dark:border-orange-800/30",
    description: "Pay at any Aman or Masary outlet using your bill reference"
  },
  kiosk: {
    icon: <Ticket className="w-6 h-6" />,
    label: "🎫 Fawry/Kiosk",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200/50 dark:border-yellow-800/30",
    description: "Pay at any Fawry outlet using your reference number"
  },
}

export default function ConfirmationPage() {
  const [showConfetti, setShowConfetti] = useState(true)
  const searchParams = useSearchParams()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [billReference, setBillReference] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("cash")
  const [transferImage, setTransferImage] = useState<string | null>(null)

  useEffect(() => {
    // Scroll to top of page
    window.scrollTo(0, 0)
    
    // Get payment details from URL params
    const urlBillRef = searchParams.get('billRef')
    const urlPayment = searchParams.get('payment')

    if (urlBillRef) {
      setBillReference(urlBillRef)
    }

    if (urlPayment) {
      setPaymentMethod(urlPayment)
    }

    // Try to get full order data from localStorage
    const pendingData = localStorage.getItem('pendingOrderData')
    if (pendingData) {
      try {
        const parsed = JSON.parse(pendingData)
        setOrderData(parsed)
        if (parsed.paymentMethod) {
          setPaymentMethod(parsed.paymentMethod)
        }
      } catch (e) {
        console.error('Failed to parse order data:', e)
      }
    }

    // Get transfer image from localStorage
    const savedImage = localStorage.getItem('lastTransferImage')
    if (savedImage) {
      setTransferImage(savedImage)
    }
    
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [searchParams])

  const paymentInfo = paymentMethodInfo[paymentMethod] || paymentMethodInfo.cash

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 overflow-hidden relative">
      <PageQuickActions />
      {/* Confetti Effect */}
      <ConfettiEffect isActive={showConfetti} />

      {/* Floating kawaii elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] text-4xl animate-float opacity-30">💖</div>
        <div className="absolute top-[20%] right-[10%] text-3xl animate-float opacity-30" style={{ animationDelay: '0.5s' }}>✨</div>
        <div className="absolute bottom-[30%] left-[8%] text-2xl animate-float opacity-30" style={{ animationDelay: '1s' }}>🎀</div>
        <div className="absolute bottom-[20%] right-[5%] text-3xl animate-float opacity-30" style={{ animationDelay: '1.5s' }}>💝</div>
        <div className="absolute top-[40%] left-[3%] text-2xl animate-float opacity-30" style={{ animationDelay: '2s' }}>🌸</div>
        <div className="absolute top-[60%] right-[3%] text-2xl animate-float opacity-30" style={{ animationDelay: '2.5s' }}>💫</div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Main card with glassmorphism */}
        <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border-2 border-primary/30 p-4 sm:p-6 md:p-8 lg:p-12 shadow-xl sm:shadow-2xl shadow-primary/20">
          {/* Animated glow border */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-50 animate-pulse" />
          
          {/* Success icon with sparkles */}
          <div className="relative flex justify-center mb-4 sm:mb-6 md:mb-8">
            <div className="relative">
              {/* Sparkle particles */}
              <Sparkles className="absolute -top-4 -left-4 w-6 h-6 text-yellow-400 animate-ping" />
              <Sparkles className="absolute -top-2 -right-6 w-5 h-5 text-pink-400 animate-ping" style={{ animationDelay: '0.3s' }} />
              <Sparkles className="absolute -bottom-2 -left-6 w-4 h-4 text-purple-400 animate-ping" style={{ animationDelay: '0.6s' }} />
              
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 animate-pulse" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-400 to-accent rounded-full flex items-center justify-center animate-kawaii-bounce">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>

          {/* Main heading with rainbow shimmer */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-center mb-2 sm:mb-4 rainbow-shimmer">
            Thank You! 🎉
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-muted-foreground mb-4 sm:mb-6 md:mb-8 leading-relaxed px-2">
            Your order has been received and is being processed with love 💕 We're thrilled to prepare your Luqitchy
            Cosmetics for you!
          </p>

          {/* Order details section with glow */}
          <div className="relative bg-secondary/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-border overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h2 className="relative font-serif text-base sm:text-lg md:text-xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
              <span className="animate-cute-wiggle">📋</span>
              Order Details
            </h2>

            <div className="relative space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2 sm:pb-3 md:pb-4 border-b border-border/50 gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-muted-foreground">Status:</span>
                <span className="inline-flex items-center gap-2 bg-green-100/20 text-green-600 px-2 sm:px-3 md:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold w-fit">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full animate-pulse" />
                  Processing ✨
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-muted-foreground">Confirmation Sent:</span>
                <span className="text-foreground font-medium text-xs sm:text-sm">✓ Check your email 💌</span>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border ${paymentInfo.bgColor} overflow-hidden`}>
            <h2 className="relative font-serif text-base sm:text-lg md:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <span className={paymentInfo.color}>{paymentInfo.icon}</span>
              Payment Method
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-lg sm:text-xl">{paymentInfo.label}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">{paymentInfo.description}</p>
              
              {/* Bill Reference for Kiosk/Cash Collection */}
              {(paymentMethod === 'kiosk' || paymentMethod === 'cashcollection') && billReference && (
                <div className="mt-4 p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border-2 border-dashed border-current">
                  <p className="text-xs text-muted-foreground mb-2">Your Reference Number:</p>
                  <p className="font-mono text-2xl sm:text-3xl font-bold text-center tracking-wider">
                    {billReference}
                  </p>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    {paymentMethod === 'kiosk' 
                      ? '📍 Present this at any Fawry outlet to complete payment'
                      : '📍 Present this at any Aman or Masary branch to complete payment'}
                  </p>
                </div>
              )}
              
              {/* Vodafone Cash Instructions */}
              {paymentMethod === 'vodafone' && (
                <div className="mt-4 p-4 bg-red-50/80 dark:bg-red-950/30 rounded-xl border border-red-200/50">
                  <p className="text-sm font-medium mb-2">📱 Vodafone Cash Payment</p>
                  <p className="text-xs text-muted-foreground">
                    You should have received a push notification on your phone. 
                    Please confirm the payment from your Vodafone Cash app.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Image Display */}
          {transferImage && (
            <div className="relative bg-secondary/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-border overflow-hidden">
              <h2 className="font-serif text-base sm:text-lg md:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <span className="animate-cute-wiggle">📸</span>
                Payment Proof Screenshot
              </h2>
              
              <div className="relative h-80 sm:h-96 md:h-[500px] rounded-lg overflow-hidden border-2 border-border bg-background/50">
                <Image 
                  src={transferImage} 
                  alt="Vodafone Cash payment proof" 
                  fill
                  className="object-contain"
                  quality={95}
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-3 text-center">
                ✓ Your payment screenshot has been received and saved with your order
              </p>
            </div>
          )}

          {/* Customer Details (if available) */}
          {orderData?.customerData && (
            <div className="relative bg-secondary/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-border overflow-hidden">
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <span className="animate-cute-wiggle">👤</span>
                Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{orderData.customerData.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{orderData.customerData.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {orderData.customerData.streetAddress}, {orderData.customerData.city}, {orderData.customerData.governorate}
                    {orderData.customerData.landmark && ` (${orderData.customerData.landmark})`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items (if available) */}
          {orderData?.items && orderData.items.length > 0 && (
            <div className="relative bg-secondary/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-border overflow-hidden">
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <span className="animate-cute-wiggle">🛍️</span>
                Order Items
              </h2>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-background/50 rounded-lg">
                    {item.image && (
                      <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-accent">{(item.price * item.quantity).toLocaleString()} EGP</p>
                  </div>
                ))}
                <div className="pt-3 border-t border-border flex flex-col gap-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Subtotal:</span>
                    <span>{(orderData.amount - 70).toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-blue-700">Shipping (all Egypt):</span>
                    <span className="text-blue-700">+70 EGP</span>
                  </div>
                  <div className="flex justify-between items-center text-base mt-1">
                    <span className="font-semibold">Total:</span>
                    <span className="text-lg font-bold text-accent">{orderData.amount?.toLocaleString()} EGP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Communication channels */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 md:mb-8">
            <h2 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-4 flex items-center gap-2">
              <span className="animate-cute-wiggle">📞</span>
              Stay Connected
            </h2>

            {/* Email notification with hover effect */}
            <div className="group flex items-start gap-2 sm:gap-3 md:gap-4 bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/30 dark:to-blue-950/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200/50 dark:border-blue-800/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-0.5 flex-shrink-0 group-hover:animate-cute-wiggle" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">Email Confirmation 💌</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  A confirmation email has been sent to your inbox with all order details. Check your spam folder if you
                  don't see it.
                </p>
              </div>
            </div>

            {/* WhatsApp notification with hover effect */}
            <div className="group flex items-start gap-2 sm:gap-3 md:gap-4 bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-950/30 dark:to-green-950/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200/50 dark:border-green-800/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/10">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-0.5 flex-shrink-0 group-hover:animate-cute-wiggle" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">WhatsApp Updates 💬</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  We'll send you order updates and shipping information via WhatsApp. We're here to help!
                </p>
              </div>
            </div>
          </div>

          {/* What's next section */}
          <div className="bg-secondary/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-border">
            <h3 className="font-serif font-bold text-foreground mb-2 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="animate-cute-wiggle">⏭️</span>
              What's Next?
            </h3>
            <ol className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li className="flex gap-2 sm:gap-3 group">
                <span className="font-bold text-accent min-w-fit group-hover:animate-kawaii-bounce">1.</span>
                <span>You'll receive a confirmation email with your order details 📧</span>
              </li>
              <li className="flex gap-2 sm:gap-3 group">
                <span className="font-bold text-accent min-w-fit group-hover:animate-kawaii-bounce">2.</span>
                <span>Our team will prepare your order with love and care 💝</span>
              </li>
              <li className="flex gap-2 sm:gap-3 group">
                <span className="font-bold text-accent min-w-fit group-hover:animate-kawaii-bounce">3.</span>
                <span>You'll get tracking info via email and WhatsApp 🚚</span>
              </li>
              <li className="flex gap-2 sm:gap-3 group">
                <span className="font-bold text-accent min-w-fit group-hover:animate-kawaii-bounce">4.</span>
                <span>Your beautiful Luqitchy Cosmetics will arrive at your doorstep 🎁</span>
              </li>
            </ol>
          </div>

          {/* Action buttons with glow */}
          <div className="flex flex-col gap-3 sm:gap-4 justify-center">
            <Link href="/#products" className="w-full">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full py-4 sm:py-5 md:py-6 font-semibold shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base animate-glow-pulse">
                Continue Shopping ✨
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button
                variant="outline"
                className="w-full rounded-full py-4 sm:py-5 md:py-6 font-semibold border-2 border-primary/30 hover:border-primary/60 transition-all duration-300 bg-transparent text-sm sm:text-base hover:scale-[1.02]"
              >
                Back to Home 🏠
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer message */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 md:mt-8 flex items-center justify-center gap-2">
          Made with <span className="text-red-500 animate-heart-pop inline-block">❤️</span> by Lingo for Luqitchy <span className="animate-sparkle">✨</span>
        </p>
      </div>
    </main>
  )
}
