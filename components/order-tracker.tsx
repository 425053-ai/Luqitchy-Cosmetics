// Customer Order Tracker Component
"use client";

import React, { useState } from "react";
import { Order } from "@/lib/firebase-admin";
import { getArabicStatusLabel, getStatusColor, getTimeAgo } from "@/lib/order-utils";

export default function OrderTracker() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError("الرجاء إدخال رقم الطلب");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      // Search by formatted order number
      const response = await fetch(`/api/orders/get-all`);
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      const foundOrder = data.orders.find(
        (o: Order) => o.formattedOrderNumber.toLowerCase() === orderNumber.toLowerCase()
      );

      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError("لم يتم العثور على الطلب");
        setOrder(null);
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { key: "pending", label: "⏳ قيد الانتظار", arabicLabel: "قيد الانتظار" },
    { key: "processing", label: "⚙️ قيد المعالجة", arabicLabel: "قيد المعالجة" },
    { key: "shipped", label: "📦 تم الشحن", arabicLabel: "تم الشحن" },
    { key: "delivered", label: "✅ تم التسليم", arabicLabel: "تم التسليم" }
  ];

  const getCurrentStep = (): number => {
    if (!order) return 0;
    const statusMap: Record<string, number> = {
      pending: 0,
      processing: 1,
      shipped: 2,
      delivered: 3,
      cancelled: -1
    };
    return statusMap[order.status] || 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📦 تتبع طلبك</h1>
        <p style={styles.subtitle}>أدخل رقم طلبك لمعرفة حالته</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <div style={styles.formGroup}>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="أدخل رقم الطلب (مثال: ORD-0001)"
            style={styles.input}
            dir="rtl"
          />
          <button type="submit" disabled={loading} style={styles.searchButton}>
            {loading ? "🔍 جاري البحث..." : "🔍 ابحث"}
          </button>
        </div>
      </form>

      {error && searched && (
        <div style={styles.errorBox}>
          <p style={styles.error}>❌ {error}</p>
        </div>
      )}

      {/* Order Details */}
      {order && (
        <div style={styles.orderContainer}>
          <div style={styles.orderHeader}>
            <h2 style={styles.orderNumber}>{order.formattedOrderNumber}</h2>
            <span
              style={{
                ...styles.statusBadge,
                backgroundColor: getStatusColor(order.status)
              }}
            >
              {getArabicStatusLabel(order.status)}
            </span>
          </div>

          {/* Status Timeline */}
          <div style={styles.timelineContainer}>
            <div style={styles.timeline}>
              {statusSteps.map((step, index) => (
                <div key={step.key} style={styles.timelineStep}>
                  <div
                    style={{
                      ...styles.stepCircle,
                      backgroundColor:
                        index <= currentStep && order.status !== "cancelled"
                          ? getStatusColor(order.status as any)
                          : "#ddd",
                      borderColor:
                        index <= currentStep && order.status !== "cancelled"
                          ? getStatusColor(order.status as any)
                          : "#ccc"
                    }}
                  >
                    {index < currentStep && order.status !== "cancelled" ? "✓" : ""}
                    {index === currentStep && order.status !== "cancelled" ? "📍" : ""}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      style={{
                        ...styles.stepLine,
                        backgroundColor:
                          index < currentStep && order.status !== "cancelled"
                            ? getStatusColor(order.status as any)
                            : "#ddd"
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div style={styles.timelineLabels}>
              {statusSteps.map((step) => (
                <div key={step.key} style={styles.timelineLabel}>
                  {step.label}
                </div>
              ))}
            </div>
          </div>

          {/* Order Details Grid */}
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>👤 الاسم:</span>
              <span style={styles.detailValue}>{order.name}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>📱 الهاتف:</span>
              <span style={styles.detailValue}>{order.phone}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>🏠 العنوان:</span>
              <span style={styles.detailValue}>{order.address}</span>
            </div>
            {order.email && (
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>📧 البريد:</span>
                <span style={styles.detailValue}>{order.email}</span>
              </div>
            )}
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>🛍️ المنتج:</span>
              <span style={styles.detailValue}>{order.productName}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>💰 السعر:</span>
              <span style={styles.detailValue}>{order.totalPrice} EGP</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>💳 الدفع:</span>
              <span style={styles.detailValue}>
                {order.paymentMethod === "cash"
                  ? "الدفع عند الاستلام"
                  : order.paymentMethod === "bank"
                  ? "تحويل بنكي"
                  : "دفع إلكتروني"}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>📅 التاريخ:</span>
              <span style={styles.detailValue}>
                {new Date(order.createdAt.seconds * 1000).toLocaleDateString("ar-EG")}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>⏰ قبل:</span>
              <span style={styles.detailValue}>{getTimeAgo(order.createdAt)}</span>
            </div>
          </div>

          {/* Status Message */}
          {order.status === "delivered" && (
            <div style={styles.successMessage}>
              <p>✅ تم تسليم الطلب بنجاح! شكراً لتعاملك معنا</p>
            </div>
          )}
          {order.status === "shipped" && (
            <div style={styles.infoMessage}>
              <p>📦 الطلب في الطريق إليك. جاري التوصيل</p>
            </div>
          )}
          {order.status === "pending" && (
            <div style={styles.warningMessage}>
              <p>⏳ الطلب قيد الانتظار. سيتم معالجته قريباً</p>
            </div>
          )}
          {order.status === "cancelled" && (
            <div style={styles.errorBox}>
              <p>❌ تم إلغاء هذا الطلب</p>
            </div>
          )}

          {order.notes && (
            <div style={styles.notesBox}>
              <p style={styles.notesLabel}>📝 ملاحظات:</p>
              <p style={styles.notesContent}>{order.notes}</p>
            </div>
          )}
        </div>
      )}

      {!order && searched && !error && (
        <div style={styles.infoBox}>
          <p>🔍 لم يتم العثور على الطلب</p>
        </div>
      )}

      {!searched && (
        <div style={styles.infoBox}>
          <p>📌 أدخل رقم طلبك للبدء</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    direction: "rtl"
  } as React.CSSProperties,
  header: {
    textAlign: "center" as any,
    marginBottom: "30px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  } as React.CSSProperties,
  title: {
    margin: "0 0 10px 0",
    fontSize: "32px",
    color: "#333",
    fontWeight: "bold"
  } as React.CSSProperties,
  subtitle: {
    margin: 0,
    color: "#666",
    fontSize: "16px"
  } as React.CSSProperties,
  searchForm: {
    marginBottom: "30px"
  } as React.CSSProperties,
  formGroup: {
    display: "flex",
    gap: "10px",
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  } as React.CSSProperties,
  input: {
    flex: 1,
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    direction: "rtl"
  } as React.CSSProperties,
  searchButton: {
    padding: "12px 20px",
    backgroundColor: "#1E90FF",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    whiteSpace: "nowrap"
  } as React.CSSProperties,
  errorBox: {
    backgroundColor: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px"
  } as React.CSSProperties,
  error: {
    color: "#721c24",
    margin: 0,
    fontSize: "14px"
  } as React.CSSProperties,
  orderContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  } as React.CSSProperties,
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "2px solid #eee"
  } as React.CSSProperties,
  orderNumber: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333"
  } as React.CSSProperties,
  statusBadge: {
    padding: "8px 16px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px"
  } as React.CSSProperties,
  timelineContainer: {
    marginBottom: "30px",
    padding: "20px 0"
  } as React.CSSProperties,
  timeline: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "30px",
    position: "relative"
  } as React.CSSProperties,
  timelineStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    position: "relative"
  } as React.CSSProperties,
  stepCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "3px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "20px",
    color: "white",
    backgroundColor: "#ddd",
    zIndex: 1
  } as React.CSSProperties,
  stepLine: {
    position: "absolute",
    top: "24px",
    right: "0",
    width: "calc(100% - 48px)",
    height: "3px",
    backgroundColor: "#ddd"
  } as React.CSSProperties,
  timelineLabels: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px"
  } as React.CSSProperties,
  timelineLabel: {
    fontSize: "12px",
    color: "#666",
    textAlign: "center" as any,
    flex: 1
  } as React.CSSProperties,
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px"
  } as React.CSSProperties,
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  } as React.CSSProperties,
  detailLabel: {
    fontWeight: "bold",
    color: "#333",
    fontSize: "13px"
  } as React.CSSProperties,
  detailValue: {
    color: "#666",
    fontSize: "14px",
    wordBreak: "break-word"
  } as React.CSSProperties,
  successMessage: {
    backgroundColor: "#d4edda",
    border: "1px solid #c3e6cb",
    color: "#155724",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
    textAlign: "center" as any
  } as React.CSSProperties,
  infoMessage: {
    backgroundColor: "#d1ecf1",
    border: "1px solid #bee5eb",
    color: "#0c5460",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
    textAlign: "center" as any
  } as React.CSSProperties,
  warningMessage: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffeeba",
    color: "#856404",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
    textAlign: "center" as any
  } as React.CSSProperties,
  notesBox: {
    backgroundColor: "#f0f0f0",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "15px",
    borderLeft: "4px solid #1E90FF"
  } as React.CSSProperties,
  notesLabel: {
    margin: "0 0 10px 0",
    fontWeight: "bold",
    color: "#333"
  } as React.CSSProperties,
  notesContent: {
    margin: 0,
    color: "#666",
    fontSize: "14px"
  } as React.CSSProperties,
  infoBox: {
    textAlign: "center" as any,
    padding: "40px 20px",
    backgroundColor: "white",
    borderRadius: "8px",
    color: "#666",
    fontSize: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  } as React.CSSProperties
};
