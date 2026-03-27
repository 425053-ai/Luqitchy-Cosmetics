// Create Order API - Firebase-based
import { NextRequest, NextResponse } from "next/server";
import { getNextOrderNumber, createOrder, Order } from "@/lib/firebase-admin";

// ✅ Enhanced validation
function validateOrderInput(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.name || data.name.trim().length === 0) {
    errors.push("الاسم مطلوب");
  }
  if (!data.phone || data.phone.trim().length === 0) {
    errors.push("رقم الهاتف مطلوب");
  }
  if (!data.address || data.address.trim().length === 0) {
    errors.push("العنوان مطلوب");
  }

  // Phone format validation
  if (data.phone && !/^[0-9\+\-\s]{10,}$/.test(data.phone.replace(/\s+/g, ""))) {
    errors.push("رقم الهاتف غير صحيح");
  }

  // Email validation (if provided)
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("البريد الإلكتروني غير صحيح");
  }

  // Price validation
  if (data.productPrice && (data.productPrice < 0 || data.productPrice > 1000000)) {
    errors.push("السعر غير صحيح");
  }

  // Quantity validation
  if (data.quantity && (data.quantity < 1 || data.quantity > 1000)) {
    errors.push("الكمية غير صحيحة");
  }

  // Name length (spam prevention)
  if (data.name && data.name.length > 100) {
    errors.push("الاسم طويل جداً");
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(req: NextRequest) {
  try {
    // ✅ Method validation (prevent GET, DELETE, etc.)
    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    const body = await req.json();

    // ✅ Comprehensive validation
    const validation = validateOrderInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: "بيانات غير صحيحة",
          errors: validation.errors 
        },
        { status: 400 }
      );
    }

    const { name, phone, address, email, productName, productPrice, quantity, paymentMethod, notes } = body;

    // 🔢 Get next order number
    const { orderNumber, formattedOrderNumber } = await getNextOrderNumber();

    // 💾 Create order object
    const totalPrice = productPrice && quantity ? productPrice * quantity : 0;

    const orderData: Omit<Order, "id"> = {
      orderNumber,
      formattedOrderNumber,
      name,
      phone,
      address,
      email: email || "",
      productName: productName || "عام",
      productPrice: productPrice || 0,
      quantity: quantity || 1,
      totalPrice,
      status: "pending",
      paymentMethod: paymentMethod || "cash",
      notes: notes || "",
      createdAt: new Date()
    };

    // Save to Firebase
    const result = await createOrder(orderData);

    return NextResponse.json(
      {
        success: true,
        order: result.order,
        message: `تم إنشاء الطلب ${formattedOrderNumber} بنجاح`
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return NextResponse.json(
      { error: "فشل في إنشاء الطلب" },
      { status: 500 }
    );
  }
}
