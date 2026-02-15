'use server';

// Telegram Bot Service for Luqitchy Cosmetics
// Bot: @luqitchy_bot
// NOTE: This file is now server-only. Client-side Telegram calls should use /api/sendTelegram instead.

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8001027503:AAFINaeu8OolPc5KDeMb4743U_VD9Z-unsE';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1143952317';

// Verify tokens on startup
if (typeof window === 'undefined') {
  console.log('🤖 Telegram Service Initialized:');
  console.log('- Bot Token:', TELEGRAM_BOT_TOKEN ? '✓ Configured' : '✗ Missing');
  console.log('- Chat ID:', TELEGRAM_CHAT_ID ? '✓ Configured' : '✗ Missing');
}

interface TelegramResponse {
  success: boolean;
  data?: any;
  error?: any;
}

// دالة إرسال رسالة بسيطة
export const sendTelegramMessage = async (message: string): Promise<TelegramResponse> => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    console.log('📤 Sending Telegram message...');
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
      return { success: true, data }
    } else {
      console.error('❌ Telegram Error:', data.description || 'Unknown error');
      console.error('Error Code:', data.error_code);
      console.error('Bot Token Status:', TELEGRAM_BOT_TOKEN ? '✓ Set' : '✗ Missing');
      console.error('Chat ID Status:', TELEGRAM_CHAT_ID ? '✓ Set' : '✗ Missing');
      return { success: false, error: data }
    }
  } catch (error: any) {
    console.error('❌ Telegram Connection Error:', error.message);
    return { success: false, error }
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

// دالة إرسال صورة التحويل البنكي
export const sendBankTransferProof = async (imageBase64: string, mimeType: string, caption: string): Promise<TelegramResponse> => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

  try {
    console.log('📸 Sending bank transfer proof image to Telegram...');
    
    // Send message first with details in caption
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        photo: `data:${mimeType};base64,${imageBase64}`,
        caption: caption,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    
    if (data.ok) {
      console.log('✅ Bank transfer proof sent successfully to Telegram');
      return { success: true, data };
    } else {
      console.error('❌ Telegram Photo Error:', data.description || 'Unknown error');
      console.error('Error Code:', data.error_code);
      console.error('Response:', data);
      
      // If photo data URI doesn't work, try sending as caption only
      console.log('⚠️ Retrying with caption only...');
      const fallbackResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `📸 <b>Payment Proof Image Received</b>\n\n${caption}\n\n⚠️ Image could not be sent directly, but order details are logged.`,
          parse_mode: 'HTML',
        }),
      });
      
      const fallbackData = await fallbackResponse.json();
      return fallbackData.ok ? { success: true, data: fallbackData } : { success: false, error: data };
    }
  } catch (error: any) {
    console.error('❌ Bank Transfer Proof Send Error:', error.message);
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
  paymentMethod?: string;
  billReference?: string;
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

// Format payment method with all options
const formatPaymentMethod = (method?: string, billReference?: string): string => {
  let text = '';
  switch(method) {
    case 'vodafone':
      text = '📱 Vodafone Cash (فودافون كاش)';
      break;
    case 'visa':
      text = '💳 Visa/MasterCard (بطاقة ائتمان)';
      break;
    case 'paypal':
      text = '🅿️ PayPal (باي بال)';
      break;
    case 'cashcollection':
      text = '🏪 Aman/Masary (أمان/مصاري)';
      if (billReference) text += `\n   📄 Bill Reference: ${billReference}`;
      break;
    case 'kiosk':
      text = '🎫 Fawry/Kiosk (فوري)';
      if (billReference) text += `\n   📄 Bill Reference: ${billReference}`;
      break;
    default:
      text = '💵 Cash on Delivery (الدفع عند الاستلام)';
  }
  return text;
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
  
  // Format payment method with all options
  const paymentMethodText = formatPaymentMethod(customerData.paymentMethod, customerData.billReference);
  
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

💳 <b>طريقة الدفع:</b> ${paymentMethodText}

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

  // Format payment method with all options
  const paymentMethodText = formatPaymentMethod(customerData.paymentMethod, customerData.billReference);

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

💳 <b>طريقة الدفع:</b> ${paymentMethodText}

📝 <b>ملاحظات:</b> ${customerData.notes || 'لا توجد ملاحظات'}

📅 <b>التاريخ:</b> ${new Date().toLocaleString('ar-EG')}
  `.trim();

  return await sendTelegramMessage(message);
};

// Bank Transfer Order - with proof image
export const sendBankTransferOrder = async (orderData: {
  orderId: string;
  productName: string;
  quantity: number;
  productPrice: number;
  totalPrice: number;
  customerData: CustomerData;
  transferProofBase64: string;
  transferProofMime: string;
}): Promise<TelegramResponse> => {
  const { customerData } = orderData;
  const fullAddress = formatAddress(customerData);
  
  const message = `
🏦 <b>تحويل بنكي - طلب جديد #${orderData.orderId}</b>

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

💳 <b>طريقة الدفع:</b> 🏦 تحويل بنكي (أوضة التحويل في الصورة)

📝 <b>ملاحظات:</b> ${customerData.notes || 'لا توجد ملاحظات'}

📅 <b>التاريخ:</b> ${new Date().toLocaleString('ar-EG')}

⚠️ <b>الحالة:</b> في انتظار التحقق من التحويل
  `.trim();

  return await sendBankTransferProof(orderData.transferProofBase64, orderData.transferProofMime, message);
};

// Export default للاستخدام السهل
export default {
  sendTelegramMessage,
  sendSingleProductOrder,
  sendCartOrderToTelegram,
  sendPhotoToTelegram,
};
