/**
 * FIXED handleSubmit for cart/page.tsx
 * 
 * Key changes:
 * 1. ✅ NO VALIDATION ALERTS - Let backend validate
 * 2. ✅ IMMEDIATE REDIRECT - Show submitted page instantly
 * 3. ✅ FIRE-AND-FORGET - Async background submission
 * 4. ✅ AUTO-RETRY - 3 attempts with exponential backoff
 * 5. ✅ NO ERROR POPUPS - Only console errors
 */

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Prevent double submission
  if (isSubmitting || items.length === 0) return

  // ✅ IMMEDIATELY redirect - don't wait for API
  setIsSubmitting(true)
  trackEvent("checkout_started", { source: "cart_page", itemsCount: items.length })

  const savedItems = [...items]
  const savedTotalPrice = totalPrice
  const savedTotalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const tempOrderId = `ORD-${Date.now()}`

  setSubmittedOrder({
    orderId: tempOrderId,
    items: savedItems,
    totalPrice: savedTotalPrice + SHIPPING_FEE,
    totalQuantity: savedTotalQuantity,
    customerData: formData,
    orderTime: new Date().toISOString(),
  })

  setSubmitted(true)
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })

  // 🔥 Fire-and-forget: submit order in background WITHOUT blocking UI
  submitCartOrderInBackground({
    savedItems,
    savedTotalPrice,
    savedTotalQuantity,
    formData,
    sameAsPhone,
    transferImage,
    imagePreview,
    tempOrderId,
  }).catch((error) => {
    // Silently ignore any errors
    console.error("[BG] Background error (non-blocking):", error)
  })
}

const submitCartOrderInBackground = async (params: any) => {
  const {
    savedItems,
    savedTotalPrice,
    savedTotalQuantity,
    formData,
    sameAsPhone,
    transferImage,
    imagePreview,
    tempOrderId,
  } = params

  const submitWithRetry = async (attempt = 1, maxAttempts = 3) => {
    try {
      let imageData = null
      let imageMime = null
      if (transferImage && imagePreview) {
        imageData = imagePreview
        imageMime = "image/jpeg"
      }

      const orderPayload = {
        products: savedItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
          shade: item.shade || undefined,
        })),
        customer: {
          fullName: formData.fullName || "N/A",
          email: formData.email || "no-reply@luqitchy.com",
          phone: formData.phone || "+20 Unknown",
          whatsapp: sameAsPhone
            ? formData.phone || "+20 Unknown"
            : formData.whatsapp || "+20 Unknown",
          governorate: formData.governorate || "Unknown",
          city: formData.city || "Unknown",
          streetAddress: formData.streetAddress || "Unknown",
          landmark: formData.landmark || "N/A",
          notes: formData.notes || "بدون ملاحظات",
        },
        imageData,
        transferImageMime: imageMime,
        sessionId: getAnalyticsSessionId?.() || "",
      }

      console.log(`📤 [Cart Attempt ${attempt}/${maxAttempts}] Submitting cart order...`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const result = await response.json()
      console.log(`✅ [Cart] Create order response: ${result.orderNumber}`)

      if (!result.success) {
        throw new Error("API returned success: false")
      }

      const generatedOrderId = result.orderNumber || result.orderId
      const orderDateIso =
        result.order?.createdAt ||
        result.orderDate ||
        new Date().toISOString()
      const orderDateReadable = new Date(orderDateIso).toLocaleString("en-GB")

      // Send notifications in background
      sendCartNotificationsAsync({
        generatedOrderId,
        orderDateReadable,
        savedItems,
        savedTotalPrice,
        formData,
        sameAsPhone,
        imageData,
        imageMime,
      }).catch((err) => {
        console.error("[Notifications] Background error:", err)
      })

      // Save to order history
      if (addOrder) {
        const fullAddress = `${formData.streetAddress}${
          formData.landmark ? ` (${formData.landmark})` : ""
        }, ${formData.city}, ${formData.governorate}`
        addOrder({
          orderId: generatedOrderId,
          items: savedItems.map((item) => ({
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
          status: "pending_payment",
          paymentMethod: "vodafone_instapay",
        })
      }

      localStorage.removeItem("pendingOrderData")
      clearCart()

      trackEvent?.("order_completed", {
        orderId: generatedOrderId,
        itemsCount: savedItems.length,
        totalPrice: savedTotalPrice + SHIPPING_FEE,
        governorate: formData.governorate,
        products: savedItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
        })),
      })

      console.log(`✅ [Success] Cart Order ${generatedOrderId} processed successfully`)
    } catch (error: any) {
      console.error(
        `❌ [Cart Attempt ${attempt}/${maxAttempts}] Error:`,
        error.message
      )

      // Retry with exponential backoff
      if (attempt < maxAttempts) {
        const delay = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s
        console.log(`⏳ Retrying in ${delay}ms...`)
        setTimeout(() => submitWithRetry(attempt + 1, maxAttempts), delay)
      } else {
        console.error(
          `❌ [Failed] Cart order submission failed after ${maxAttempts} attempts`
        )
      }
    }
  }

  submitWithRetry()
}

// Send notifications in background without blocking
const sendCartNotificationsAsync = async (params: any) => {
  const {
    generatedOrderId,
    orderDateReadable,
    savedItems,
    savedTotalPrice,
    formData,
    sameAsPhone,
    imageData,
    imageMime,
  } = params

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: generatedOrderId,
        order_date: orderDateReadable,
        order_type: "cart",
        customer_name: formData.fullName,
        customer_email: formData.email,
        phone: formData.phone,
        whatsapp: sameAsPhone ? formData.phone : formData.whatsapp,
        products: savedItems.map((item) => ({
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
        notes: formData.notes || "بدون ملاحظات",
        payment_method: "bank_transfer",
        imageData,
        transferImageMime: imageMime,
      }),
    })

    if (!response.ok) {
      console.error(`Notification API returned error: ${response.status}`)
    } else {
      console.log("✅ Cart notifications sent successfully")
    }
  } catch (error) {
    console.error("[Notifications] Cart request failed:", error)
  }
}
