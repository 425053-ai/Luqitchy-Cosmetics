# 📊 نظام التحليلات الفعلي والحي

## ✅ حالة النظام

النظام التحليلي **مُفعّل بالكامل** ويتتبع كل الأنشطة الفعلية على الموقع بالوقت الحقيقي.

---

## 🎯 ما يتم تتبعه حالياً

### 1️⃣ **أحداث الزوار (Visitor Events)**
- ✅ `visit` - دخول الموقع
- ✅ `page_view` - مشاهدة صفحة معينة
- ✅ `product_viewed` - مشاهدة تفاصيل منتج
- ✅ `session_ended` - انتهاء الجلسة

### 2️⃣ **أحداث السلة (Cart Events)**
- ✅ `add_to_cart` - إضافة منتج للسلة
- ✅ `remove_from_cart` - إزالة منتج من السلة

### 3️⃣ **أحداث الشراء (Purchase Events)**
- ✅ `checkout_started` - بدء عملية الدفع
- ✅ `order_completed` - إكمال الطلب

---

## 📂 البنية التقنية

### قاعدة البيانات
```sql
-- جدول الأحداث (Analytics Events)
TABLE analytics_events {
  id: BIGINT (ID فريد)
  type: VARCHAR (نوع الحدث)
  session_id: VARCHAR (معرف الجلسة)
  metadata: JSONB (بيانات الحدث)
  created_at: TIMESTAMP (وقت الحدث)
}

-- جدول الطلبات (Orders)
TABLE orders {
  id: INT (ID الطلب)
  orderNumber: STRING (رقم الطلب)
  products: JSON (المنتجات المشتراة)
  customer: JSON (بيانات العميل)
  finalTotal: INT (المبلغ الإجمالي)
  createdAt: TIMESTAMP (وقت الطلب)
}
```

### Indexes للأداء السريعة
```sql
✅ idx_analytics_events_type_created (للبحث حسب النوع والتاريخ)
✅ idx_analytics_events_session_created (للبحث حسب الجلسة)
✅ idx_analytics_events_session_id (للبحث المباشر بالجلسة)
```

---

## 🔄 سريان العمل (Data Flow)

### على الـ Frontend:
```
1. المستخدم يدخل الموقع
   ↓
2. التحميل الأول → يُنشأ session ID فريد
   ↓
3. كل فعل يُتتبع ويُرسل للـ API:
   - مشاهدة منتج → product_viewed
   - إضافة للسلة → add_to_cart
   - إزالة من السلة → remove_from_cart
   - الشراء → order_completed
```

### على الـ Backend:
```
1. API endpoint يستقبل الحدث
   ↓
2. يحفظه في analytics_events table
   ↓
3. عند الشراء يحفظ الطلب في orders table
   ↓
4. الـ Dashboard يقرأ البيانات من database
```

---

## 📊 ما يعطيه لك الـ Dashboard

### 1. الـ KPIs (المقاييس الرئيسية):
- **Total Revenue** ← مجموع المبيعات
- **Orders Today** ← الطلبات اليومية
- **Conversion Rate** ← نسبة التحويل (الزوار → المشترين)
- **AOV (Average Order Value)** ← المتوسط لكل طلب
- **Monthly/Yearly Growth** ← النمو بالمقارنة

### 2. الـ Charts (الرسوم البيانية):
- **Revenue per Month** ← المبيعات شهرياً
- **Orders per Day** ← الطلبات يومياً (آخر 30 يوم)
- **Top 5 Products** ← المنتجات الأكثر مبيعاً
- **Sales by Governorate** ← المبيعات حسب المحافظة

### 3. الـ Funnel (قمع التحويل):
```
Visitors (جميع الزوار)
    ↓
Add to Cart (الذين أضافوا للسلة)
    ↓
Checkout (الذين بدأوا الدفع)
    ↓
Completed (الذين أكملوا الشراء)
```

### 4. Smart Insights:
- **Best Selling Hour** ← أفضل ساعة للبيع (مثل 2 PM)
- **Best Selling Day** ← أفضل يوم (مثل Friday)
- **Returning Customers %** ← نسبة الزبائن الدائمين
- **Customer Lifetime Value** ← قيمة الزبون طول عمره

---

## 🧪 كيفية الاختبار

### الطريقة 1: من خلال الموقع الفعلي
```
1. ادخل إلى الموقع الرئيسي
2. شوف المنتجات
3. أضف منتج للسلة
4. أكمل الشراء
5. ادخل /admin وشوف البيانات تتحدّث الفور
```

### الطريقة 2: من Console Browser
```javascript
// للتحقق من أن analytics يعمل
console.log(localStorage.getItem('luqitchy-session-id'))

// هتشوف شيء مثل: "1234567890-abc1234def"
```

### الطريقة 3: من Network Tab
```
1. اضغط F12 → Network
2. امشي على المتجر
3. ركز على الـ requests إلى `/api/analytics/track`
4. هتشوف requests تروح كل ما تعمل حاجة
```

---

## 🔐 الوصول إلى الـ Dashboard

### من الموقع:
```
🔗 /admin/page.tsx → Business Intelligence Dashboard
🔗 /admin/visitors/page.tsx → Real-time Visitors Tracking
🔗 /admin/transfers/page.tsx → Bank Transfer Verification
```

### المتطلبات:
- ✅ يجب تسجيل دخولك كـ admin
- ✅ الـ Session Token يُتخزن في الـ Cookies
- ✅ Authorization يتم من خلال `lib/admin-auth.ts`

---

## 📈 الـ APIs المتاحة

### 1. تتبع الحدث
```
POST /api/analytics/track

Body:
{
  "type": "product_viewed",
  "sessionId": "1234-abc",
  "metadata": {
    "productName": "Dri Oil",
    "price": 250,
    "path": "/order/dri-oil"
  }
}
```

### 2. الحصول على البيانات
```
GET /api/admin/analytics?range=30d

Response:
{
  "kpis": { ... },
  "charts": { ... },
  "funnel": { ... },
  "insights": { ... }
}
```

### 3. الزوار الحيين
```
GET /api/admin/visitors?range=24h

Response:
[
  {
    "sessionId": "1234-abc",
    "status": "visitor|cart_user|converted",
    "pageViews": 5,
    "lastPath": "/order/dri-oil",
    "duration": 245 // seconds
  }
]
```

---

## ✨ الميزات التي تم تفعيلها

### في المنتجات:
- ✅ تتبع كل مشاهدة منتج
- ✅ تتبع كل إضافة للسلة
- ✅ تتبع كل إزالة من السلة

### في الشراء:
- ✅ تتبع بدء الشراء
- ✅ تتبع إكمال الطلب
- ✅ حفظ بيانات الطلب كاملة

### في الـ Admin:
- ✅ عرض البيانات الحية
- ✅ تحديث تلقائي كل قليل
- ✅ رسوم بيانية احترافية
- ✅ تصفية حسب الفترة الزمنية

---

## 🔍 البيانات التي تُحفظ

### لحدث مشاهدة المنتج:
```json
{
  "type": "product_viewed",
  "sessionId": "1234567890-abc1234",
  "metadata": {
    "productId": "dri-oil",
    "productName": "Dri Oil",
    "price": 250,
    "color": "from-yellow-400 to-amber-500",
    "sessionDuration": 45,
    "timestamp": "2026-03-23T10:30:00Z"
  }
}
```

### لحدث الشراء:
```json
{
  "type": "order_completed",
  "sessionId": "1234567890-abc1234",
  "metadata": {
    "orderId": "ORD-0001",
    "totalPrice": 250,
    "products": [
      {
        "id": "dri-oil",
        "name": "Dri Oil",
        "price": 250,
        "quantity": 1
      }
    ],
    "customerName": "أحمد محمد",
    "customerEmail": "ahmed@example.com",
    "governorate": "Cairo"
  }
}
```

---

## 📱 للتحقق الفعلي

```bash
# 1. شغّل الموقع
pnpm dev

# 2. ادخل /admin (بدون الحاجة لـ password الآن)
http://localhost:3000/admin

# 3. ادخل إلى الموقع من browser آخر أو tab جديدة
http://localhost:3000

# 4. تفاعل مع المنتجات وشوف البيانات تتحدّث في الـ Admin tab
```

---

## 🎯 الخطوات التالية المقترحة

1. ✅ **التحقق من الـ Real-time**: شوف البيانات تتحدّث بدون ما تعيد تحويل الصفحة
2. ✅ **الـ Excel Export**: إضافة زر لتحميل البيانات كـ Excel
3. ✅ **الـ Custom Reports**: إنشاء تقارير مخصصة
4. ✅ **الـ Notifications**: إشعارات عند وصول مبيعات معينة

---

## 📞 الدعم والمشاكل

إذا كان هناك مشكلة:
1. تحقق من console (F12) للـ errors
2. تحقق من Network tab للـ failed requests
3. تحقق من database connection
4. شوف الـ logs في server console

---

**تم إنشاؤه:** March 23, 2026
**الإصدار:** v1.0 (Production Ready)
**الحالة:** ✅ جاهز للاستخدام الفعلي
