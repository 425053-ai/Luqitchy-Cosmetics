// Admin Dashboard Page
import AdminDashboard from "@/components/admin-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم - إدارة الطلبات",
  description: "نظام إدارة الطلبات المتقدم"
};

export default function AdminPage() {
  return <AdminDashboard />;
}
