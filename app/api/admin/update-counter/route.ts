// API لتحديث counter قيمة في Redis (Upstash)
// استدعاء: POST /api/admin/update-counter

import { NextRequest, NextResponse } from "next/server";
import { 
  getCurrentOrderCounter, 
  setOrderCounter 
} from "@/lib/order-counter";

export async function POST(req: NextRequest) {
  try {
    // ✅ تحقق من كلمة المرور الإدارية
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const { adminPassword, counterValue } = body;

    // Verify admin password
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Your_Strong_Password_2026!";
    if (adminPassword !== correctPassword) {
      console.warn("❌ Invalid admin password attempt");
      return NextResponse.json(
        { error: "كلمة مرور غير صحيحة" },
        { status: 401 }
      );
    }

    console.log("⏳ جاري تحديث counter في Redis...");

    try {
      // اقرأ القيمة الحالية
      const currentValue = await getCurrentOrderCounter();
      console.log(`📊 القيمة الحالية: ${currentValue}`);

      // عدّل القيمة - إذا لم تحدد قيمة، استخدم 1
      const newCounterValue = typeof counterValue === 'number' ? counterValue : 0;
      const finalValue = await setOrderCounter(newCounterValue);

      console.log(`✅ تم التحديث من ${currentValue} إلى ${finalValue}`);

      return NextResponse.json(
        {
          success: true,
          message: "تم تحديث counter بنجاح عبر Redis",
          before: currentValue,
          after: finalValue,
          nextOrderNumber: `ORD-${String(finalValue + 1).padStart(4, '0')}`,
        },
        { status: 200 }
      );
    } catch (redisError: any) {
      console.error("❌ Redis error:", redisError);
      return NextResponse.json(
        { 
          error: "فشل الاتصال بـ Redis",
          details: redisError?.message 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("❌ خطأ في تحديث counter:", error);
    return NextResponse.json(
      { error: "فشل في تحديث counter", details: error?.message },
      { status: 500 }
    );
  }
}
