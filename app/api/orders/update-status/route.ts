// Update Order Status API
import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, Order } from "@/lib/firebase-admin";

export async function PATCH(req: NextRequest) {
  try {
    // ✅ Method validation
    if (req.method !== "PATCH") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    const body = await req.json();
    const { orderId, status } = body;

    // ✅ Input validation
    if (!orderId || typeof orderId !== "string" || orderId.trim().length === 0) {
      return NextResponse.json(
        { error: "Order ID is required and must be a valid string" },
        { status: 400 }
      );
    }

    if (!status || typeof status !== "string") {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status as Order["status"])) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Type-safe status for Firebase
    const typedStatus = status as Order["status"];

    // Update in Firebase
    const success = await updateOrderStatus(orderId, typedStatus);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    const statusMap: Record<Order["status"], string> = {
      pending: "قيد الانتظار",
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "تم الإلغاء"
    };

    return NextResponse.json(
      {
        success: true,
        message: `تم تحديث حالة الطلب إلى: ${statusMap[typedStatus]}`,
        status: typedStatus
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    return NextResponse.json(
      { error: "فشل في تحديث حالة الطلب" },
      { status: 500 }
    );
  }
}
