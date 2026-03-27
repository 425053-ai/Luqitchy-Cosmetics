// Migration & Utility Script
// Usage: npx ts-node lib/migration-utils.ts

import { db } from "./firebase-config";
import {
  collection,
  addDoc,
  writeBatch,
  doc,
  setDoc,
  Timestamp
} from "firebase/firestore";

/**
 * 🔄 Migrate orders from old format to Firebase
 * Run this if you have orders from the Redis system
 */
export async function migrateOrdersFromOldSystem(oldOrders: any[]) {
  console.log(`⏳ Migrating ${oldOrders.length} orders...`);

  try {
    const batch = writeBatch(db);
    let batchCount = 0;
    const BATCH_SIZE = 500; // Firestore batch write limit

    for (let i = 0; i < oldOrders.length; i++) {
      const oldOrder = oldOrders[i];

      // Transform old format to new format
      const newOrder = {
        orderNumber: oldOrder.orderNumber || oldOrder.id || i + 1,
        formattedOrderNumber: oldOrder.formattedOrderNumber || `ORD-${String(i + 1).padStart(4, "0")}`,
        name: oldOrder.name || "Unknown",
        phone: oldOrder.phone || "",
        address: oldOrder.address || "",
        email: oldOrder.email || "",
        productName: oldOrder.productName || "عام",
        productPrice: oldOrder.productPrice || 0,
        quantity: oldOrder.quantity || 1,
        totalPrice: oldOrder.totalPrice || 0,
        status: oldOrder.status || "pending",
        paymentMethod: oldOrder.paymentMethod || "cash",
        notes: oldOrder.notes || "",
        createdAt: oldOrder.createdAt 
          ? typeof oldOrder.createdAt === 'string' 
            ? Timestamp.fromDate(new Date(oldOrder.createdAt))
            : Timestamp.fromDate(new Date(oldOrder.createdAt))
          : Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Add to batch
      const docRef = doc(collection(db, "orders"));
      batch.set(docRef, newOrder);

      batchCount++;

      // Commit batch when it reaches limit
      if (batchCount === BATCH_SIZE || i === oldOrders.length - 1) {
        await batch.commit();
        console.log(`✅ Migrated ${Math.min((i + 1), oldOrders.length)} orders`);
        batchCount = 0;
      }
    }

    // Update counter to match highest order number
    const maxOrderNumber = Math.max(...oldOrders.map(o => o.orderNumber || 0));
    await setDoc(doc(db, "counters", "orders"), { value: maxOrderNumber + 1 });

    console.log(`✅ Migration complete! Counter set to: ${maxOrderNumber + 1}`);
    return true;
  } catch (error) {
    console.error("❌ Migration failed:", error);
    return false;
  }
}

/**
 * 🧹 Clean up test orders (for demo data cleanup)
 */
export async function cleanupTestOrders(orderIds: string[]) {
  console.log(`⏳ Deleting ${orderIds.length} test orders...`);

  try {
    const batch = writeBatch(db);

    orderIds.forEach(orderId => {
      batch.delete(doc(db, "orders", orderId));
    });

    await batch.commit();
    console.log(`✅ Deleted ${orderIds.length} orders`);
    return true;
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    return false;
  }
}

/**
 * 📊 Generate test data for demo
 */
export async function generateTestData(count: number = 50) {
  console.log(`⏳ Generating ${count} test orders...`);

  const firstNames = ["أحمد", "فاطمة", "محمد", "نور", "ريم", "سارة", "علي", "هند"];
  const lastNames = ["على", "محمود", "حسن", "أحمد", "علي", "محمد", "حسين", "إبراهيم"];
  const cities = ["القاهرة", "الجيزة", "الإسكندرية", "المنصورة", "أسيوط", "سوهاج"];
  const streets = ["شارع النيل", "شارع التحرير", "شارع الهرم", "شارع السويس", "شارع الكورنيش"];
  const products = [
    "كريم الوجه الفاخر",
    "سيروم العناية",
    "قناع الجمال",
    "مرطب الشفاه",
    "كريم اليدين",
    "صابون طبيعي"
  ];
  const statuses: Array<"pending" | "processing" | "shipped" | "delivered"> = ["pending", "processing", "shipped", "delivered"];
  const paymentMethods = ["cash", "bank", "online"];

  try {
    const batch = writeBatch(db);
    let batchCount = 0;
    const BATCH_SIZE = 500;

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const street = streets[Math.floor(Math.random() * streets.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const price = 100 + Math.floor(Math.random() * 500);

      const testOrder = {
        orderNumber: i + 1,
        formattedOrderNumber: `ORD-${String(i + 1).padStart(4, "0")}`,
        name: `${firstName} ${lastName}`,
        phone: `010${Math.floor(Math.random() * 1000000000).toString().padStart(9, "0")}`,
        address: `${street}, ${city}`,
        email: `customer${i}@example.com`,
        productName: product,
        productPrice: price,
        quantity,
        totalPrice: price * quantity,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        notes: "test order",
        createdAt: Timestamp.fromDate(
          new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
        ),
        updatedAt: Timestamp.now()
      };

      const docRef = doc(collection(db, "orders"));
      batch.set(docRef, testOrder);

      batchCount++;

      if (batchCount === BATCH_SIZE || i === count - 1) {
        await batch.commit();
        console.log(`✅ Generated ${Math.min((i + 1), count)} test orders`);
        batchCount = 0;
      }
    }

    // Update counter
    await setDoc(doc(db, "counters", "orders"), { value: count + 1 });

    console.log(`✅ Test data generation complete!`);
    return true;
  } catch (error) {
    console.error("❌ Test data generation failed:", error);
    return false;
  }
}

/**
 * 🔍 Verify database integrity
 */
export async function verifyDatabaseIntegrity() {
  console.log("🔍 Verifying database integrity...");

  try {
    const { getAllOrders, getOrderStats } = await import("./firebase-admin");

    const orders = await getAllOrders();
    const stats = await getOrderStats();

    console.log("\n📊 Database Status:");
    console.log(`  Total Orders: ${stats.total}`);
    console.log(`  Pending: ${stats.pending}`);
    console.log(`  Processing: ${stats.processing}`);
    console.log(`  Shipped: ${stats.shipped}`);
    console.log(`  Delivered: ${stats.delivered}`);
    console.log(`  Cancelled: ${stats.cancelled}`);

    // Check for data issues
    const issues: string[] = [];

    orders.forEach((order, index) => {
      if (!order.name) issues.push(`Order ${order.id}: Missing name`);
      if (!order.phone) issues.push(`Order ${order.id}: Missing phone`);
      if (!order.address) issues.push(`Order ${order.id}: Missing address`);
      if (order.totalPrice === undefined) issues.push(`Order ${order.id}: Missing totalPrice`);
    });

    if (issues.length > 0) {
      console.log("\n⚠️ Issues found:");
      issues.forEach(issue => console.log(`  - ${issue}`));
    } else {
      console.log("\n✅ Database integrity verified - no issues found!");
    }

    return issues.length === 0;
  } catch (error) {
    console.error("❌ Verification failed:", error);
    return false;
  }
}

/**
 * 💾 Export orders to JSON (for backup)
 */
export async function exportOrdersToJSON() {
  console.log("💾 Exporting orders to JSON...");

  try {
    const { getAllOrders } = await import("./firebase-admin");
    const orders = await getAllOrders();

    const json = JSON.stringify(orders, null, 2);
    
    // Save to file
    const fs = await import("fs");
    const filename = `orders-backup-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, json);

    console.log(`✅ Orders exported to: ${filename}`);
    console.log(`  Total orders: ${orders.length}`);

    return true;
  } catch (error) {
    console.error("❌ Export failed:", error);
    return false;
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log("🛠️ Firebase Order Management - Utility Script\n");

  switch (command) {
    case "generate-test":
      const count = parseInt(args[1]) || 50;
      generateTestData(count);
      break;

    case "verify":
      verifyDatabaseIntegrity();
      break;

    case "export":
      exportOrdersToJSON();
      break;

    default:
      console.log("Available commands:");
      console.log("  pnpm ts-node lib/migration-utils.ts generate-test [count]");
      console.log("  pnpm ts-node lib/migration-utils.ts verify");
      console.log("  pnpm ts-node lib/migration-utils.ts export");
  }
}

export default {
  migrateOrdersFromOldSystem,
  cleanupTestOrders,
  generateTestData,
  verifyDatabaseIntegrity,
  exportOrdersToJSON
};
