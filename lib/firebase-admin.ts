// Firebase Admin Service for Order Management
import { db } from "./firebase-config";
import {
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  deleteDoc,
  writeBatch
} from "firebase/firestore";

// ===============================
// 📊 Order Management Functions
// ===============================

export interface Order {
  id?: string;
  orderNumber: number;
  formattedOrderNumber: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  productName?: string;
  productPrice?: number;
  quantity?: number;
  totalPrice?: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod?: string;
  notes?: string;
  createdAt: any;
  updatedAt?: any;
}

/**
 * 🔢 Generate next order number using atomic counter
 */
export async function getNextOrderNumber(): Promise<{
  orderNumber: number;
  formattedOrderNumber: string;
}> {
  try {
    const counterRef = doc(db, "counters", "orders");
    
    // Initialize counter if doesn't exist
    const snap = await getDoc(counterRef);
    if (!snap.exists()) {
      await setDoc(counterRef, { value: 1 });
    }
    
    // Atomic increment
    await updateDoc(counterRef, {
      value: increment(1)
    });
    
    const updatedSnap = await getDoc(counterRef);
    const orderNumber = updatedSnap.data()!.value;
    
    return {
      orderNumber,
      formattedOrderNumber: `ORD-${orderNumber.toString().padStart(4, "0")}`
    };
  } catch (error) {
    console.error("❌ Error generating order number:", error);
    // Fallback to timestamp-based ID
    const timestamp = Date.now();
    return {
      orderNumber: timestamp,
      formattedOrderNumber: `ORD-${timestamp}`
    };
  }
}

/**
 * 💾 Save a new order to Firebase
 */
export async function createOrder(orderData: Omit<Order, "id">): Promise<{
  id: string;
  order: Order;
}> {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      order: {
        id: docRef.id,
        ...orderData
      }
    };
  } catch (error) {
    console.error("❌ Error creating order:", error);
    throw error;
  }
}

/**
 * 📝 Get all orders
 */
export async function getAllOrders(): Promise<Order[]> {
  try {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc: any) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return [];
  }
}

/**
 * 🔍 Get specific order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Order;
    }
    return null;
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    return null;
  }
}

/**
 * 🔍 Get orders by specific status
 */
export async function getOrdersByStatus(
  status: Order["status"]
): Promise<Order[]> {
  try {
    const q = query(
      collection(db, "orders"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc: any) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("❌ Error fetching orders by status:", error);
    return [];
  }
}

/**
 * ✏️ Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<boolean> {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    return false;
  }
}

/**
 * ✏️ Update entire order
 */
export async function updateOrder(
  orderId: string,
  updates: Partial<Order>
): Promise<boolean> {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error("❌ Error updating order:", error);
    return false;
  }
}

/**
 * 🗑️ Delete order
 */
export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "orders", orderId));
    return true;
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    return false;
  }
}

/**
 * 📊 Get order statistics
 */
export async function getOrderStats(): Promise<{
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}> {
  try {
    const allOrders = await getAllOrders();
    
    return {
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === "pending").length,
      processing: allOrders.filter(o => o.status === "processing").length,
      shipped: allOrders.filter(o => o.status === "shipped").length,
      delivered: allOrders.filter(o => o.status === "delivered").length,
      cancelled: allOrders.filter(o => o.status === "cancelled").length
    };
  } catch (error) {
    console.error("❌ Error fetching order stats:", error);
    return { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
  }
}

/**
 * 🔄 Bulk update orders status
 */
export async function bulkUpdateOrdersStatus(
  orderIds: string[],
  status: Order["status"]
): Promise<boolean> {
  try {
    const batch = writeBatch(db);
    
    orderIds.forEach(orderId => {
      const orderRef = doc(db, "orders", orderId);
      batch.update(orderRef, { 
        status,
        updatedAt: Timestamp.now()
      });
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error("❌ Error bulk updating orders:", error);
    return false;
  }
}

/**
 * 📈 Get orders within date range
 */
export async function getOrdersByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Order[]> {
  try {
    const q = query(
      collection(db, "orders"),
      where("createdAt", ">=", Timestamp.fromDate(startDate)),
      where("createdAt", "<=", Timestamp.fromDate(endDate)),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc: any) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("❌ Error fetching orders by date range:", error);
    return [];
  }
}
