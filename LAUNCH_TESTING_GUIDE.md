# 🧪 Launch Testing Guide - Full Verification

## 📋 Pre-Testing Setup

### 1. Set Strong Admin Password
```bash
# .env.local
NEXT_PUBLIC_ADMIN_PASSWORD=SecurePass_2026#Luqitchy
```

### 2. Verify Firestore Setup
```
Database: firestore
Collection: counters
Document: orders
Field: value = 0
```

### 3. Start Dev Server
```bash
pnpm dev
# Should see: ready - started server on 0.0.0.0:3000
```

---

## 🔒 SECURITY TESTS

### Test 1: Password Protection ✅
**Verify:** Admin password change works

**Steps:**
1. Visit `http://localhost:3000/admin/dashboard`
2. Try password: `admin123` → Should fail ❌
3. Try new password: `SecurePass_2026#Luqitchy` → Should pass ✅
4. Repeat for `/admin/realtime` and `/admin/dashboard-advanced`

**Expected Result:**
- Old password rejected
- New password accepted
- Dashboard visible

---

### Test 2: API Input Validation ✅
**Verify:** Invalid orders are rejected

**Test Case 1: Empty Name**
```bash
curl -X POST http://localhost:3000/api/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "phone": "01012345678",
    "address": "Cairo",
    "productName": "Face Cream",
    "price": 200,
    "quantity": 1,
    "paymentMethod": "cash"
  }'
```
**Expected:** `400 - "الاسم مطلوب"`

**Test Case 2: Invalid Phone**
```bash
curl -X POST http://localhost:3000/api/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد",
    "phone": "123",
    "address": "Cairo",
    "productName": "Face Cream",
    "price": 200,
    "quantity": 1,
    "paymentMethod": "cash"
  }'
```
**Expected:** `400 - "رقم الهاتف غير صحيح"`

**Test Case 3: Price out of range**
```bash
curl -X POST http://localhost:3000/api/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد",
    "phone": "01012345678",
    "address": "Cairo",
    "productName": "Face Cream",
    "price": 2000000,
    "quantity": 1,
    "paymentMethod": "cash"
  }'
```
**Expected:** `400 - "السعر غير صحيح"`

**Test Case 4: Valid order**
```bash
curl -X POST http://localhost:3000/api/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "phone": "01012345678",
    "address": "62 شارع التحرير، القاهرة",
    "productName": "Face Cream",
    "price": 250,
    "quantity": 2,
    "paymentMethod": "cash"
  }'
```
**Expected:** `200 - { "orderId": "ORD-0001", ... }`

---

### Test 3: HTTP Method Validation ✅
**Verify:** Only correct methods work

**Test: Try GET on POST endpoint**
```bash
curl -X GET http://localhost:3000/api/orders/create-order
```
**Expected:** `405 - Method Not Allowed`

**Test: Try GET on PATCH endpoint**
```bash
curl -X GET http://localhost:3000/api/orders/update-status
```
**Expected:** `405 - Method Not Allowed`

**Test: Try POST on PATCH endpoint**
```bash
curl -X POST http://localhost:3000/api/orders/update-status \
  -H "Content-Type: application/json" \
  -d '{ "orderId": "ORD-0001", "status": "shipped" }'
```
**Expected:** `405 - Method Not Allowed`

**Test: Correct PATCH method**
```bash
curl -X PATCH http://localhost:3000/api/orders/update-status \
  -H "Content-Type: application/json" \
  -d '{ "orderId": "ORD-0001", "status": "shipped" }'
```
**Expected:** `200 - Success` or `404 - Order not found`

---

### Test 4: Spam Prevention ✅
**Verify:** Long inputs are rejected

**Test: Name too long (>100 chars)**
```bash
curl -X POST http://localhost:3000/api/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد علي عبدالرحمن السيد الحاج الدين الشريف البوصيري الإسطنبولي المصري الشرقاوي الغربي الشمالي الجنوبي الطويل جدا جدا جدا جدا جدا",
    "phone": "01012345678",
    "address": "Cairo",
    "productName": "Product",
    "price": 100,
    "quantity": 1,
    "paymentMethod": "cash"
  }'
```
**Expected:** `400 - "الاسم طويل جداً"`

---

## 📊 FEATURE TESTS

### Test 5: Create Test Order ✅
**Verify:** Can create and retrieve orders

**Action: Submit order through UI**
1. Visit `http://localhost:3000`
2. Click on any product
3. Fill form:
   - الاسم: أحمد محمد
   - الهاتف: 01012345678
   - العنوان: 62 شارع التحرير، القاهرة
   - طريقة الدفع: cash
4. Click "اطلب الآن"

**Expected:**
- ✅ Button shows "جاري..." during submission
- ✅ Cannot click again (disabled)
- ✅ Success message appears
- ✅ Order ID shown (ORD-0001)

---

### Test 6: Customer Order Tracking ✅
**Verify:** `/track` page works

**Steps:**
1. Visit `http://localhost:3000/track`
2. Should see search bar
3. Enter order ID: `ORD-0001`
4. Click search

**Expected:**
- ✅ Order details displayed
- ✅ Status timeline shown
- ✅ Customer name visible
- ✅ Phone number visible
- ✅ Address visible
- ✅ Product shown
- ✅ Price displayed
- ✅ Status color-coded
- ✅ Relative time shown ("قبل دقيقة")

**Timeline should show:**
- 🟡 Pending (current)
- ⚫ Processing (next)
- 🔵 Shipped (next)
- 🟢 Delivered (final)

---

### Test 7: Order Status Update ✅
**Verify:** Status updates reflect everywhere

**Steps:**
1. Open `/admin/dashboard`
2. Find created order (ORD-0001)
3. Click status button
4. Change to "processing"
5. Observe changes

**Expected:**
- ✅ Basic dashboard shows updated status
- ✅ Advanced dashboard shows updated status
- ✅ Customer tracking page shows timeline update
- ✅ Real-time dashboard updates automatically

---

### Test 8: Real-Time Dashboard ✅
**Verify:** `/admin/realtime` updates automatically

**Setup:**
1. Open `/admin/realtime` in window 1
2. Open `/admin/dashboard-advanced` in window 2
3. Enter admin password

**Actions in Window 2:**
- Create a new order
- Update order status

**Observe Window 1:**
- ✅ New order appears automatically
- ✅ Status updates in real-time
- ✅ Statistics update (total, pending, etc.)
- ✅ "Live" indicator shows green/animated
- ✅ No manual refresh needed

**Performance:**
- Updates should appear within 1-2 seconds
- No lag observed
- Numbers accurate

---

### Test 9: Profit Tracking ✅
**Verify:** Profit calculations work

**Setup data:**
Create 3 orders with different products and prices:
1. Face Cream - 250 EGP (Cost: 50 EGP)
2. Serum - 180 EGP (Cost: 30 EGP)
3. Face Cream - 250 EGP (Cost: 50 EGP)

**Navigate:** `/admin/dashboard-advanced`
**Look for:** Profit statistics (if visible in dashboard)

**Expected Calculations:**
```
Product: Face Cream
  Revenue: 500 EGP (2 × 250)
  Cost: 100 EGP (2 × 50)
  Profit: 400 EGP
  Margin: 80%

Product: Serum
  Revenue: 180 EGP (1 × 180)
  Cost: 30 EGP
  Profit: 150 EGP
  Margin: 83%
```

---

### Test 10: Search Functionality ✅
**Verify:** Search works correctly

**Test Case 1: Search by order number**
- Order created: ORD-0001
- Search: "ORD-0001"
- **Expected:** Found ✅

**Test Case 2: Search by customer name**
- Order by: أحمد محمد
- Search: "أحمد"
- **Expected:** Found ✅

**Test Case 3: Search by phone**
- Order phone: 01012345678
- Search: "010123"
- **Expected:** Found ✅

**Test Case 4: Search by product**
- Order product: Face Cream
- Search: "Face"
- **Expected:** Found ✅

---

### Test 11: CSV Export ✅
**Verify:** Can export orders

**Steps:**
1. Click "تحميل CSV" button
2. File downloads
3. Open in Excel/Sheets

**Expected:**
- ✅ File named something like "orders-2024.csv"
- ✅ Columns: Order ID, Name, Phone, Address, Product, Price, Status, Date
- ✅ All orders included
- ✅ Arabic text readable

---

### Test 12: Date Filtering ✅
**Verify:** Can filter by date range

**Steps:**
1. Visit `/admin/dashboard-advanced`
2. Select date range
3. Click filter

**Expected:**
- ✅ Only orders in date range shown
- ✅ Count updated accurately
- ✅ Statistics recalculated

---

## 🌐 FIRESTORE RULES VERIFICATION

### Test 13: Security Rules Enforcement ✅
**Verify:** Rules prevent unauthorized access

**Before launching, update Firebase Rules to:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{document=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    match /counters/{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Test 1: Try reading orders without authentication**
- Open browser DevTools
- Go to Firebase SDK console
- Try: `db.collection('orders').getDocs()`
- **Expected:** ❌ Permission denied

**Test 2: Try creating document directly**
- Try: `db.collection('test').add({data})`
- **Expected:** ❌ Permission denied

**Test 3: API still works**
- Run: `curl http://localhost:3000/api/orders/get-all`
- **Expected:** ✅ Returns orders (API uses admin SDK)

---

## 📱 RESPONSIVE DESIGN TESTS

### Test 14: Mobile View ✅
**Verify:** Works on phone sizes

**Chrome DevTools:**
1. Press F12
2. Click mobile icon
3. Test as iPhone 12

**Check:**
- ✅ `/track` page readable on mobile
- ✅ Form fields full width
- ✅ Buttons clickable
- ✅ Timeline displays correctly
- ✅ Dashboard responsive

---

## 🚀 PRODUCTION READINESS CHECKLIST

### Pre-Deployment
- [ ] Run `pnpm lint` - No errors
- [ ] Run `pnpm build` - Builds successfully
- [ ] All 12 tests pass locally
- [ ] No console errors in DevTools
- [ ] Environment variables set in Vercel

### Security Final Check
- [ ] Admin password changed ✅
- [ ] Firestore rules updated ✅
- [ ] Counter document verified ✅
- [ ] API validation working ✅
- [ ] Method validation working ✅

### Feature Final Check
- [ ] Order creation works ✅
- [ ] Order tracking works ✅
- [ ] Real-time updates work ✅
- [ ] Profit tracking works ✅
- [ ] Search works ✅
- [ ] Export works ✅

### Deployment
- [ ] Push to GitHub
- [ ] Deploy Vercel
- [ ] Set all environment variables
- [ ] Test production URLs
- [ ] Monitor for errors

---

## 📊 Test Results Template

Record results here:

```
Test Date: _______________
Tester: ___________________

SECURITY TESTS:
[ ] Test 1: Password Protection ______
[ ] Test 2: API Input Validation ______
[ ] Test 3: HTTP Method Validation ______
[ ] Test 4: Spam Prevention ______
[ ] Test 13: Firestore Rules ______

FEATURE TESTS:
[ ] Test 5: Create Order ______
[ ] Test 6: Order Tracking ______
[ ] Test 7: Status Update ______
[ ] Test 8: Real-Time Dashboard ______
[ ] Test 9: Profit Tracking ______
[ ] Test 10: Search ______
[ ] Test 11: CSV Export ______
[ ] Test 12: Date Filtering ______
[ ] Test 14: Mobile View ______

OVERALL STATUS:
[ ] All tests passed
[ ] Ready for production
[ ] Issues found (list below)

Issues Found:
_______________________________
_______________________________
_______________________________
```

---

## 🎉 Launch Ready!

All tests passed? 
- ✅ Code is secure
- ✅ Features work
- ✅ Production ready

**Push to production!** 🚀
