import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      message,
      phone,
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      productName,
      quantity,
      scent,
      totalPrice,
      address,
      notes,
    } = body

    // Using a simple webhook approach to notify the admin
    const adminPhone = "201012622315"

    const whatsappPayload = {
      phone: adminPhone,
      message: `📦 New Order Received!\n\n✨ Order Details:\nOrder ID: ${orderId}\n👤 Customer: ${customerName}\n📱 Phone: ${customerPhone}\n📧 Email: ${customerEmail}\n💄 Product: ${productName}\n🎀 Scent: ${scent}\n📊 Quantity: ${quantity}\n💰 Total: EGP ${totalPrice}\n📍 Address: ${address}\n📝 Notes: ${notes || "None"}`,
    }

    // If you have WhatsApp Business API integration, send here
    // For now, we're logging it for demonstration
    console.log("[v0] WhatsApp message prepared:", whatsappPayload)

    return NextResponse.json({
      success: true,
      message: "WhatsApp notification queued",
      orderId,
    })
  } catch (error) {
    console.error("[v0] WhatsApp API error:", error)
    return NextResponse.json({ success: false, error: "Failed to send WhatsApp notification" }, { status: 500 })
  }
}
