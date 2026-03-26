"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, ShoppingCart, Plus, Minus, Check } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useOrderHistory } from "@/context/OrderHistoryContext"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { PageQuickActions } from "@/components/page-quick-actions"
import { compressImage } from "@/lib/image-compression"
import { getAnalyticsSessionId, trackEvent } from "@/lib/analytics-client"

interface ProductPageProps {
  product: {
    id: string
    name: string
    image: string
    images?: string[]
    price: number
    color: string
    features?: string[]
    description?: string
    oldPrice?: number
    isLimitedOffer?: boolean
    shadeOptions?: string[]
  }
}
export default ProductPage;

export function ProductPage({ product }: ProductPageProps) {
  // For image carousel
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);
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
  const [orderError, setOrderError] = useState<string>("")
  
  // Save submitted order data
  const [submittedOrder, setSubmittedOrder] = useState<{
    orderId: string;
    items: { id: string; name: string; price: number; quantity: number; image: string; shade?: string }[];
    totalPrice: number;
    totalQuantity: number;
    customerData: typeof formData;
    orderTime: string;
  } | null>(null)
  const [selectedShade, setSelectedShade] = useState(
    product.shadeOptions && product.shadeOptions.length > 0 ? product.shadeOptions[0] : ""
  )

  const productDisplayName = selectedShade ? `${product.name} (Shade: ${selectedShade})` : product.name

  // Track product view on mount
  useEffect(() => {
    trackEvent('product_viewed', {
      productId: product.id,
      productName: product.name,
      price: product.price,
      color: product.color,
    })
  }, [product.id, product.name, product.price, product.color])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      compressImage(file)
        .then((result) => {
          setTransferImage(result.file)
          setImagePreview(result.preview)
        })
        .catch((error) => {
          // Silently ignore image compression errors
          setTransferImage(null)
          setImagePreview("")
        })
    }
  }

  const handleAddToCart = () => {
    const cartItemId = selectedShade ? `${product.id}-${selectedShade.toLowerCase()}` : product.id
    trackEvent('add_to_cart', { productId: product.id, productName: productDisplayName, quantity })
    addToCart({
      id: cartItemId,
      name: productDisplayName,
      price: product.price,
      image: product.image,
      color: product.color,
      shade: selectedShade || undefined,
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

    setIsSubmitting(true)
    trackEvent('checkout_started', { source: 'product_page', productId: product.id })
    const total_price = quantity * product.price

    // Always allow order submission, even if image upload fails
    let imageData = null
    let imageMime = null
    if (transferImage && imagePreview) {
      imageData = imagePreview
      imageMime = 'image/jpeg'
    }

    // UNIFIED ORDER PROCESSING - Single call to /api/create-order
    const orderPayload = {
      products: [{
        name: productDisplayName,
        quantity: quantity,
        price: product.price,
        total: quantity * product.price,
        shade: selectedShade || undefined,
      }],
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
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
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const result = await response.json();
      console.log('🔍 Create Order Response:', { status: response.status, result });
      
      if (!response.ok || !result.success) {
        const errorMsg = result.error || `Order creation failed (Status: ${response.status})`;
        console.error('❌ Order creation error:', errorMsg, result);
        setOrderError(errorMsg);
        alert(`❌ خطأ في الطلب:\n${errorMsg}\n\nيرجى التحقق من البيانات و إعادة المحاولة`);
        setIsSubmitting(false);
        return;
      }
      const generatedOrderId = result.orderNumber || result.orderId;
      if (!generatedOrderId) {
        console.error('❌ No order ID returned:', result);
        setOrderError('لم يتم الحصول على رقم الطلب');
        alert('❌ خطأ: لم يتم الحصول على رقم الطلب');
        setIsSubmitting(false);
        return;
      }
      const orderDateIso = result.order?.createdAt || result.orderDate || new Date().toISOString();
      const orderDateReadable = new Date(orderDateIso).toLocaleString("en-GB");

      try {
        const notifResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: generatedOrderId,
            order_date: orderDateReadable,
            order_type: 'single_product',
            customer_name: formData.fullName,
            customer_email: formData.email,
            phone: formData.phone,
            whatsapp: formData.whatsapp || formData.phone,
            products: [{
              name: productDisplayName,
              quantity,
              price: product.price,
              total: quantity * product.price,
            }],
            total_amount: total_price + 70,
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

      // Save to order history
      const fullAddressForHistory = `${formData.streetAddress}${formData.landmark ? ` (${formData.landmark})` : ''}, ${formData.city}, ${formData.governorate}`;
      addOrder({
        orderId: generatedOrderId,
        items: [{
          id: product.id,
          name: productDisplayName,
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
        status: 'pending_payment',
        paymentMethod: 'bank_transfer',
      });

      localStorage.removeItem('pendingOrderData');

      // Track order completion
      trackEvent('order_completed', {
        orderId: generatedOrderId,
        productId: product.id,
        productName: productDisplayName,
        quantity,
        totalPrice: total_price,
        governorate: formData.governorate,
      })

      // Show order confirmation
      setSubmittedOrder({
        orderId: generatedOrderId,
        items: [{
          id: product.id,
          name: productDisplayName,
          price: product.price,
          quantity: quantity,
          image: product.image,
          shade: selectedShade || undefined,
        }],
        totalPrice: total_price,
        totalQuantity: quantity,
        customerData: formData,
        orderTime: orderDateIso,
      });

      // Scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      setSubmitted(true);
    } catch (error: any) {
      console.error('❌ Order submission error:', error);
      setOrderError(error.message || 'حدث خطأ في إرسال الطلب');
      alert(`❌ خطأ في إتمام الطلب:\n${error.message}\n\nيرجى إعادة المحاولة`);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show success receipt after order submission
  if (submitted && submittedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
        <PageQuickActions />
        <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
          {/* Success Header */}
          <div className="text-center space-y-3 sm:space-y-4 animate-slide-up opacity-0" style={{ animationDelay: "0.1s" }}>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto">
              <div className="absolute inset-0 animate-pulse-ring">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-green-500/20" />
              </div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 animate-success-check">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
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
                    <h3 className="text-sm sm:text-base md:text-lg font-bold">Product Details ({submittedOrder.totalQuantity} items)</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {submittedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 order-card">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-white/50">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm sm:text-base md:text-lg mb-1">{item.name}</p>
                          {item.shade && (
                            <p className="text-xs sm:text-sm font-semibold text-accent mb-1">Shade: {item.shade}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                            <span className="bg-accent/10 px-2 sm:px-3 py-1 rounded-full">Qty: {item.quantity}</span>
                            <span>{item.price} EGP each</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs sm:text-sm text-muted-foreground">Subtotal</p>
                          <p className="font-bold text-accent text-base sm:text-lg md:text-xl">{item.price * item.quantity} EGP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-base">
                      <span className="font-semibold">Subtotal:</span>
                      <span>{submittedOrder.totalPrice} EGP</span>
                    </div>
                    <div className="flex justify-between items-center text-base">
                      <span className="font-semibold text-blue-700">Shipping (all Egypt):</span>
                      <span className="text-blue-700">+70 EGP</span>
                    </div>
                    <div className="flex justify-between items-center text-lg mt-2">
                      <span className="font-bold">Order Total:</span>
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent">{submittedOrder.totalPrice + 70} EGP</span>
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
      <PageQuickActions />
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
          {/* Product Image Carousel */}
          <div className="animate-slide-in-left opacity-0" style={{ animationDelay: "0.1s" }}>
            <div className="sticky top-4 sm:top-6 md:top-8">
              <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl shadow-primary/20 group bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 select-none">
                {/* Slider arrows always visible on all devices */}
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-accent/80 text-accent hover:text-white rounded-full p-1 shadow-md focus:outline-none"
                      onClick={() => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      aria-label="Previous image"
                      type="button"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-accent/80 text-accent hover:text-white rounded-full p-1 shadow-md focus:outline-none"
                      onClick={() => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      aria-label="Next image"
                      type="button"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                {/* Touch swipe support (all devices) */}
                <div
                  className="w-full h-full relative"
                  onTouchStart={e => {
                    if (images.length < 2) return;
                    const touchStartX = e.touches[0].clientX;
                    let handled = false;
                    const handleTouchMove = (moveEvent: TouchEvent) => {
                      const diff = moveEvent.touches[0].clientX - touchStartX;
                      if (!handled && Math.abs(diff) > 40) {
                        handled = true;
                        if (diff > 0) setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1);
                        else setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1);
                        window.removeEventListener('touchmove', handleTouchMove);
                      }
                    };
                    window.addEventListener('touchmove', handleTouchMove);
                    window.addEventListener('touchend', () => {
                      window.removeEventListener('touchmove', handleTouchMove);
                    }, { once: true });
                  }}
                  onMouseDown={e => {
                    if (images.length < 2) return;
                    const mouseStartX = e.clientX;
                    let handled = false;
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const diff = moveEvent.clientX - mouseStartX;
                      if (!handled && Math.abs(diff) > 40) {
                        handled = true;
                        if (diff > 0) setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1);
                        else setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1);
                        window.removeEventListener('mousemove', handleMouseMove);
                        window.removeEventListener('mouseup', handleMouseUp);
                      }
                    };
                    const handleMouseUp = () => {
                      window.removeEventListener('mousemove', handleMouseMove);
                    };
                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseUp, { once: true });
                  }}
                  style={{ touchAction: 'pan-y', cursor: images.length > 1 ? 'grab' : 'default' }}
                >
                  <Image 
                    src={images[activeImage]}
                    alt={product.name}
                    fill
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    priority
                    draggable={false}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  {/* Premium overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Floating badge */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 premium-badge px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm shadow-lg">
                    {product.isLimitedOffer ? '⏳ Limited Offer' : '✨ Premium'}
                  </div>
                </div>
                {/* Carousel Thumbnails - clearer and larger on all devices */}
                {images.length > 1 && (
                  <div className="flex justify-center gap-3 mt-3 sm:mt-4">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none ${i === activeImage ? 'border-accent bg-accent/90 scale-110' : 'border-muted bg-muted/70 opacity-70'}`}
                        onClick={() => setActiveImage(i)}
                        aria-label={`Show image ${i + 1}`}
                        type="button"
                        style={{ boxShadow: i === activeImage ? '0 0 0 2px #fff, 0 2px 8px #ffb6c1' : undefined }}
                      >
                        <Image src={img} alt={`Thumbnail ${i + 1}`} width={36} height={36} className="rounded-full object-cover w-full h-full" />
                      </button>
                    ))}
                  </div>
                )}
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
                {product.oldPrice && (
                  <>
                    <span className="text-base sm:text-lg md:text-xl text-muted-foreground line-through">{product.oldPrice} EGP</span>
                    <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                      Save {product.oldPrice - product.price} EGP
                    </span>
                  </>
                )}
                {product.id === "lip-balm" ? (
                  <>
                    <span className="text-base sm:text-lg md:text-xl text-muted-foreground line-through">100 EGP</span>
                    <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                      Save 35 EGP
                    </span>
                  </>
                ) : ["black-honey", "burgundy", "wine", "mocha", "strawberry-milk"].includes(product.id) ? (
                  <>
                    <span className="text-base sm:text-lg md:text-xl text-muted-foreground line-through">150 EGP</span>
                    <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                      Save 51 EGP
                    </span>
                  </>
                ) : null}
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
                  {(product.features ?? []).map((f, i) => (
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
                {product.shadeOptions && product.shadeOptions.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span>🎨</span> Choose Shade <span className="text-accent">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {product.shadeOptions.map((shade) => {
                        const isSelected = selectedShade === shade
                        return (
                          <button
                            key={shade}
                            type="button"
                            onClick={() => setSelectedShade(shade)}
                            className={`text-sm font-semibold rounded-xl border px-4 py-3 transition-all duration-200 ${
                              isSelected
                                ? "bg-accent text-white border-accent shadow-md"
                                : "bg-background/50 border-border hover:border-accent/50"
                            }`}
                            aria-pressed={isSelected}
                          >
                            {shade}
                          </button>
                        )
                      })}
                    </div>
                    <input type="hidden" name="shade" value={selectedShade} required />
                  </div>
                )}

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

                {/* Payment Method - Vodafone Cash Wallet & InstaPay */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="text-lg">💳</span> Payment Method <span className="text-accent">*</span>
                  </div>
                  <div className="premium-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 bg-gradient-to-br from-red-500/10 to-pink-500/10 border-2 border-red-500/30">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">💳</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">Vodafone Cash Wallet & InstaPay</h3>
                        <p className="text-sm text-muted-foreground mb-3">Send payment to <b>Vodafone Cash wallet</b> or <b>InstaPay</b> and attach the payment confirmation screenshot</p>
                        <div className="bg-white/30 dark:bg-black/30 rounded-lg p-3 mb-3 border border-red-500/20">
                          <p className="text-sm text-muted-foreground mb-1">Vodafone Cash / InstaPay Number:</p>
                          <p className="text-sm font-mono font-bold text-lg text-red-600 dark:text-red-400">💳 <span dir="ltr">01012622315</span></p>
                        </div>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>✅ Secure wallet or bank payment</li>
                          <li>✅ Instant confirmation</li>
                          <li>✅ Protected transaction</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Image Upload */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <span>📸</span> Attach Payment Confirmation
                    </label>
                    
                    <div className="relative">
                      <input
                        type="file"
                        id="transferImage"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      <label 
                        htmlFor="transferImage"
                        className="block w-full p-4 rounded-xl border-2 border-dashed border-accent/50 hover:border-accent bg-accent/5 hover:bg-accent/10 cursor-pointer transition-all duration-300 text-center"
                      >
                        {imagePreview ? (
                          <div className="space-y-2">
                            <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden border border-accent/30">
                              <Image src={imagePreview} alt="Payment confirmation" fill unoptimized className="w-full h-full object-cover" />
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
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Order Total:</span>
                      <span className="text-2xl font-bold text-accent">{quantity * product.price} EGP</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-700">Shipping (all Egypt):</span>
                      <span className="text-blue-700">+70 EGP</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold">Total with Shipping:</span>
                      <span className="text-2xl font-bold text-green-700">{quantity * product.price + 70} EGP</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="w-full h-16 luxury-btn text-xl rounded-2xl transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : uploadingImage ? (
                    <>Uploading Image...</>
                  ) : (
                    <>
                      <span className="mr-2">🏦</span>
                      Complete Order ({quantity * product.price + 70} EGP)
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </Button>

                <div className="text-xs text-blue-700 font-semibold text-center mt-2">
                  🚚 Shipping to all governorates: 70 EGP only
                </div>

                <p className="text-center text-xs text-muted-foreground mt-1">
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
