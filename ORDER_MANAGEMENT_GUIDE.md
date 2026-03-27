# 🚀 Order Management System - Implementation Guide

## 📋 Overview

This is an **Elite Level** Order Management System built with Firebase, Next.js, and modern web technologies. It replaces the previous Redis-based counter system with a complete database-driven solution.

---

## 🏗️ Architecture

### Core Components

```
┌─────────────────────────────────────────┐
│     Frontend (Product Pages)            │
│  - useOrderManager() hook               │
│  - Example: example-product-form.tsx    │
└────────────┬────────────────────────────┘
             │ POST /api/orders/create-order
             ▼
┌─────────────────────────────────────────┐
│ API Layer (Next.js Route Handlers)      │
│ - /api/orders/create-order              │
│ - /api/orders/update-status             │
│ - /api/orders/get-all                   │
└────────────┬────────────────────────────┘
             │ Firebase Admin SDK
             ▼
┌─────────────────────────────────────────┐
│ Firebase Firestore Database             │
│ - Collection: orders                    │
│ - Collection: counters                  │
└─────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Admin Dashboard                         │
│ - /admin/dashboard                      │
│ - Real-time order management           │
│ - Status tracking                      │
└─────────────────────────────────────────┘
```

---

## 🔧 Setup Instructions

### 1️⃣ Install Firebase SDK

```bash
pnpm add firebase
```

### 2️⃣ Create Firebase Configuration

Create `lib/firebase-config.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 3️⃣ Setup Environment Variables

Add to `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Dashboard Password
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

### 4️⃣ Create Firestore Collections

Go to Firebase Console and create:

**Collection: `counters`**
- Document: `orders`
- Field: `value` (Number) = `0`

**Collection: `orders`** (Auto-created when first order is saved)

---

## 📚 API Reference

### 1. Create Order API

**Endpoint:** `POST /api/orders/create-order`

**Request Body:**
```json
{
  "name": "Ahmed Ali",
  "phone": "010123456789",
  "address": "Cairo, Egypt",
  "email": "ahmed@example.com",
  "productName": "Luxury Face Cream",
  "productPrice": 350,
  "quantity": 2,
  "paymentMethod": "cash",
  "notes": "Deliver in the morning"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "firestore_document_id",
    "orderNumber": 1,
    "formattedOrderNumber": "ORD-0001",
    "name": "Ahmed Ali",
    "phone": "010123456789",
    "address": "Cairo, Egypt",
    "status": "pending",
    "totalPrice": 700,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "تم إنشاء الطلب ORD-0001 بنجاح"
}
```

---

### 2. Update Order Status API

**Endpoint:** `PATCH /api/orders/update-status`

**Request Body:**
```json
{
  "orderId": "firestore_document_id",
  "status": "shipped"
}
```

**Valid Status Values:**
- `pending` - ⏳ قيد الانتظار
- `processing` - ⚙️ قيد المعالجة
- `shipped` - 📦 تم الشحن
- `delivered` - ✅ تم التسليم
- `cancelled` - ❌ تم الإلغاء

**Response:**
```json
{
  "success": true,
  "message": "تم تحديث حالة الطلب إلى: تم الشحن",
  "status": "shipped"
}
```

---

### 3. Get Orders API

**Endpoint:** `GET /api/orders/get-all`

**Query Parameters:**
- `status` (optional) - Filter by status (e.g., `?status=pending`)

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "doc1",
      "orderNumber": 1,
      "formattedOrderNumber": "ORD-0001",
      "name": "Ahmed Ali",
      "phone": "010123456789",
      "status": "pending",
      "createdAt": {...}
    }
  ],
  "stats": {
    "total": 50,
    "pending": 10,
    "processing": 15,
    "shipped": 20,
    "delivered": 5,
    "cancelled": 0
  },
  "count": 50
}
```

---

## 🪝 React Hook: useOrderManager

### Usage Example

```typescript
import { useOrderManager } from "@/hooks/use-order-manager";

export default function OrderForm() {
  const { createOrder, isLoading, error, success, lastOrder } = useOrderManager();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const order = await createOrder({
      name: "Ahmed",
      phone: "010123456789",
      address: "Cairo",
      email: "ahmed@example.com",
      productName: "Face Cream",
      productPrice: 350,
      quantity: 1,
      paymentMethod: "cash",
      notes: "Special delivery request"
    });

    if (order) {
      console.log("✅ Order created:", order.formattedOrderNumber);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={isLoading}>
        {isLoading ? "جاري..." : "إرسال"}
      </button>
      {error && <p>{error}</p>}
      {success && <p>✅ تم الإنشاء برقم: {lastOrder?.formattedOrderNumber}</p>}
    </form>
  );
}
```

---

## 📊 Admin Dashboard

### Access Dashboard

**URL:** `http://localhost:3000/admin/dashboard`

### Features

✅ **Password Protected**
- Default: `admin123` (change in `.env.local`)

✅ **Statistics Cards**
- Total Orders
- Pending, Processing, Shipped, Delivered, Cancelled

✅ **Orders Table**
- Real-time order list
- Status update via dropdown
- Date formatting

✅ **Filter & Search**
- Filter by status
- Refresh button

✅ **Order Management**
- View all order details
- Update order status instantly
- Color-coded status badges

---

## 📱 Integration with Product Pages

### Example: Using useOrderManager in Product Page

```typescript
import { useOrderManager } from "@/hooks/use-order-manager";

export default function ProductPage() {
  const { createOrder, isLoading } = useOrderManager();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading) return;

    const order = await createOrder({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      productName: "Luxury Serum",
      productPrice: 450,
      quantity: 1
    });

    if (order) {
      // Success - do something
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form inputs */}
      <button disabled={isLoading} type="submit">
        {isLoading ? "جاري..." : "اطلب الآن"}
      </button>
    </form>
  );
}
```

---

## 🔐 Security Best Practices

### 1. Change Admin Password

Update `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`:

```env
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
```

### 2. Firestore Security Rules

Add to Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Only allow reading orders from authenticated users
    match /orders/{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // Write only through API
    }

    // Protect counters
    match /counters/{document=**} {
      allow read, write: if false; // Write only through API
    }
  }
}
```

### 3. API Authentication (Optional)

For production, add API key verification:

```typescript
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  
  if (apiKey !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // ... rest of logic
}
```

---

## 🧪 Testing

### Test Create Order

```bash
curl -X POST http://localhost:3000/api/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "010123456789",
    "address": "Test Address",
    "productName": "Test Product",
    "productPrice": 100
  }'
```

### Test Get Orders

```bash
curl http://localhost:3000/api/orders/get-all
```

### Test Update Status

```bash
curl -X PATCH http://localhost:3000/api/orders/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "YOUR_ORDER_ID",
    "status": "shipped"
  }'
```

---

## 📊 Firebase Admin SDK (Backend)

### Available Functions in `lib/firebase-admin.ts`

```typescript
// Create new order
await createOrder(orderData)

// Get all orders
await getAllOrders()

// Get orders by status
await getOrdersByStatus("pending")

// Get specific order
await getOrderById(orderId)

// Update order status
await updateOrderStatus(orderId, "shipped")

// Update entire order
await updateOrder(orderId, { notes: "Updated" })

// Delete order
await deleteOrder(orderId)

// Get statistics
await getOrderStats()

// Bulk update status
await bulkUpdateOrdersStatus([id1, id2], "shipped")

// Get orders by date range
await getOrdersByDateRange(startDate, endDate)

// Generate next order number
await getNextOrderNumber()
```

---

## 🚀 Migration from Redis to Firebase

### If coming from old Redis system:

1. **Export old order data** from Redis
2. **Transform data** to Order interface
3. **Import to Firebase** using batch operations:

```typescript
const batch = writeBatch(db);

oldOrders.forEach(order => {
  const docRef = doc(collection(db, "orders"));
  batch.set(docRef, order);
});

await batch.commit();
```

---

## ✅ Checklist

- [ ] Firebase project created
- [ ] Environment variables added
- [ ] `firebase-config.ts` created
- [ ] Collections created in Firestore
- [ ] API endpoints tested
- [ ] Admin dashboard password changed
- [ ] Security rules updated
- [ ] Product pages integrated with `useOrderManager`
- [ ] Deployed to production

---

## 🎯 Next Steps

1. **Real-time Updates**: Add Firestore listeners for live order updates
2. **Email Notifications**: Integrate Brevo/Nodemailer for order confirmations
3. **SMS Alerts**: Add Twilio for SMS notifications
4. **Export Orders**: Add CSV export functionality
5. **Analytics**: Dashboard with insights and trends
6. **Customer Portal**: Let customers track their orders
7. **Admin Notifications**: Telegram/WhatsApp alerts for new orders

---

## 📞 Support

For issues or questions, check:
- Firebase Console for errors
- Browser Console for client errors
- Network tab in DevTools for API issues

---

Happy Order Management! 🎉
