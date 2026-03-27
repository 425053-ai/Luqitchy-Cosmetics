// Order Management Utilities
import { Order } from "@/lib/firebase-admin";

/**
 * 🔄 Format order data for display
 */
export function formatOrderForDisplay(order: Order): any {
  return {
    ...order,
    createdDate: new Date(order.createdAt.seconds * 1000).toLocaleDateString("ar-EG"),
    createdTime: new Date(order.createdAt.seconds * 1000).toLocaleTimeString("ar-EG"),
    totalFormatted: `${order.totalPrice} EGP`
  };
}

/**
 * 🔤 Get Arabic status label
 */
export function getArabicStatusLabel(status: Order["status"]): string {
  const labels: Record<Order["status"], string> = {
    pending: "⏳ قيد الانتظار",
    processing: "⚙️ قيد المعالجة",
    shipped: "📦 تم الشحن",
    delivered: "✅ تم التسليم",
    cancelled: "❌ تم الإلغاء"
  };
  return labels[status];
}

/**
 * 🎨 Get status color for badge
 */
export function getStatusColor(status: Order["status"]): string {
  const colors: Record<Order["status"], string> = {
    pending: "#FFA500",      // Orange
    processing: "#4169E1",   // Royal Blue
    shipped: "#1E90FF",      // Dodger Blue
    delivered: "#28A745",    // Green
    cancelled: "#DC3545"     // Red
  };
  return colors[status];
}

/**
 * 📊 Calculate order statistics with profit tracking
 */
export function calculateStats(orders: Order[], productCosts?: Record<string, number>) {
  let totalRevenue = 0;
  let totalCost = 0;

  orders.forEach(order => {
    totalRevenue += order.totalPrice || 0;

    // Calculate cost if available
    if (productCosts && order.productName && productCosts[order.productName]) {
      const cost = productCosts[order.productName] * (order.quantity || 1);
      totalCost += cost;
    }
  });

  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalRevenue,
    averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    totalCost,
    totalProfit,
    profitMargin: Math.round(profitMargin * 100) / 100
  };
}

/**
 * 📈 Get orders by date range
 */
export function filterOrdersByDateRange(
  orders: Order[],
  startDate: Date,
  endDate: Date
): Order[] {
  return orders.filter(order => {
    const orderDate = new Date(order.createdAt.seconds * 1000);
    return orderDate >= startDate && orderDate <= endDate;
  });
}

/**
 * 🔍 Search orders by keyword
 */
export function searchOrders(orders: Order[], keyword: string): Order[] {
  const lowerKeyword = keyword.toLowerCase();
  return orders.filter(order =>
    order.formattedOrderNumber.toLowerCase().includes(lowerKeyword) ||
    order.name.toLowerCase().includes(lowerKeyword) ||
    order.phone.includes(keyword) ||
    (order.productName && order.productName.toLowerCase().includes(lowerKeyword)) ||
    (order.address && order.address.toLowerCase().includes(lowerKeyword))
  );
}

/**
 * 📥 Export orders to CSV
 */
export function exportOrdersToCSV(orders: Order[]): string {
  const headers = [
    "رقم الطلب",
    "الاسم",
    "الهاتف",
    "العنوان",
    "المنتج",
    "السعر",
    "الكمية",
    "الإجمالي",
    "طريقة الدفع",
    "الحالة",
    "التاريخ"
  ];

  const rows = orders.map(order => [
    order.formattedOrderNumber,
    `"${order.name}"`,
    order.phone,
    `"${order.address}"`,
    `"${order.productName || "عام"}"`,
    order.productPrice || 0,
    order.quantity || 1,
    order.totalPrice || 0,
    order.paymentMethod || "غير محدد",
    getArabicStatusLabel(order.status),
    new Date(order.createdAt.seconds * 1000).toLocaleDateString("ar-EG")
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  return csvContent;
}

/**
 * 💾 Download CSV file
 */
export function downloadCSV(content: string, filename: string) {
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 🔔 Format notification message
 */
export function formatOrderNotification(order: Order): string {
  return `
📦 طلب جديد: ${order.formattedOrderNumber}
👤 الاسم: ${order.name}
📱 الهاتف: ${order.phone}
🏠 العنوان: ${order.address}
🛍️ المنتج: ${order.productName || "عام"}
💰 الإجمالي: ${order.totalPrice} EGP
💳 الدفع: ${order.paymentMethod || "غير محدد"}
  `.trim();
}

/**
 * ⏰ Get time ago string
 */
export function getTimeAgo(date: any): string {
  const orderDate = new Date(date.seconds * 1000);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - orderDate.getTime()) / 1000);

  if (seconds < 60) return "الآن";
  if (seconds < 3600) return `قبل ${Math.floor(seconds / 60)} دقيقة`;
  if (seconds < 86400) return `قبل ${Math.floor(seconds / 3600)} ساعة`;
  return `قبل ${Math.floor(seconds / 86400)} يوم`;
}

/**
 * ✅ Validate order data
 */
export function validateOrderData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("الاسم مطلوب");
  }
  if (!data.phone || data.phone.trim().length === 0) {
    errors.push("رقم الهاتف مطلوب");
  }
  if (!data.address || data.address.trim().length === 0) {
    errors.push("العنوان مطلوب");
  }
  if (data.productPrice && data.productPrice < 0) {
    errors.push("السعر لا يمكن أن يكون سالباً");
  }
  if (data.quantity && data.quantity < 1) {
    errors.push("الكمية يجب أن تكون 1 على الأقل");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 💰 Calculate profit by product
 */
export function calculateProfitByProduct(
  orders: Order[],
  productCosts: Record<string, number>
): Record<string, { revenue: number; cost: number; profit: number; margin: number; count: number }> {
  const profitMap: Record<string, any> = {};

  orders.forEach(order => {
    const product = order.productName || "Unknown";

    if (!profitMap[product]) {
      profitMap[product] = {
        revenue: 0,
        cost: 0,
        profit: 0,
        margin: 0,
        count: 0
      };
    }

    const revenue = order.totalPrice || 0;
    const cost = (productCosts[product] || 0) * (order.quantity || 1);
    const profit = revenue - cost;

    profitMap[product].revenue += revenue;
    profitMap[product].cost += cost;
    profitMap[product].profit += profit;
    profitMap[product].count++;
    profitMap[product].margin = 
      profitMap[product].revenue > 0 
        ? (profitMap[product].profit / profitMap[product].revenue) * 100 
        : 0;
  });

  return profitMap;
}

/**
 * 📊 Get top performing products by profit
 */
export function getTopProductsByProfit(
  profitMap: Record<string, any>,
  limit: number = 5
): Array<{
  product: string;
  revenue: number;
  profit: number;
  margin: number;
  count: number;
}> {
  return Object.entries(profitMap)
    .map(([product, data]) => ({
      product,
      ...data
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, limit);
}
