// Advanced Admin Dashboard with Search & Export
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Order } from "@/lib/firebase-admin";
import {
  getArabicStatusLabel,
  getStatusColor,
  calculateStats,
  searchOrders,
  exportOrdersToCSV,
  downloadCSV,
  getTimeAgo,
  filterOrdersByDateRange
} from "@/lib/order-utils";

interface AdminStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue?: number;
  averageOrderValue?: number;
}

export default function AdvancedAdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  // 🔍 Filter and search orders
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by status
    if (selectedStatus !== "all") {
      result = result.filter(o => o.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      result = searchOrders(result, searchTerm);
    }

    // Filter by date range
    if (startDate && endDate) {
      result = filterOrdersByDateRange(
        result,
        new Date(startDate),
        new Date(endDate)
      );
    }

    return result;
  }, [orders, selectedStatus, searchTerm, startDate, endDate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

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
      const response = await fetch(`/api/orders/get-all`);

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data.orders);
      
      // Calculate stats from orders
      const calculatedStats = calculateStats(data.orders);
      setStats(calculatedStats as AdminStats);
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

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      alert(`✅ تم التحديث إلى: ${getArabicStatusLabel(newStatus)}`);
    } catch (err: any) {
      alert("❌ خطأ: " + err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleExportCSV = () => {
    const csv = exportOrdersToCSV(filteredOrders);
    downloadCSV(csv, `orders-${new Date().toISOString().split('T')[0]}.csv`);
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

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📊 لوحة التحكم المتقدمة</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          style={styles.logoutButton}
        >
          تسجيل الخروج
        </button>
      </div>

      {/* Statistics */}
      {stats && (
        <div style={styles.statsContainer}>
          <StatCard label="الطلبات" value={stats.total} color="#000" />
          <StatCard label="قيد الانتظار" value={stats.pending} color="#FFA500" />
          <StatCard label="قيد المعالجة" value={stats.processing} color="#4169E1" />
          <StatCard label="مرسلة" value={stats.shipped} color="#1E90FF" />
          <StatCard label="مسلمة" value={stats.delivered} color="#28A745" />
          <StatCard label="الإجمالي" value={`${stats.totalRevenue} EGP`} color="#333" />
        </div>
      )}

      {/* Controls */}
      <div style={styles.controlsContainer}>
        {/* Search */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 ابحث برقم الطلب أو الاسم أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Filters */}
        <div style={styles.filtersRow}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={styles.select}
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="processing">قيد المعالجة</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التسليم</option>
            <option value="cancelled">تم الإلغاء</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.dateInput}
            placeholder="من"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.dateInput}
            placeholder="إلى"
          />

          <button onClick={fetchOrders} style={styles.refreshButton}>
            🔄 تحديث
          </button>

          <button onClick={handleExportCSV} style={styles.exportButton}>
            📥 تنزيل CSV
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div style={styles.resultInfo}>
        عدد النتائج: <strong>{filteredOrders.length}</strong>
      </div>

      {/* Orders Table */}
      {loading ? (
        <p style={styles.loading}>جاري تحميل الطلبات...</p>
      ) : error ? (
        <p style={styles.error}>❌ خطأ: {error}</p>
      ) : (
        <div style={styles.ordersWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>رقم الطلب</th>
                <th style={styles.th}>الاسم</th>
                <th style={styles.th}>الهاتف</th>
                <th style={styles.th}>المنتج</th>
                <th style={styles.th}>الإجمالي</th>
                <th style={styles.th}>الحالة</th>
                <th style={styles.th}>الوقت</th>
                <th style={styles.th}>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} style={styles.noData}>
                    لا توجد طلبات
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr key={order.id} style={styles.tableRow}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>
                      <strong>{order.formattedOrderNumber}</strong>
                    </td>
                    <td style={styles.td}>{order.name}</td>
                    <td style={styles.td}>{order.phone}</td>
                    <td style={styles.td}>{order.productName}</td>
                    <td style={styles.td}>
                      <strong>{order.totalPrice} EGP</strong>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(order.status)
                        }}
                      >
                        {getArabicStatusLabel(order.status)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {getTimeAgo(order.createdAt)}
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
                            {getArabicStatusLabel(status)}
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

// Stat Card Component
function StatCard({ label, value, color }: { label: string; value: any; color: string }) {
  return (
    <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
      <div style={styles.statNumber}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

// Styles
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
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
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
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px"
  } as React.CSSProperties,
  statLabel: {
    fontSize: "13px",
    color: "#666"
  } as React.CSSProperties,
  controlsContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  } as React.CSSProperties,
  searchBox: {
    marginBottom: "15px"
  } as React.CSSProperties,
  searchInput: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    direction: "rtl"
  } as React.CSSProperties,
  filtersRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  } as React.CSSProperties,
  select: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "13px",
    direction: "rtl",
    flex: 1,
    minWidth: "150px"
  } as React.CSSProperties,
  dateInput: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "13px",
    flex: 1,
    minWidth: "130px"
  } as React.CSSProperties,
  refreshButton: {
    padding: "8px 16px",
    backgroundColor: "#28A745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px"
  } as React.CSSProperties,
  exportButton: {
    padding: "8px 16px",
    backgroundColor: "#6C757D",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px"
  } as React.CSSProperties,
  resultInfo: {
    backgroundColor: "white",
    padding: "10px 15px",
    borderRadius: "4px",
    marginBottom: "15px",
    fontSize: "13px",
    textAlign: "right" as any
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
    fontSize: "13px"
  } as React.CSSProperties,
  tableRow: {
    borderBottom: "1px solid #eee",
    transition: "background-color 0.2s"
  } as React.CSSProperties,
  td: {
    padding: "10px 12px",
    textAlign: "right" as any,
    fontSize: "13px"
  } as React.CSSProperties,
  statusBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "15px",
    color: "white",
    fontWeight: "bold",
    fontSize: "11px"
  } as React.CSSProperties,
  statusSelect: {
    padding: "4px 8px",
    border: "1px solid #ddd",
    borderRadius: "3px",
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
