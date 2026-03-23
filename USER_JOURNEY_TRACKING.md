# 🔍 تتبع كامل لرحلة المستخدم (User Journey Tracking)

## سيناريو كامل: من دخول الموقع إلى إكمال الشراء

---

## ⏱️ اللحظة الأولى: دخول الموقع

### ما يحدث على الـ Frontend:
```typescript
1. يحمل layout.tsx
2. يُحمّل <AnalyticsTracker /> component
3. في useEffect:
   - يُنشأ session ID فريد (مثلاً: 1234567890-abc123)
   - يُحفظ في localStorage
   - يُرسل event: "visit"

// مثال:
{
  type: "visit",
  sessionId: "1234567890-abc123",
  metadata: {
    sessionDuration: 0,
    timestamp: "2026-03-23T10:30:00Z",
    userAgent: "Mozilla/5.0..."
  }
}
```

### ما يحدث على الـ Backend:
```typescript
1. POST /api/analytics/track يستقبل الـ event
2. يتحقق من الـ session ID
3. يُحفظ في analytics_events table:

INSERT INTO analytics_events 
(type, session_id, metadata, created_at)
VALUES (
  'visit',
  '1234567890-abc123',
  '{"sessionDuration": 0, ...}',
  NOW()
)
```

### في الـ Dashboard الحقيقي:
```javascript
// في /api/admin/analytics
visitSessions = new Set(['1234567890-abc123', ...])
// النتيجة: +1 إلى "Visitors" في الـ KPI
```

---

## 👀 اللحظة الثانية: مشاهدة المنتج

### السيناريو:
> المستخدم يدخل صفحة Dry Oil (`/order/dri-oil`)

### ما يحدث:

#### Frontend (product-page.tsx):
```typescript
// useEffect عند التحميل
useEffect(() => {
  trackEvent('product_viewed', {
    productId: 'dri-oil',
    productName: 'Dry Oil',
    price: 250,
    color: 'from-yellow-400 to-amber-500',
  })
}, [product.id])

// يُرسل:
{
  type: "product_viewed",
  sessionId: "1234567890-abc123",
  metadata: {
    productId: "dri-oil",
    productName: "Dry Oil",
    price: 250,
    color: "from-yellow-400 to-amber-500",
    path: "/order/dri-oil"
  }
}
```

#### Backend:
```sql
INSERT INTO analytics_events 
VALUES ('product_viewed', '1234567890-abc123', {...}, NOW())
```

#### في Dashboard:
```javascript
// يُحسب:
- productViewed events = 1
- allProducts = { "Dry Oil": 1, ... }
- Top 5 Products تُحدّث
```

---

## 🛒 اللحظة الثالثة: إضافة للسلة

### السيناريو:
> المستخدم يضغط "أضف للسلة"

### ما يحدث:

#### Frontend (product-page.tsx):
```typescript
const handleAddToCart = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // 1. أضف للسلة عبر Context
  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: quantity,
  })
  
  // 2. تتبع الحدث
  trackEvent('add_to_cart', {
    productId: product.id,
    productName: product.name,
    price: product.price,
    quantity: quantity,
  })
}

// يُرسل:
{
  type: "add_to_cart",
  sessionId: "1234567890-abc123",
  metadata: {
    productId: "dri-oil",
    productName: "Dry Oil",
    price: 250,
    quantity: 1
  }
}
```

#### Backend:
```sql
INSERT INTO analytics_events 
VALUES ('add_to_cart', '1234567890-abc123', {...}, NOW())
```

#### في Dashboard:
```javascript
// يُحسب:
addToCartSessions.add('1234567890-abc123')
// النتيجة: +1 إلى "Add to cart" في الـ Funnel
```

#### في Wishlist (إذا الزر موجود):
```typescript
// نفس الفكرة لكن مع event نوع آخر
trackEvent('wishlist_added', { ... })
```

---

## 💳 اللحظة الرابعة: بدء الشراء

### السيناريو:
> المستخدم يملأ البيانات ويضغط "اكمل الطلب"

### ما يحدث:

#### Frontend (
product-page.tsx أو cart/page.tsx):
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (isSubmitting) return
  setIsSubmitting(true)
  
  try {
    // 1. تتبع بدء الشراء
    trackEvent('checkout_started', {
      totalPrice: quantity * product.price,
      itemCount: quantity,
    })
    
    // 2. إرسال الطلب للـ API
    const response = await fetch('/api/sendOrder', {
      method: 'POST',
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        products: cartItems,
        ...
      })
    })
    
    const result = await response.json()
    const orderId = result.orderId
    
    // 3. تتبع إكمال الشراء
    trackEvent('order_completed', {
      orderId: orderId,
      products: cartItems,
      totalPrice: totalPrice,
    })
  }
}
```

#### Backend (sendOrder API):
```typescript
1. تتبع الـ checkout_started event
2. معالجة الطلب:
   - توليد order ID فريد
   - حفظ في database:

   INSERT INTO orders 
   (orderNumber, products, customer, finalTotal, createdAt)
   VALUES (
     'ORD-0001',
     '[{"id": "dri-oil", "name": "Dry Oil", ...}]',
     '{"fullName": "أحمد", ...}',
     250,
     NOW()
   )

3. إرسال Email للعميل + الإدارة
4. إرسال Telegram notification
```

#### في Dashboard:
```javascript
// يُحسب:
orders = prisma.order.findMany()
// النتيجة: +1 إلى "Orders Today"
// النتيجة: +250 EGP إلى "Total Revenue"
// النتيجة: +1 إلى "Completed" في الـ Funnel

completedSessions.add('1234567890-abc123')
conversionRate = (completedSessions.size / visitSessions.size) * 100
// النتيجة: تحديث نسبة التحويل
```

---

## 🎯 الـ Funnel النهائي:

```
┌─────────────────────────────────┐
│ Step 1: Visitors                │
│ sessions with 'visit' event     │
│ في وقت معين = 1 زائر          │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│ Step 2: Add to Cart             │
│ sessions with 'add_to_cart'     │
│ من نفس الـ sessions = 1 زائر  │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│ Step 3: Checkout Started        │
│ sessions with 'checkout_started'│
│ = 1 زائر                        │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│ Step 4: Completed               │
│ sessions with 'order_completed' │
│ = 1 CLIENT (مشتري)              │
└─────────────────────────────────┘

Conversion Rate = (1 / 1) * 100 = 100%
```

---

## 📊 البيانات التي يعرضها الـ Admin Dashboard:

### KPIs الحقيقية:
```
Total Revenue: 250 EGP (من الطلب)
Orders Today: 1
Conversion Rate: 100%
AOV: 250 EGP (المتوسط)
Monthly Growth: |(هذا الشهر - الشهر الماضي) / الشهر الماضي| × 100
Yearly Growth: نفس الفكرة
```

### Top Products:
```
1. Dry Oil - Qty: 1, Revenue: 250 EGP
```

### Sales by Governorate:
```
Cairo (المحافظة من البيانات): 1 order, 250 EGP
```

### Smart Insights:
```
Best Selling Hour: 10 (10 AM - وقت الطلب)
Best Selling Day: Monday (يوم الطلب)
Returning Customers: 0% (أول مشتري)
Customer Lifetime Value: 250 EGP
```

---

## 🔄 الـ Real-time Updates:

### سيناريو متقدم:
```
User 1: يشتري → Dashboard عامل فعلاً
User 2: يفتح منتج في نفس اللحظة → Dashboard يشوفه حي
User 3: يضيف للسلة → Dashboard يحدّث الفانل
```

### الـ Polling:
```typescript
// في /admin/page.tsx
useEffect(() => {
  loadAnalytics(range) // كل ما يتغير الـ range
}, [range])

// المستقبل: يمكن إضافة socket.io لتحديث غير متزامن
```

---

## 📈 مثال كامل من الـ Database:

### جدول analytics_events:
```sql
id | type | session_id | metadata | created_at
---|------|-----------|----------|------------
1  | visit | 1234567890-abc123 | {...} | 2026-03-23 10:30:00
2  | product_viewed | 1234567890-abc123 | {product: dri-oil} | 2026-03-23 10:30:45
3  | add_to_cart | 1234567890-abc123 | {product: dri-oil, qty: 1} | 2026-03-23 10:31:00
4  | checkout_started | 1234567890-abc123 | {total: 250} | 2026-03-23 10:31:30
5  | order_completed | 1234567890-abc123 | {orderId: ORD-0001} | 2026-03-23 10:32:00
```

### جدول orders:
```sql
id | orderNumber | products | customer | finalTotal | createdAt
---|-------------|----------|----------|-----------|----------
1  | ORD-0001 | [{id: dri-oil, name: Dry Oil, price: 250, qty: 1}] | {name: أحمد, email: ahmed@test.com, phone: 201234567890, governorate: Cairo} | 250 | 2026-03-23 10:32:00
```

---

## ✅ التحقق من النظام:

```bash
# 1. تحقق من البيانات في database مباشرة:
SELECT * FROM analytics_events 
WHERE session_id = '1234567890-abc123' 
ORDER BY created_at;

# النتيجة: هتشوف جميع الأحداث للجلسة

# 2. تحقق من الطلبات:
SELECT * FROM orders 
WHERE createdAt > NOW() - INTERVAL '24 hours'
ORDER BY createdAt DESC;

# النتيجة: جميع الطلبات اليومية
```

---

## 🚨 حالات خاصة:

### 1. الزائر بدون شراء:
```
visit → product_viewed → session_ended
(في الـ Conversion Funnel يبقى في "Visitors" فقط)
```

### 2. الزائر يضيف ولا يشتري:
```
visit → product_viewed → add_to_cart → session_ended
(في الـ Funnel: يبقى في "Add to Cart")
```

### 3. إعادة المحاولة:
```
visit → checkout_started (محاولة 1) 
→ remove_from_cart (ندم) → add_to_cart (again)
→ checkout_started (محاولة 2)
→ order_completed
```

---

## 📝 الملخص:

| الحدث | الـ Event | الـ KPI المتأثر |
|------|---------|-----------------|
| دخول الموقع | visit | Visitors |
| مشاهدة منتج | product_viewed | Products Viewed |
| إضافة للسلة | add_to_cart | Add to Cart Funnel |
| بدء الشراء | checkout_started | Checkout Funnel |
| إكمال الشراء | order_completed | Revenue, Orders, Conversion |
| انتهاء الجلسة | session_ended | Session Duration |

---

**تم إنشاؤه:** March 23, 2026
**الحالة:** ✅ توثيق كامل للنظام التحليلي الحقيقي
