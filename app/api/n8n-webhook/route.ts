import { NextRequest, NextResponse } from "next/server"

// This API route sends order data to n8n webhook
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      console.log("N8N_WEBHOOK_URL not configured, skipping n8n integration")
      return NextResponse.json({ success: true, message: "N8N not configured" })
    }

    // Send order data to n8n
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Order Information
        orderId: orderData.orderId,
        orderDate: new Date().toISOString(),
        
        // Customer Information
        customer: {
          name: orderData.name,
          phone: orderData.phone,
          secondPhone: orderData.secondPhone || null,
          email: orderData.email || null,
          governorate: orderData.governorate,
          city: orderData.city,
          address: orderData.address,
        },
        
        // Product Information
        product: {
          name: orderData.productName,
          price: orderData.price,
          quantity: orderData.quantity || 1,
        },
        
        // Order Details
        totalAmount: orderData.totalAmount || orderData.price,
        notes: orderData.notes || null,
        
        // Source
        source: "Luqitchy Website",
        websiteUrl: "https://luqitchy-cosmetics.vercel.app",
      }),
    })

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.status}`)
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order sent to n8n successfully" 
    })

  } catch (error) {
    console.error("Error sending to n8n:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send to n8n" },
      { status: 500 }
    )
  }
}
