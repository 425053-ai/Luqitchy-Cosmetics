// API لتحديث counter قيمة في Firestore
// استدعاء: POST /api/admin/update-counter
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    // ✅ تحقق من كلمة المرور الإدارية
    const { adminPassword } = await req.json();

    if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "كلمة مرور غير صحيحة" },
        { status: 401 }
      );
    }

    console.log("⏳ جاري تحديث counter...");

    const counterRef = doc(db, "counters", "orders");

    // اقرأ القيمة الحالية
    const currentSnap = await getDoc(counterRef);
    const currentValue = currentSnap.exists() ? currentSnap.data()?.value : "لا يوجد";

    // عدّل القيمة إلى 1
    await setDoc(counterRef, { value: 1 }, { merge: false });

    // تحقق من التحديث
    const updatedSnap = await getDoc(counterRef);
    const newValue = updatedSnap.data()?.value;

    console.log(`✅ تم التحديث من ${currentValue} إلى ${newValue}`);

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث counter بنجاح",
        before: currentValue,
        after: newValue,
        nextOrderNumber: "ORD-0002"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ خطأ في تحديث counter:", error);
    return NextResponse.json(
      { error: "فشل في تحديث counter" },
      { status: 500 }
    );
  }
}
