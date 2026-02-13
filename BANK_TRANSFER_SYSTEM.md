# 🏦 نظام التحويل البنكي - Luqitchy Cosmetics

## 📋 نظرة عامة

تم تحويل نظام الدفع بالكامل ليعتمد **فقط على التحويلات البنكية** مع إمكانية:
- ✅ رفع صورة التحويل من قبل العميل
- ✅ إرسال الصورة عبر 3 قنوات (Telegram + Email + Admin Dashboard)
- ✅ تتبع الطلبات وتأكيد الدفع

---

## 🔄 آلية العمل

### 1️⃣ **مرحلة الطلب** (Product Page & Cart)
المستخدم:
- يملأ بيانات الطلب
- يختار التحويل البنكي (الخيار الوحيد الآن)
- **يرفع صورة التحويل البنكي** ✨
- ينقر "إرسال الطلب"

### 2️⃣ **معالجة الطلب** (Backend)
```
User Upload
    ↓
POST /api/bankTransfer → يحفظ صورة Base64
    ↓
التحقق + معالجة الصورة
    ↓
إرسال عبر 3 قنوات بنفس الوقت:
├─ 📧 Email (للعميل + الإدارة مع الصورة)
├─ 🤖 Telegram (للإدارة مع الصورة)
└─ 💾 LocalStorage (لعرض في Admin Dashboard)
```

### 3️⃣ **الصور أين تذهب؟**

| القناة | من يشوفها | الميزات |
|------|---------|--------|
| **📧 البريد** | العميل + الإدارة | صورة مرفقة في الإيميل + HTML جميل |
| **🤖 Telegram** | Admin Bot فقط | فوري + بدون حد أقصى للرسائل |
| **💾 Dashboard** | `https://yoursite.com/admin/transfers` | لوحة تحكم قابلة للتصفية والتحقق |

---

## 📁 الملفات الجديدة

### 1. `/api/bankTransfer/route.ts`
```typescript
POST /api/bankTransfer
Body: FormData {
  transferImage: File,
  orderId: string,
  customerName: string,
  customerEmail: string,
  phone: string,
  amount: string,
  bankName: string
}
```

### 2. `/api/sendOrder/route.ts` (محدّث)
- يدعم الآن إرسال الصور في الإيميل
- يُنشئ HTML جميل للرسالة
- يُرسل نسخة للعميل + نسخة للإدارة

### 3. `/lib/telegram-service.ts` (محدّث)
```typescript
// Telegram function for bank transfers
export const sendBankTransferOrder = async (orderData: {
  orderId: string
  productName: string
  quantity: number
  productPrice: number
  totalPrice: number
  customerData: CustomerData
  transferProofBase64: string // صورة Base64
  transferProofMime: string    // نوع الملف
}) => { ... }
```

### 4. `/app/admin/transfers/page.tsx` (جديد)
- لوحة تحكم بسيطة لعرض جميع التحويلات
- تصفية حسب: الكل / قيد المراجعة / مؤكد
- عرض صور التحويل مباشرة
- زر تأكيد التحويل

---

## 🚀 الاستخدام

### للعملاء:
```
1. يذهب إلى صفحة المنتج
2. يملأ البيانات
3. يختار "تحويل بنكي" (الخيار الوحيد)
4. يُدخل الرقم: 01012622315
5. ** يرفع صورة التحويل **
6. ينقر الزر
```

### للإدارة (أنت):

**المكان الأول: البريد الإلكتروني**
```
- تستقبل إيميل عند كل طلب
- الصورة مرفقة في الإيميل
- معلومات كاملة عن الطلب
```

**المكان الثاني: Telegram Bot**
```
- رسالة فورية في البوت
- الصورة مرفقة للرسالة
- بدون رسوم أو حدود
```

**المكان الثالث: Admin Dashboard**
```
URL: /admin/transfers
- يعرض جميع التحويلات
- صورة معاينة مباشرة
- زر تأكيد لكل طلب
- تصفية حسب الحالة
```

---

## 🔧 المتطلبات

### Environment Variables:
```env
# Email/Brevo
BREVO_SENDER_EMAIL=your-email@example.com
BREVO_SMTP_KEY=your-brevo-smtp-key
BREVO_SMTP_HOST=smtp-relay.brevo.com

# Telegram (موجود)
# TELEGRAM_BOT_TOKEN
# TELEGRAM_CHAT_ID
```

### npm packages:
```bash
npm install nodemailer
# أو
pnpm add nodemailer
```

---

## 📊 الحالات المدعومة

### عند الطلب:
```
✅ صورة واضحة من التحويل البنكي
✅ تحتوي على التاريخ والمبلغ والتأكيد
✅ تُرسل للإدارة فوراً عبر 3 قنوات
```

### تأكيد الدفع:
```
Admin يتحقق من الصورة
  ↓
في Dashboard → اضغط "تأكيد التحويل" ✅
  ↓
تُحدّث حالة الطلب
  ↓
إرسال إيميل للعميل: "تم تأكيد الدفع"
```

---

## ⚠️ ملاحظات مهمة

1. **الصور تُحفظ في:**
   - LocalStorage (للـ Admin Dashboard)
   - Base64 (في الإيميل والـ Telegram)
   - في الإيميل كـ Attachment

2. **الرقم البنكي:**
   - حالياً: `01012622315` (hardcoded)
   - يمكن تعديله في الصفحة

3. **الإيميل:**
   - يدعم HTML جميل
   - يرسل صورة مرفقة
   - ينسق تلقائياً بناءً على البيانات

4. **الـ Admin Dashboard:**
   - LocalStorage فقط (يمكن تحديثها لـ Database)
   - تحتاج الدخول من نفس المتصفح
   - ستُحذف عند حذف متصفح Cache

---

## 🔐 الأمان

```
✅ الصور تُختزن Base64 (آمنة للنقل)
✅ التحقق من نوع الملف (صور فقط)
✅ التحقق من مقاس الملف
✅ لا تُخزن في السيرفر (LocalStorage فقط)
```

---

## 📞 الدعم

الأسئلة الشائعة:
- **Q: أين تروح الصور؟**  
  A: Telegram + Email + Admin Dashboard

- **Q: هل تُحفظ في قاعدة بيانات؟**  
  A: الآن LocalStorage | يمكن إضافة Database لاحقاً

- **Q: هل يمكن تغيير الرقم البنكي؟**  
  A: نعم، في صفحة الطلب (Product Page)

- **Q: ماذا لو لم توجد صورة؟**  
  A: الزر معطّل حتى يختار صورة

---

## 🎯 التحسينات المستقبلية

- [ ] Database لحفظ الصور بشكل دائم
- [ ] API لتحميل الصور من Dashboard
- [ ] إشعارات push للعميل عند التأكيد
- [ ] تقرير شهري للمبيعات
- [ ] QR code للتحويل البنكي
- [ ] Automatic payment confirmation
