// Advanced Admin Dashboard Page
import AdvancedAdminDashboard from "@/components/advanced-admin-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم المتقدمة - إدارة الطلبات",
  description: "نظام إدارة الطلبات المتقدم مع البحث والتصفية والتحليلات"
};

export default function AdvancedAdminPage() {
  return <AdvancedAdminDashboard />;
}
