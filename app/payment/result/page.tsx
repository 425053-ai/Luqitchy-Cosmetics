"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, Home, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { useOrderHistory } from "@/context/OrderHistoryContext"
import { sendTelegramMessage } from "@/lib/telegram-service"

function PaymentResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const { addOrder } = useOrderHistory()
  
  const [isProcessing, setIsProcessing] = useState(true)
  const [orderProcessed, setOrderProcessed] = useState(false)

  const success = searchParams.get('success') === 'true'
  const orderId = searchParams.get('orderId')
  const transactionId = searchParams.get('transactionId')
  const amount = searchParams.get('amount')

  useEffect(() => {
    const processOrder = async () => {
      if (success && !orderProcessed) {
        try {
          // Get order data from localStorage
          const pendingOrderData = localStorage.getItem('pendingOrderData')
          
          if (pendingOrderData) {
            const orderData = JSON.parse(pendingOrderData)
            
            // Send Telegram notification
            await sendTelegramMessage(`
💳 <b>دفع ناجح - طلب #${orderId}</b>

━━━━━━━━━━━━━━━━━━━━

✅ <b>تم الدفع بنجاح!</b>
• رقم المعاملة: ${transactionId}
• المبلغ: ${amount} جنيه
• طريقة الدفع: ${orderData.paymentMethod === 'visa' ? 'فيزا/ماستركارد' : 'فودافون كاش'}

👤 <b>بيانات العميل:</b>
• الاسم: ${orderData.customerData.fullName}
• الإيميل: ${orderData.customerData.email}
• تليفون: ${orderData.customerData.phone}

📍 <b>العنوان:</b>
• ${orderData.customerData.streetAddress}
• ${orderData.customerData.city}, ${orderData.customerData.governorate}

📦 <b>المنتجات:</b>
${orderData.items.map((item: any) => `• ${item.name} × ${item.quantity}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━

📅 <b>التاريخ:</b> ${new Date().toLocaleString('ar-EG')}
            `.trim())

            // Add to order history
            addOrder({
              orderId: orderId || `ORD-${Date.now()}`,
              items: orderData.items,
              totalPrice: parseFloat(amount || '0'),
              customerName: orderData.customerData.fullName,
              customerEmail: orderData.customerData.email,
              customerPhone: orderData.customerData.phone,
              deliveryAddress: `${orderData.customerData.streetAddress}, ${orderData.customerData.city}, ${orderData.customerData.governorate}`,
              orderDate: new Date().toISOString(),
              status: 'confirmed',
            })

            // Clear cart
            clearCart()
            
            // Clear pending order data
            localStorage.removeItem('pendingOrderData')
          }
          
          setOrderProcessed(true)
        } catch (error) {
          console.error('Error processing order:', error)
        }
      }
      
      setIsProcessing(false)
    }

    processOrder()
  }, [success, orderId, transactionId, amount, orderProcessed, addOrder, clearCart])

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto" />
          <p className="text-lg text-muted-foreground">جاري معالجة طلبك...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border text-center space-y-6">
          {success ? (
            <>
              {/* Success Icon */}
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-14 h-14 text-green-500" />
                </div>
                <div className="absolute inset-0 w-24 h-24 mx-auto bg-green-500/20 rounded-full animate-ping" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-green-500 mb-2">تم الدفع بنجاح! 🎉</h1>
                <p className="text-muted-foreground">شكراً لك، تم استلام طلبك</p>
              </div>

              {/* Order Details */}
              <div className="bg-green-500/10 rounded-2xl p-4 space-y-3 text-right">
                {orderId && (
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-600">#{orderId}</span>
                    <span className="text-sm text-muted-foreground">رقم الطلب</span>
                  </div>
                )}
                {transactionId && (
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm">{transactionId}</span>
                    <span className="text-sm text-muted-foreground">رقم المعاملة</span>
                  </div>
                )}
                {amount && (
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-accent">{amount} EGP</span>
                    <span className="text-sm text-muted-foreground">المبلغ</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                📲 سنتواصل معك قريباً لتأكيد تفاصيل التوصيل
              </p>
            </>
          ) : (
            <>
              {/* Error Icon */}
              <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle className="w-14 h-14 text-red-500" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-red-500 mb-2">فشل الدفع 😔</h1>
                <p className="text-muted-foreground">
                  عذراً، لم نتمكن من إتمام عملية الدفع
                </p>
              </div>

              <div className="bg-red-500/10 rounded-2xl p-4 text-sm text-muted-foreground">
                <p>الأسباب المحتملة:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-right">
                  <li>رصيد غير كافٍ</li>
                  <li>تم رفض البطاقة</li>
                  <li>انتهت صلاحية الجلسة</li>
                  <li>خطأ في البيانات</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                يمكنك المحاولة مرة أخرى أو اختيار طريقة دفع مختلفة
              </p>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => router.push('/')}
              className="w-full h-12 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 rounded-xl"
            >
              <Home className="w-5 h-5 ml-2" />
              العودة للرئيسية
            </Button>
            
            <Button
              onClick={() => router.push('/#products')}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              <ShoppingBag className="w-5 h-5 ml-2" />
              تصفح المنتجات
            </Button>
          </div>

          {/* Brand */}
          <div className="pt-4 border-t border-border">
            <p className="text-xl font-serif font-bold gradient-text">Luqitchy Cosmetics</p>
            <p className="text-xs text-muted-foreground">✨ Your beauty journey starts here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto" />
          <p className="text-lg text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  )
}
