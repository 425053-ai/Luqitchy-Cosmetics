"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useOrderHistory } from "@/context/OrderHistoryContext"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { PageQuickActions } from "@/components/page-quick-actions"
import { compressImage } from "@/lib/image-compression"
import { getAnalyticsSessionId, trackEvent } from "@/lib/analytics-client"
import { PaymentConfirmationUpload } from "@/components/payment-confirmation-upload"

export default function CartPage() {
  const router = useRouter()
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()
  const SHIPPING_FEE = 70;
  const totalWithShipping = totalPrice > 0 ? totalPrice + SHIPPING_FEE : 0;
  const { addOrder } = useOrderHistory()
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
    paymentMethod: "vodafone_instapay",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sameAsPhone, setSameAsPhone] = useState(true)
  const [orderError, setOrderError] = useState<string>("")
  
  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentIframeUrl, setPaymentIframeUrl] = useState("")
  const [billReferenceData, setBillReferenceData] = useState<{
    orderId: string;
    billReference: string;
    message: string;
    paymentType: string;
    isRealBillRef?: boolean;
  } | null>(null)
  const [walletPaymentPending, setWalletPaymentPending] = useState<{
    orderId: string;
    phone: string;
    amount: number;
  } | null>(null)
  
  // Save submitted order data
  const [submittedOrder, setSubmittedOrder] = useState<{
    orderId: string;
    items: typeof items;
    totalPrice: number;
    totalQuantity: number;
    customerData: typeof formData;
    orderTime: string;
  } | null>(null)

  // Vodafone Cash image upload states
  const [transferImage, setTransferImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleImageChange = (file: File | null, preview: string) => {
    setTransferImage(file)
    setImagePreview(preview)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      alert('⚠️ يرجى إضافة منتجات للسلة')
      return
    }
    
    // CRITICAL: Validate all required fields BEFORE submission
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      alert('⚠️ يرجى إدخال الاسم الكامل')
      return
    }
    if (!formData.email || !formData.email.includes('@')) {
      alert('⚠️ يرجى إدخال بريد إلكتروني صحيح')
      return
    }
    if (!formData.phone || formData.phone.trim().length < 8) {
      alert('⚠️ يرجى إدخال رقم هاتف صحيح')
      return
    }
    if (!formData.governorate || formData.governorate.trim().length < 2) {
      alert('⚠️ يرجى إدخال المحافظة')
      return
    }
    if (!formData.city || formData.city.trim().length < 2) {
      alert('⚠️ يرجى إدخال المدينة/الحي')
      return
    }
    if (!formData.streetAddress || formData.streetAddress.trim().length < 3) {
      alert('⚠️ يرجى إدخال عنوان الشارع')
      return
    }

    // MANDATORY: Check if payment confirmation image is uploaded
    if (!transferImage || !imagePreview) {
      alert('⚠️ Payment confirmation screenshot is required to complete your order')
      return
    }

    if (isSubmitting) return

    setIsSubmitting(true)
    trackEvent('checkout_started', { source: 'cart_page', itemsCount: items.length })

    // Process image data if available
    let imageData = null
    let imageMime = null
    if (transferImage && imagePreview) {
      imageData = imagePreview
      imageMime = 'image/jpeg'
    }

    try {
      const savedItems = [...items]
      const savedTotalPrice = totalPrice
      const savedTotalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

      const orderPayload = {
        products: savedItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
          shade: item.shade || undefined,
        })),
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          whatsapp: sameAsPhone ? formData.phone : formData.whatsapp,
          governorate: formData.governorate,
          city: formData.city,
          streetAddress: formData.streetAddress,
          landmark: formData.landmark,
          notes: formData.notes || 'بدون ملاحظات',
        },
        imageData,
        transferImageMime: imageMime,
        sessionId: getAnalyticsSessionId(),
      };
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })
      
      if (!response.ok) {
        console.error('❌ API returned non-OK status:', response.status);
        throw new Error(`Server error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('🔍 Cart Create Order Response:', { status: response.status, result });
      
      // Accept ANY response with success: true (including fallback orders)
      if (!result.success) {
        console.error('❌ Cart order creation error:', result);
        setOrderError('حدث خطأ في معالجة الطلب. يرجى المحاولة مرة أخرى.');
        // Show generic error - NEVER show technical patterns to user
        alert('⚠️ حدث خطأ في معالجة الطلب.\n\nيرجى التحقق من اتصالك بالإنترنت والبيانات المدخلة و إعادة المحاولة.');
        setIsSubmitting(false)
        return
      }

      // Extract customer name from response
      const customerName = result.customerName || formData.fullName;
      
      // Log fallback status for tracking
      if (result.fallback) {
        console.warn('⚠️ Order stored in local backup (database sync pending)');
      }
      const orderDateIso = result.order?.createdAt || result.orderDate || new Date().toISOString()
      const orderDateReadable = new Date(orderDateIso).toLocaleString("en-GB")

      try {
        const notifResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: customerName,
            order_date: orderDateReadable,
            order_type: 'cart',
            customer_name: formData.fullName,
            customer_email: formData.email,
            phone: formData.phone,
            whatsapp: sameAsPhone ? formData.phone : formData.whatsapp,
            products: savedItems.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price,
            })),
            total_amount: savedTotalPrice + SHIPPING_FEE,
            governorate: formData.governorate,
            city: formData.city,
            street: formData.streetAddress,
            landmark: formData.landmark,
            notes: formData.notes || 'بدون ملاحظات',
            payment_method: 'bank_transfer',
            imageData,
            transferImageMime: imageMime,
          }),
        });
        if (!notifResponse.ok) {
          const notifError = await notifResponse.json();
          console.error('Notification API error:', notifResponse.status, notifError);
        } else {
          const notifResult = await notifResponse.json();
          console.log('✅ Order notifications sent:', notifResult);
        }
      } catch (notificationError) {
        console.error('Order notifications request failed:', notificationError)
      }

      // Add to order history
      if (addOrder) {
        const fullAddress = `${formData.streetAddress}${formData.landmark ? ` (${formData.landmark})` : ''}, ${formData.city}, ${formData.governorate}`
        addOrder({
          orderId: customerName,
          items: savedItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          totalPrice: savedTotalPrice + SHIPPING_FEE,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          deliveryAddress: fullAddress,
          orderDate: new Date().toISOString(),
          status: 'pending_payment',
          paymentMethod: 'vodafone_instapay',
        })
      }

      localStorage.removeItem('pendingOrderData')
      clearCart()

      // Track order completion
      trackEvent('order_completed', {
        customerName: customerName,
        itemsCount: savedItems.length,
        totalPrice: savedTotalPrice + SHIPPING_FEE,
        governorate: formData.governorate,
        products: savedItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }))
      })

      setSubmittedOrder({
        orderId: customerName,
        items: savedItems,
        totalPrice: savedTotalPrice + SHIPPING_FEE,
        totalQuantity: savedTotalQuantity,
        customerData: { ...formData },
        orderTime: orderDateIso,
      })

      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
      setSubmitted(true)
    } catch (error: any) {
      console.error('❌ Cart order submission error:', error);
      const errorMsg = error?.message || 'حدث خطأ غير معروف';
      setOrderError(errorMsg);
      // Show friendly error - never show technical details
      alert('⚠️ حدث خطأ أثناء معالجة الطلب.\n\nيرجى التأكد من:\n✓ البيانات المدخلة صحيحة\n✓ اتصالك بالإنترنت جيد\n✓ ثم أعد المحاولة');
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted && submittedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
        <PageQuickActions />
        <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
          {/* Success Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">
                <span className="gradient-text">Thank You!</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
                Your order has been confirmed successfully
              </p>
            </div>
          </div>

          {/* Screenshot Notice */}
          <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">📸</span>
              <div className="text-center">
                <p className="text-yellow-700 dark:text-yellow-400 font-bold text-sm sm:text-base md:text-lg">Save Your Order Details</p>
                <p className="text-yellow-600/80 dark:text-yellow-500/80 text-xs sm:text-sm">Take a screenshot of this receipt for your records</p>
              </div>
            </div>
          </div>

          {/* Order Receipt Card */}
          <div className="premium-card rounded-2xl sm:rounded-3xl overflow-hidden">
            {/* Receipt Header */}
            <div className="relative bg-gradient-to-r from-accent via-pink-500 to-accent text-white p-4 sm:p-6 md:p-8 text-center overflow-hidden">
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-4">
                  <span className="text-xs sm:text-sm font-medium">Order Confirmed</span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Order Receipt</h2>
                <p className="text-white/70 text-xs sm:text-sm mt-1 sm:mt-2">{submittedOrder.orderTime}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-3 sm:p-4 md:p-6 border-b border-border/50">
              <h3 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-base sm:text-xl">👤</span> Customer Information
              </h3>
              <div className="grid gap-2 sm:gap-3 text-xs sm:text-sm bg-muted/30 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-muted-foreground">Full Name</span>
                  <span className="font-semibold">{submittedOrder.customerData.fullName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-semibold font-mono" dir="ltr">{submittedOrder.customerData.phone}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-semibold text-xs sm:text-sm font-mono break-all" dir="ltr">{submittedOrder.customerData.email}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-3 sm:p-4 md:p-6 border-b border-border/50">
              <h3 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-base sm:text-xl">📍</span> Delivery Address
              </h3>
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

            {/* Products */}
            <div className="p-3 sm:p-4 md:p-6 border-b border-border">
              <h3 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-base sm:text-lg md:text-xl">📦</span> Products ({submittedOrder.totalQuantity} items)
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {submittedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-muted/30 rounded-lg sm:rounded-xl p-2 sm:p-3">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-md sm:rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-xs sm:text-sm md:text-base">{item.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-accent text-xs sm:text-sm md:text-base">{item.price * item.quantity} EGP</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{item.price} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-3 sm:p-4 md:p-6 bg-accent/5">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-base sm:text-lg md:text-xl">
                  <span className="font-bold">Subtotal:</span>
                  <span className="font-bold text-foreground">{submittedOrder.totalPrice - SHIPPING_FEE} EGP</span>
                </div>
                <div className="flex justify-between items-center text-base sm:text-lg md:text-xl">
                  <span className="font-bold">Shipping (all Egypt):</span>
                  <span className="font-bold text-blue-600">+70 EGP</span>
                </div>
                <div className="flex justify-between items-center text-base sm:text-lg md:text-xl mt-2">
                  <span className="font-bold">💰 Total:</span>
                  <span className="font-bold text-accent text-lg sm:text-xl md:text-2xl">{submittedOrder.totalPrice} EGP</span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="p-3 sm:p-4 md:p-6 text-center space-y-2 sm:space-y-3 bg-muted/20">
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <span className="text-base sm:text-lg md:text-xl">✅</span>
                <span className="font-semibold text-xs sm:text-sm md:text-base">Your order has been confirmed!</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground px-2">
                We will contact you at <strong dir="ltr" className="break-all">{submittedOrder.customerData.phone}</strong> to confirm delivery details
              </p>
              <div className="flex items-center justify-center gap-4 pt-1 sm:pt-2 text-muted-foreground text-[10px] sm:text-xs">
                <span>📧 luqitchycosmetics@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:gap-4 justify-center px-2 sm:px-0">
            <Button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 h-10 sm:h-11 md:h-12 px-6 sm:px-8 rounded-lg sm:rounded-xl text-sm sm:text-base"
            >
              🏠 Back to Home
            </Button>
            <Button
              onClick={() => router.push('/#products')}
              variant="outline"
              className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 rounded-lg sm:rounded-xl border-2 text-sm sm:text-base"
            >
              🛍️ Shop More
            </Button>
          </div>

          {/* Brand */}
          <div className="text-center pt-2 sm:pt-4">
            <p className="text-xl sm:text-2xl font-serif font-bold gradient-text">Luqitchy Cosmetics</p>
            <p className="text-xs sm:text-sm text-muted-foreground">✨ Your beauty starts here</p>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-3 sm:p-4 bg-gradient-to-br from-background via-secondary/20 to-background text-center space-y-4 sm:space-y-6">
        <PageQuickActions />
        <div className="bg-muted/30 backdrop-blur-sm rounded-full p-5 sm:p-6 md:p-8">
          <ShoppingCart className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-muted-foreground" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold px-4">Shopping Cart is Empty</h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">You haven't added any products yet</p>
        <Button
          onClick={() => router.push('/#products')}
          className="mt-4 sm:mt-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 h-10 sm:h-12 px-6 sm:px-8 rounded-lg sm:rounded-xl text-sm sm:text-base"
        >
          Browse Products
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-3 sm:p-4 md:p-6">
      <PageQuickActions />
      {/* Payment Modal for Visa/PayPal */}
      {showPaymentModal && paymentIframeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-accent/10 to-primary/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {formData.paymentMethod === 'visa' ? '💳' : '🅿️'}
                </span>
                <div>
                  <h3 className="font-semibold text-lg">
                    {formData.paymentMethod === 'visa' ? 'Secure Card Payment' : 'PayPal Payment'}
                  </h3>
                  <p className="text-xs text-muted-foreground">Complete your payment securely</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false)
                  setPaymentIframeUrl("")
                }}
                className="p-2 hover:bg-destructive/10 rounded-full transition-colors text-muted-foreground hover:text-destructive"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <iframe
                src={paymentIframeUrl}
                className="w-full h-[500px] rounded-xl border border-border/30"
                title="Payment"
                allow="payment"
              />
            </div>
            <div className="p-4 border-t border-border/50 bg-muted/30">
              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                <span>🔒</span> Secured by Paymob - Your payment details are encrypted
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bill Reference Display for Aman/Masary and Fawry/Kiosk */}
      {billReferenceData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className={`p-6 text-center ${billReferenceData.paymentType === 'cashcollection' ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10' : 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10'}`}>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/80 dark:bg-black/20 flex items-center justify-center text-5xl shadow-lg">
                {billReferenceData.paymentType === 'cashcollection' ? '🏪' : '🎫'}
              </div>
              <h3 className="font-bold text-2xl mb-2">Order Confirmed!</h3>
              <p className="text-muted-foreground">Your order has been placed successfully</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                <div className="border-t border-border/50 pt-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      {billReferenceData.isRealBillRef ? '💳 Bill Reference Number' : '🧪 Transaction ID (Test Mode)'}
                    </p>
                    <p className="text-3xl font-bold font-mono tracking-wider text-accent">{billReferenceData.billReference}</p>
                  </div>
                </div>
              </div>
              
              {/* Warning for sandbox/test mode */}
              {!billReferenceData.isRealBillRef && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                    <span>⚠️</span>
                    <span><strong>Test Mode:</strong> This is a transaction ID, not a real bill reference. In production, you'll receive a valid bill reference that customers can use to pay at outlets.</span>
                  </p>
                </div>
              )}
              
              <div className={`rounded-xl p-4 ${billReferenceData.paymentType === 'cashcollection' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  {billReferenceData.paymentType === 'cashcollection' ? '🏪 How to Pay:' : '🎫 How to Pay:'}
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {billReferenceData.paymentType === 'cashcollection' ? (
                    <>
                      <li>• Visit any <strong>Aman</strong> or <strong>Masary</strong> outlet</li>
                      <li>• Tell the cashier you want to pay a bill</li>
                      <li>• Provide the Bill Reference Number above</li>
                      <li>• Pay the amount and keep your receipt</li>
                    </>
                  ) : (
                    <>
                      <li>• Visit any <strong>Fawry</strong> outlet or use Fawry app</li>
                      <li>• Select "Pay Bills" or "Payments"</li>
                      <li>• Enter the Bill Reference Number above</li>
                      <li>• Pay the amount and keep your receipt</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(billReferenceData.billReference)
                    alert('✅ Bill Reference copied to clipboard!')
                  }}
                  className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  📋 Copy Reference
                </button>
                <button
                  onClick={() => {
                    setBillReferenceData(null)
                    router.push(`/order/confirmation?orderId=${billReferenceData.orderId}&billRef=${billReferenceData.billReference}`)
                  }}
                  className="flex-1 py-3 px-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl font-medium transition-colors"
                >
                  Done ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vodafone Cash Payment Pending Modal */}
      {walletPaymentPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center bg-gradient-to-br from-red-500/20 to-red-600/10">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/80 dark:bg-black/20 flex items-center justify-center shadow-lg">
                <div className="animate-pulse text-5xl">📱</div>
              </div>
              <h3 className="font-bold text-2xl mb-2 text-red-600 dark:text-red-400">Check Your Phone!</h3>
              <p className="text-muted-foreground">Vodafone Cash payment request sent</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground"> Phone Number</span>
                  <span className="font-mono font-semibold">{walletPaymentPending.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">💰 Amount</span>
                  <span className="font-bold text-accent">{walletPaymentPending.amount} EGP</span>
                </div>
              </div>
              
              <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/20">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  📱 Complete Your Payment:
                </p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Open your <strong className="text-red-600 dark:text-red-400">Vodafone Cash</strong> app or dial <strong>*9*</strong></li>
                  <li>You should receive a <strong>payment request notification</strong></li>
                  <li>Enter your <strong>PIN code</strong> to confirm the payment</li>
                  <li>Wait for the confirmation SMS</li>
                </ol>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                  <span>⚠️</span>
                  <span>Make sure you have sufficient balance in your Vodafone Cash wallet. The payment request expires in 15 minutes.</span>
                </p>
              </div>
              
              <button
                onClick={() => {
                  setWalletPaymentPending(null)
                  router.push(`/order/confirmation?orderId=${walletPaymentPending.orderId}&payment=vodafone`)
                }}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                ✅ I've Completed the Payment
              </button>
              
              <p className="text-xs text-center text-muted-foreground">
                Didn't receive a notification? Make sure your phone number ({walletPaymentPending.phone}) is registered with Vodafone Cash.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-accent mb-4 sm:mb-6 md:mb-8 transition-colors text-sm sm:text-base"
        >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Continue Shopping
      </Link>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold gradient-text">Shopping Cart</h1>
              <Button
                onClick={clearCart}
                variant="outline"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 text-xs sm:text-sm self-start sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:ml-2" />
                Clear Cart
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-3 sm:mb-4 opacity-50" />
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6">Your cart is empty</p>
                <Button asChild className="bg-gradient-to-r from-accent to-accent/80 text-sm sm:text-base">
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex gap-6">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                          <p className="text-accent font-bold mt-1">{item.price} EGP</p>
                        </div>
                        <Button
                          onClick={() => removeFromCart(item.id)}
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-2xl font-bold w-12 text-center">{item.quantity}</span>
                        <Button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <div className="mr-auto">
                          <span className="text-lg font-semibold text-accent">
                            {item.price * item.quantity} EGP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </>
            )}
          </div>

          {/* Order Form */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-border shadow-xl sticky top-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4 sm:mb-6">Complete Your Order</h2>

              <div className="bg-accent/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-accent/20">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                    <span className="text-muted-foreground">Products ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span className="font-semibold">{totalPrice} EGP</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="font-semibold text-blue-700">Shipping (all Egypt)</span>
                    <span className="font-semibold text-blue-700">+70 EGP</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-accent/20">
                    <span className="text-base sm:text-lg font-bold">Total</span>
                    <span className="text-xl sm:text-2xl font-bold text-accent">{totalWithShipping} EGP</span>
                  </div>
                </div>
              </div>

              <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium mb-1">Full Name (4 parts) *</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="e.g. Ahmed Mohamed Ali Hassan"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-accent transition-all text-xs sm:text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium mb-1">Email (for tracking) *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-accent transition-all text-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium mb-1">Phone (for calls) *</label>
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
                    className="w-full p-3 border rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-accent transition-all text-sm"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium">WhatsApp *</label>
                    <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => {
                          setSameAsPhone(e.target.checked);
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, whatsapp: prev.phone }));
                          }
                        }}
                        className="rounded w-3 h-3"
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
                    className="w-full p-3 border rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-accent transition-all text-sm disabled:opacity-60"
                  />
                </div>

                {/* Address Section */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <h4 className="font-medium text-xs pt-2">📍 Delivery Address</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">Governorate *</label>
                      <input
                        type="text"
                        name="governorate"
                        placeholder="e.g. Cairo"
                        value={formData.governorate}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg bg-background/50 focus:ring-2 focus:ring-accent transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="e.g. Nasr City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg bg-background/50 focus:ring-2 focus:ring-accent transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Street Address *</label>
                    <input
                      type="text"
                      name="streetAddress"
                      placeholder="Building, Street, Floor, Apt"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded-lg bg-background/50 focus:ring-2 focus:ring-accent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="e.g. Near City Stars"
                      value={formData.landmark}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg bg-background/50 focus:ring-2 focus:ring-accent transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium mb-1">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    placeholder="Any special instructions..."
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full p-2 border rounded-lg bg-background/50 focus:ring-2 focus:ring-accent transition-all resize-none text-sm"
                  />
                </div>

                {/* Payment Method - Vodafone Cash & InstaPay */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="flex flex-col items-start gap-1 pt-2">
                    <span className="text-2xl">💳</span>
                    <h4 className="font-medium text-base">Payment Method</h4>
                    <span className="text-accent text-lg">*</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl">💳</span>
                    <p className="text-sm text-muted-foreground font-semibold">Vodafone Cash Wallet & InstaPay</p>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 mb-2">Send payment to Vodafone Cash wallet or InstaPay and attach the payment confirmation screenshot</p>
                  <div className="bg-white/30 dark:bg-black/30 rounded-lg p-3 mb-3 border border-red-500/20">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Vodafone Cash / InstaPay Number:</p>
                      <p className="text-base font-mono font-bold text-lg text-red-600 dark:text-red-400 flex items-center gap-2">💳 <span dir="ltr">01012622315</span></p>
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground mb-3">

                    <li>✅ Secure wallet or bank payment</li>
                    <li>✅ Instant confirmation</li>
                    <li>✅ Protected transaction</li>
                  </ul>
                </div> {/* <-- Close payment method section's div */}

                {/* Payment Confirmation Upload - MANDATORY */}
                <PaymentConfirmationUpload
                  transferImage={transferImage}
                  imagePreview={imagePreview}
                  onImageChange={handleImageChange}
                  isRequired={true}
                  disabled={isSubmitting}
                />
                  <div className="text-xs sm:text-sm text-blue-700 font-semibold mb-2 text-center">
                    🚚 Shipping to all governorates: <span className="font-bold">70 EGP</span> only
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-lg rounded-xl transition-all duration-300 shadow-lg shadow-accent/30"
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 ml-2" />
                        Complete Order ({totalWithShipping} EGP)
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
}
