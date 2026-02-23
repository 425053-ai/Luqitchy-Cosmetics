// Telegram Bot Service for Luqitchy Cosmetics
// Bot: @luqitchy_bot
// NOTE: This file is server-only. Client-side Telegram calls should use /api/sendTelegram instead.

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8001027503:AAFINaeu8OolPc5KDeMb4743U_VD9Z-unsE';
const TELEGRAM_CHAT_ID_MO = '1182455822';
const TELEGRAM_CHAT_IDS = [
  process.env.TELEGRAM_CHAT_ID || '1143952317',
  TELEGRAM_CHAT_ID_MO,
];

// Verify tokens on startup
if (typeof window === 'undefined') {
  console.log('🤖 Telegram Service Initialized:');
  console.log('- Bot Token:', TELEGRAM_BOT_TOKEN ? '✓ Configured' : '✗ Missing');
  console.log('- Chat ID:', TELEGRAM_CHAT_IDS ? '✓ Configured' : '✗ Missing');
}

interface TelegramResponse {
  success: boolean;
  data?: any;
  error?: any;
}

// دالة إرسال رسالة بسيطة
export const sendTelegramMessage = async (message: string): Promise<TelegramResponse> => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  let allSuccess = true;
  let results: any[] = [];
  for (const chatId of TELEGRAM_CHAT_IDS) {
    try {
      console.log(`📤 Sending Telegram message to chat_id: ${chatId}...`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });
      const data = await response.json();
      results.push({ chatId, data });
      if (data.ok) {
        console.log(`✅ تم إرسال الرسالة بنجاح إلى ${chatId}`);
      } else {
        allSuccess = false;
        console.error(`❌ Telegram Error for chat_id ${chatId}:`, data.description || 'Unknown error');
        console.error('Error Code:', data.error_code);
      }
    } catch (error: any) {
      allSuccess = false;
      console.error(`❌ Telegram Connection Error for chat_id ${chatId}:`, error.message);
      results.push({ chatId, error });
    }
  }
  return { success: allSuccess, data: results };
};

/**
 * Send a photo to Telegram using multipart/form-data (Node.js)
 * @param imageBuffer Buffer of the image
 * @param mimeType Image MIME type (e.g. 'image/jpeg')
 * @param caption Caption text
 * @param filename Optional filename
 * @returns TelegramResponse
 */
export const sendPhotoToTelegram = async (
  imageBuffer: Buffer,
  mimeType: string,
  caption: string,
  filename = 'payment-proof.jpg'
): Promise<TelegramResponse> => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  try {
    console.log(`📸 [Telegram] Uploading photo: ${filename} (${imageBuffer.length} bytes, ${mimeType})`);
    const blob = new Blob([imageBuffer], { type: mimeType });
    const form = new FormData();
    form.append('caption', caption.substring(0, 1024)); // Telegram caption limit
    form.append('parse_mode', 'HTML');
    form.append('photo', blob, filename);
    // Send the photo to all chat IDs
    let allSuccess = true;
    let results: any[] = [];
    for (const chatId of TELEGRAM_CHAT_IDS) {
      form.set('chat_id', chatId);
      const response = await fetch(url, {
        method: 'POST',
        body: form,
      });
      const responseText = await response.text();
      console.log('📬 [Telegram] Photo API response status:', response.status, 'for chat_id:', chatId);
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        console.error('❌ [Telegram] Non-JSON response:', responseText.substring(0, 500));
        allSuccess = false;
        results.push({ chatId, error: `Non-JSON response: ${responseText.substring(0, 200)}` });
        continue;
      }
      if (data.ok) {
        console.log(`✅ [Telegram] Photo sent successfully to ${chatId}!`);
        results.push({ chatId, data });
      } else {
        allSuccess = false;
        console.error(`❌ [Telegram] Photo upload error for chat_id ${chatId}:`, data.description || 'Unknown error');
        console.error('   Error Code:', data.error_code);
        results.push({ chatId, error: data });
      }
    }
    if (allSuccess) {
      return { success: true, data: results };
    } else {
      return { success: false, error: results };
    }
  } catch (error: any) {
    console.error('Telegram photo upload full error:', error);
    return { success: false, error: error.message || error };
  }
};

/**
 * Unified function to send order message and optional payment proof image to Telegram
 * @param message Text message (order details)
 * @param imageBuffer Optional Buffer of payment proof image
 * @param mimeType Optional image MIME type
 * @param filename Optional image filename
 * @returns TelegramResponse
 */
export const sendOrderToTelegram = async (
  message: string,
  imageBuffer?: Buffer,
  mimeType?: string,
  filename?: string
): Promise<TelegramResponse> => {
  // Always send the message first
  const textResult = await sendTelegramMessage(message);
  let photoResult: TelegramResponse | undefined = undefined;
  if (imageBuffer && mimeType) {
    photoResult = await sendPhotoToTelegram(imageBuffer, mimeType, message, filename);
    if (!photoResult.success) {
      // Log but do not break order flow
      console.error('⚠️ [Telegram] Photo upload failed, but order message sent. Error:', photoResult.error);
    }
  }
  return {
    success: textResult.success && (photoResult ? photoResult.success : true),
    data: { text: textResult.data, photo: photoResult?.data },
    error: textResult.error || photoResult?.error,
  };
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

  // Special message for the limited offer product
  let message = '';
  if (orderData.productName.includes('Lipglosses') && orderData.productName.includes('Lotion Sample')) {
    message = `
🎉 <b>LIMITED TIME OFFER ORDER!</b>
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
<b>💄 OFFER PRODUCT:</b>
• 3 Lipglosses (Burgundy, Mocha, Strawberry milk)
• Lotion Sample 5g (FREE)
• الكمية: ${orderData.quantity}
• السعر: ${orderData.productPrice} جنيه
━━━━━━━━━━━━━━━━━━━━
💰 <b>الإجمالي:</b> ${orderData.totalPrice} جنيه
💳 <b>طريقة الدفع:</b> ${paymentMethodText}
📝 <b>ملاحظات:</b> ${customerData.notes || 'لا توجد ملاحظات'}
📅 <b>التاريخ:</b> ${new Date().toLocaleString('ar-EG')}
    `.trim();
  } else {
    message = `
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
  }
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

  // Send text message first, then photo
  const textResult = await sendTelegramMessage(message);
  const imageBuffer = Buffer.from(orderData.transferProofBase64, 'base64');
  const photoResult = await sendPhotoToTelegram(imageBuffer, orderData.transferProofMime, `📸 إثبات الدفع - ${orderData.orderId}`, `${orderData.orderId}-proof.jpg`);
  if (!photoResult.success) {
    console.error('⚠️ [Telegram] Photo upload failed for bank transfer, but text was sent:', photoResult.error);
  }
  return {
    success: textResult.success,
    data: { text: textResult.data, photo: photoResult?.data },
    error: textResult.error || photoResult?.error,
  };
};


