// Admin Dashboard Component
"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/lib/firebase-admin";

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // 🔐 Simple password protection
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, selectedStatus]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordInput("");
      setError("");
    } else {
      setError("❌ كلمة المرور غير صحيحة");
      setPasswordInput("");
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const query = selectedStatus === "all" ? "" : `?status=${selectedStatus}`;
      const response = await fetch(`/api/orders/get-all${query}`);

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data.orders);
      setStats(data.stats);
      setError("");
    } catch (err: any) {
      setError(err.message);
      console.error("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      setUpdatingOrderId(orderId);

      const response = await fetch("/api/orders/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update order");

      const data = await response.json();
      
      // ✨ Update local state
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      alert(data.message);
    } catch (err: any) {
      alert("❌ خطأ في التحديث: " + err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>🔐 لوحة تحكم الطلبات</h1>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="password"
              placeholder="أدخل كلمة المرور"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={styles.input}
              autoFocus
            />
            <button type="submit" style={styles.loginButton}>
              دخول
            </button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  const statusOptions: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];
  
  const statusMap: Record<Order["status"], string> = {
    pending: "⏳ قيد الانتظار",
    processing: "⚙️ قيد المعالجة",
    shipped: "📦 تم الشحن",
    delivered: "✅ تم التسليم",
    cancelled: "❌ تم الإلغاء"
  };

  const statusColors: Record<Order["status"], string> = {
    pending: "#FFA500",
    processing: "#4169E1",
    shipped: "#1E90FF",
    delivered: "#28A745",
    cancelled: "#DC3545"
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 لوحة التحكم - نظام إدارة الطلبات</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          style={styles.logoutButton}
        >
          تسجيل الخروج
        </button>
      </div>

      {/* 📈 Statistics Cards */}
      {stats && (
        <div style={styles.statsContainer}>
          <div style={{ ...styles.statCard, borderLeft: `4px solid #000` }}>
            <div style={styles.statNumber}>{stats.total}</div>
            <div style={styles.statLabel}>إجمالي الطلبات</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: `4px solid #FFA500` }}>
            <div style={styles.statNumber}>{stats.pending}</div>
            <div style={styles.statLabel}>قيد الانتظار</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: `4px solid #4169E1` }}>
            <div style={styles.statNumber}>{stats.processing}</div>
            <div style={styles.statLabel}>قيد المعالجة</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: `4px solid #1E90FF` }}>
            <div style={styles.statNumber}>{stats.shipped}</div>
            <div style={styles.statLabel}>تم الشحن</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: `4px solid #28A745` }}>
            <div style={styles.statNumber}>{stats.delivered}</div>
            <div style={styles.statLabel}>تم التسليم</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: `4px solid #DC3545` }}>
            <div style={styles.statNumber}>{stats.cancelled}</div>
            <div style={styles.statLabel}>تم الإلغاء</div>
          </div>
        </div>
      )}

      {/* 🔍 Filter Controls */}
      <div style={styles.filterContainer}>
        <label style={styles.filterLabel}>تصفية حسب الحالة:</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={styles.select}
        >
          <option value="all">جميع الطلبات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="processing">قيد المعالجة</option>
          <option value="shipped">تم الشحن</option>
          <option value="delivered">تم التسليم</option>
          <option value="cancelled">تم الإلغاء</option>
        </select>
        <button onClick={fetchOrders} style={styles.refreshButton}>
          🔄 تحديث
        </button>
      </div>

      {/* 📋 Orders Table */}
      {loading ? (
        <p style={styles.loading}>جاري تحميل الطلبات...</p>
      ) : error ? (
        <p style={styles.error}>❌ خطأ: {error}</p>
      ) : (
        <div style={styles.ordersWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>رقم الطلب</th>
                <th style={styles.th}>الاسم</th>
                <th style={styles.th}>رقم الهاتف</th>
                <th style={styles.th}>المنتج</th>
                <th style={styles.th}>السعر</th>
                <th style={styles.th}>الحالة</th>
                <th style={styles.th}>التاريخ</th>
                <th style={styles.th}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={styles.noData}>
                    لا توجد طلبات
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <strong>{order.formattedOrderNumber}</strong>
                    </td>
                    <td style={styles.td}>{order.name}</td>
                    <td style={styles.td}>{order.phone}</td>
                    <td style={styles.td}>{order.productName}</td>
                    <td style={styles.td}>
                      {order.totalPrice} EGP
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: statusColors[order.status]
                        }}
                      >
                        {statusMap[order.status]}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(order.createdAt.seconds * 1000).toLocaleDateString("ar-EG")}
                    </td>
                    <td style={styles.td}>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id!, e.target.value as Order["status"])}
                        disabled={updatingOrderId === order.id}
                        style={styles.statusSelect}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {statusMap[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    direction: "rtl"
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  } as React.CSSProperties,
  title: {
    margin: 0,
    color: "#333",
    fontSize: "28px",
    fontWeight: "bold"
  } as React.CSSProperties,
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#DC3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
  } as React.CSSProperties,
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5"
  } as React.CSSProperties,
  loginBox: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center" as any
  } as React.CSSProperties,
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  } as React.CSSProperties,
  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    direction: "rtl"
  } as React.CSSProperties,
  loginButton: {
    padding: "12px",
    backgroundColor: "#1E90FF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold"
  } as React.CSSProperties,
  error: {
    color: "#DC3545",
    marginTop: "10px",
    fontSize: "14px"
  } as React.CSSProperties,
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "30px"
  } as React.CSSProperties,
  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center" as any
  } as React.CSSProperties,
  statNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px"
  } as React.CSSProperties,
  statLabel: {
    fontSize: "14px",
    color: "#666"
  } as React.CSSProperties,
  filterContainer: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  } as React.CSSProperties,
  filterLabel: {
    fontWeight: "bold",
    color: "#333"
  } as React.CSSProperties,
  select: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    direction: "rtl"
  } as React.CSSProperties,
  refreshButton: {
    padding: "8px 16px",
    backgroundColor: "#28A745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold"
  } as React.CSSProperties,
  loading: {
    textAlign: "center" as any,
    padding: "40px",
    color: "#666",
    fontSize: "16px"
  } as React.CSSProperties,
  ordersWrapper: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflowX: "auto"
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "none"
  } as React.CSSProperties,
  tableHeader: {
    backgroundColor: "#333",
    color: "white"
  } as React.CSSProperties,
  th: {
    padding: "12px",
    textAlign: "right" as any,
    fontWeight: "bold",
    borderBottom: "2px solid #ddd"
  } as React.CSSProperties,
  tableRow: {
    borderBottom: "1px solid #ddd",
    transition: "background-color 0.2s"
  } as React.CSSProperties,
  td: {
    padding: "12px",
    textAlign: "right" as any
  } as React.CSSProperties,
  statusBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "bold",
    fontSize: "12px"
  } as React.CSSProperties,
  statusSelect: {
    padding: "6px 10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
    direction: "rtl"
  } as React.CSSProperties,
  noData: {
    textAlign: "center" as any,
    padding: "40px",
    color: "#999",
    fontSize: "16px"
  } as React.CSSProperties
};
