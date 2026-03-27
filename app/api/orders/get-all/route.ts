// Get All Orders API
import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, getOrdersByStatus, getOrderStats } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let orders;

    if (status) {
      // Get orders by specific status
      orders = await getOrdersByStatus(status as any);
    } else {
      // Get all orders
      orders = await getAllOrders();
    }

    // Also get statistics
    const stats = await getOrderStats();

    return NextResponse.json(
      {
        success: true,
        orders,
        stats,
        count: orders.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json(
      { error: "فشل في جلب الطلبات" },
      { status: 500 }
    );
  }
}
