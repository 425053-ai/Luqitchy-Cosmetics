// Customer Order Tracking Page
import OrderTracker from "@/components/order-tracker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تتبع طلبك - Luqitchy Cosmetics",
  description: "تتبع حالة طلبك من Luqitchy Cosmetics"
};

export default function TrackingPage() {
  return (
    <>
      <OrderTracker />
    </>
  );
}
