// Real-Time Dashboard Page
import RealtimeDashboard from "@/components/realtime-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم المباشرة - Live Dashboard",
  description: "لوحة تحكم حية مع تحديثات فورية"
};

export default function RealtimePage() {
  return <RealtimeDashboard />;
}
