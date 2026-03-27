#!/usr/bin/env node
/**
 * 🔧 Script to update Firestore counter value
 * Usage: pnpm ts-node scripts/update-counter.ts
 */

import { db } from "@/lib/firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";

async function updateCounter() {
  try {
    console.log("⏳ جاري تحديث counter في Firestore...\n");

    const counterRef = doc(db, "counters", "orders");

    // الخطوة 1: اقرأ القيمة الحالية
    const snap = await getDoc(counterRef);
    
    if (snap.exists()) {
      const currentValue = snap.data()?.value;
      console.log(`✅ القيمة الحالية: ${currentValue}`);
    } else {
      console.log("⚠️  المستند لم يكن موجوداً، جاري الإنشاء...");
    }

    // الخطوة 2: عدّل القيمة إلى 1
    await setDoc(counterRef, { value: 1 });
    console.log("✅ تم تحديث القيمة إلى: 1\n");

    // الخطوة 3: تحقق من التحديث
    const updatedSnap = await getDoc(counterRef);
    const newValue = updatedSnap.data()?.value;
    console.log(`✅ القيمة الجديدة: ${newValue}`);

    if (newValue === 1) {
      console.log("\n🎉 تم التحديث بنجاح!");
      console.log("📝 الأوردر القادمة ستبدأ من: ORD-0002");
      process.exit(0);
    } else {
      console.log("\n❌ خطأ في التحديث");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ خطأ:", error);
    process.exit(1);
  }
}

// شغّل الـ script
updateCounter();
