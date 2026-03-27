// Real-Time Admin Dashboard with Live Updates
"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase-config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  getArabicStatusLabel,
  getStatusColor,
  calculateStats,
  getTimeAgo
} from "@/lib/order-utils";

interface DashboardStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export default function RealtimeDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  // 🔥 Real-time listener setup
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);

    try {
      // Subscribe to real-time updates
      const q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const liveOrders: Order[] = [];

          snapshot.forEach((doc) => {
            liveOrders.push({
              id: doc.id,
              ...doc.data()
            } as Order);
          });

          setOrders(liveOrders);

          // Calculate stats
          const calculatedStats = calculateStats(liveOrders);
          setStats(calculatedStats as DashboardStats);
          setLoading(false);
          setError("");
        },
        (err) => {
          console.error("❌ Real-time listener error:", err);
          setError("خطأ في الاتصال بقاعدة البيانات");
          setLoading(false);
        }
      );

      // Cleanup listener on unmount
      return () => unsubscribe();
    } catch (err) {
      console.error("❌ Error:", err);
      setError("خطأ في تحميل البيانات");
      setLoading(false);
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

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>🔐 لوحة التحكم المباشرة</h1>
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚡ لوحة التحكم المباشرة (Live)</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          style={styles.logoutButton}
        >
          تسجيل الخروج
        </button>
      </div>

      {/* Live Stats */}
      {stats && (
        <div style={styles.statsContainer}>
          <StatCard
            label="الطلبات"
            value={`${stats.total}`}
            icon="📊"
            color="#333"
          />
          <StatCard
            label="المعالجة"
            value={`${stats.pending}`}
            icon="⏳"
            color="#FFA500"
          />
          <StatCard
            label="مرسلة"
            value={`${stats.shipped}`}
            icon="📦"
            color="#1E90FF"
          />
          <StatCard
            label="مسلمة"
            value={`${stats.delivered}`}
            icon="✅"
            color="#28A745"
          />
          <StatCard
            label="الإجمالي"
            value={`${stats.totalRevenue} EGP`}
            icon="💰"
            color="#FFD700"
          />
          <StatCard
            label="المتوسط"
            value={`${Math.round(stats.averageOrderValue)} EGP`}
            icon="📈"
            color="#FF6B6B"
          />
        </div>
      )}

      {/* Live Indicator */}
      <div style={styles.liveIndicator}>
        <span style={styles.liveDot}></span>
        <span>{orders.length} طلب متوفر</span>
      </div>

      {/* Orders Table */}
      {loading ? (
        <p style={styles.loading}>🔄 جاري تحميل البيانات المباشرة...</p>
      ) : error ? (
        <p style={styles.error}>❌ {error}</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>رقم</th>
                <th style={styles.th}>الاسم</th>
                <th style={styles.th}>الهاتف</th>
                <th style={styles.th}>المنتج</th>
                <th style={styles.th}>السعر</th>
                <th style={styles.th}>الحالة</th>
                <th style={styles.th}>الوقت</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={styles.noData}>
                    لا توجد طلبات
                  </td>
                </tr>
              ) : (
                orders.slice(0, 20).map((order, index) => (
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
                      <span style={styles.timeAgo}>{getTimeAgo(order.createdAt)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div style={styles.footer}>
        <p>🔄 البيانات تحدّث تلقائياً كل ثانية</p>
      </div>
    </div>
  );
}

// Stat Card Component with Animation
function StatCard({
  label,
  value,
  icon,
  color
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div
      style={{
        ...styles.statCard,
        borderLeft: `4px solid ${color}`,
        animation: "slideUp 0.3s ease-out"
      }}
    >
      <div style={styles.statIcon}>{icon}</div>
      <div style={styles.statNumber}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

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
    textAlign: "center" as any,
    transition: "transform 0.2s, box-shadow 0.2s"
  } as React.CSSProperties,
  statIcon: {
    fontSize: "32px",
    marginBottom: "10px"
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
  liveIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fff3cd",
    padding: "10px 15px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontSize: "14px",
    color: "#856404"
  } as React.CSSProperties,
  liveDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#28A745",
    animation: "pulse 1.5s infinite"
  } as React.CSSProperties,
  loading: {
    textAlign: "center" as any,
    padding: "40px",
    color: "#666",
    fontSize: "16px"
  } as React.CSSProperties,
  tableWrapper: {
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
  headerRow: {
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
  timeAgo: {
    color: "#999",
    fontSize: "12px"
  } as React.CSSProperties,
  noData: {
    textAlign: "center" as any,
    padding: "40px",
    color: "#999"
  } as React.CSSProperties,
  footer: {
    textAlign: "center" as any,
    padding: "20px",
    color: "#666",
    fontSize: "14px"
  } as React.CSSProperties
};
