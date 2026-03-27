// API Route for Bulk Operations (Optional - for migrations)
import { NextRequest, NextResponse } from "next/server";
import { bulkUpdateOrdersStatus, Order, updateOrder } from "@/lib/firebase-admin";

/**
 * 🔄 Bulk Update Orders Status
 * POST /api/admin/bulk-update-status
 */
export async function POST(req: NextRequest) {
  try {
    // Simple auth check
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderIds, status } = body;

    if (!orderIds || !Array.isArray(orderIds) || !status) {
      return NextResponse.json(
        { error: "Missing orderIds or status" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses: Order["status"][] = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update bulk
    const success = await bulkUpdateOrdersStatus(orderIds, status);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update orders" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `تم تحديث ${orderIds.length} طلب`,
        count: orderIds.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in bulk update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * 📊 Get Order Analytics
 * GET /api/admin/analytics
 */
export async function GET(req: NextRequest) {
  try {
    // Simple auth check
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { getAllOrders, getOrderStats } = await import("@/lib/firebase-admin");

    const allOrders = await getAllOrders();
    const stats = await getOrderStats();

    // Calculate additional metrics
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const averageOrderValue = allOrders.length > 0 ? totalRevenue / allOrders.length : 0;

    const ordersByPaymentMethod: Record<string, number> = {};
    allOrders.forEach(order => {
      const method = order.paymentMethod || "unknown";
      ordersByPaymentMethod[method] = (ordersByPaymentMethod[method] || 0) + 1;
    });

    const topProducts: Record<string, number> = {};
    allOrders.forEach(order => {
      const product = order.productName || "unknown";
      topProducts[product] = (topProducts[product] || 0) + 1;
    });

    return NextResponse.json(
      {
        success: true,
        stats,
        metrics: {
          totalRevenue,
          averageOrderValue,
          orderCount: allOrders.length
        },
        byPaymentMethod: ordersByPaymentMethod,
        topProducts: Object.entries(topProducts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
