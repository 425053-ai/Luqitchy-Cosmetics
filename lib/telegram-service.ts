// Telegram Bot Service for Luqitchy Cosmetics
// Bot: @luqitchy_bot

const TELEGRAM_BOT_TOKEN = '8001027503:AAFYe8uyZ9IageMf0TgmwAxFZ7qhE4NbxXg';
const TELEGRAM_CHAT_ID = '1143952317';

interface TelegramResponse {
  success: boolean;
  data?: any;
  error?: any;
}

// دالة إرسال رسالة بسيطة
export const sendTelegramMessage = async (message: string): Promise<TelegramResponse> => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      console.log('✅ تم إرسال الرسالة بنجاح');
      return { success: true, data };
    } else {
      console.error('❌ فشل الإرسال:', data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error);
    return { success: false, error };
  }
};

// دالة إرسال صورة مع الطلب
export const sendPhotoToTelegram = async (photoUrl: string, caption: string): Promise<TelegramResponse> => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        photo: photoUrl,
        caption: caption,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    return data.ok ? { success: true, data } : { success: false, error: data };
  } catch (error) {
    return { success: false, error };
  }
};

// واجهة بيانات المنتج
interface OrderProduct {
  name: string;
  quantity: number;
  price: number;
}

// Customer Data Interface
interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  governorate: string;
  city: string;
  streetAddress: string;
  landmark: string;
  notes?: string;
}

// Order Data Interface
interface OrderData {
  customerData: CustomerData;
  products: OrderProduct[];
  totalPrice: number;
  orderNumber: string;
}

// Format full address
const formatAddress = (data: CustomerData): string => {
  const parts = [
    data.streetAddress,
    data.landmark ? `(${data.landmark})` : '',
    data.city,
    data.governorate
  ].filter(Boolean);
  return parts.join(', ');
};

// Single Product Order
export const sendSingleProductOrder = async (orderData: {
  orderId: string;
  productName: string;
  quantity: number;
  productPrice: number;
  totalPrice: number;
  customerData: CustomerData;
}): Promise<TelegramResponse> => {
  const { customerData } = orderData;
  const fullAddress = formatAddress(customerData);
  
  const message = `
🛒 <b>طلب جديد #${orderData.orderId}</b>

━━━━━━━━━━━━━━━━━━━━

👤 <b>بيانات العميل:</b>
• الاسم: ${customerData.fullName}
• الإيميل: ${customerData.email}
• تليفون: ${customerData.phone}
• واتساب: ${customerData.whatsapp}

📍 <b>العنوان:</b>
• المحافظة: ${customerData.governorate}
• المدينة: ${customerData.city}
• الشارع: ${customerData.streetAddress}
${customerData.landmark ? `• علامة مميزة: ${customerData.landmark}` : ''}

━━━━━━━━━━━━━━━━━━━━

📦 <b>المنتج:</b>
• ${orderData.productName}
• الكمية: ${orderData.quantity}
• السعر: ${orderData.productPrice} جنيه

━━━━━━━━━━━━━━━━━━━━

💰 <b>الإجمالي:</b> ${orderData.totalPrice} جنيه

📝 <b>ملاحظات:</b> ${customerData.notes || 'لا توجد ملاحظات'}

📅 <b>التاريخ:</b> ${new Date().toLocaleString('ar-EG')}
  `.trim();

  return await sendTelegramMessage(message);
};

// Cart Order (Multiple Products)
export const sendCartOrderToTelegram = async (orderData: OrderData): Promise<TelegramResponse> => {
  const { customerData, products, totalPrice, orderNumber } = orderData;

  // Format products list
  const productsList = products
    .map((p, i) => `${i + 1}. ${p.name}\n   الكمية: ${p.quantity} | السعر: ${p.price * p.quantity} جنيه`)
    .join('\n\n');

  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  const message = `
🛍️ <b>طلب جديد من السلة #${orderNumber}</b>

━━━━━━━━━━━━━━━━━━━━

👤 <b>بيانات العميل:</b>
• الاسم: ${customerData.fullName}
• الإيميل: ${customerData.email}
• تليفون: ${customerData.phone}
• واتساب: ${customerData.whatsapp}

📍 <b>العنوان:</b>
• المحافظة: ${customerData.governorate}
• المدينة: ${customerData.city}
• الشارع: ${customerData.streetAddress}
${customerData.landmark ? `• علامة مميزة: ${customerData.landmark}` : ''}

━━━━━━━━━━━━━━━━━━━━

📦 <b>المنتجات (${totalQuantity} قطعة):</b>

${productsList}

━━━━━━━━━━━━━━━━━━━━

💰 <b>الإجمالي:</b> ${totalPrice} جنيه

📝 <b>ملاحظات:</b> ${customerData.notes || 'لا توجد ملاحظات'}

📅 <b>التاريخ:</b> ${new Date().toLocaleString('ar-EG')}
  `.trim();

  return await sendTelegramMessage(message);
};

// Export default للاستخدام السهل
export default {
  sendTelegramMessage,
  sendSingleProductOrder,
  sendCartOrderToTelegram,
  sendPhotoToTelegram,
};
