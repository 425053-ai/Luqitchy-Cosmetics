import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

interface TelegramPayload {
  type?: 'bank_transfer' | 'cart_order' | 'payment_success' | 'text_message';
  orderData?: any;
  imageData?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramPayload = await request.json();

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('❌ Missing Telegram credentials');
      return NextResponse.json(
        { success: false, error: 'Missing Telegram configuration' },
        { status: 500 }
      );
    }

    const messageType = body.type || 'text_message';

    let orderText = '';

    // Build message based on type
    if (messageType === 'text_message' && body.message) {
      orderText = body.message;
    } else if (messageType === 'bank_transfer' && body.orderData) {
      const { orderData } = body;
      orderText = `
<b>🎀 طلب جديد من Luqitchy Cosmetics</b>

<b>👤 بيانات العميل:</b>
اسم: ${orderData.customer_name}
الهاتف: ${orderData.phone}
البريد: ${orderData.customer_email}

<b>📦 تفاصيل الطلب:</b>
رقم الطلب: <code>${orderData.order_id}</code>
المنتج: ${orderData.product_name}
الكمية: ${orderData.quantity}
السعر: ${orderData.price} ج.م
الإجمالي: <b>${orderData.total_amount} ج.م</b>

<b>📍 عنوان التسليم:</b>
المحافظة: ${orderData.governorate}
المدينة: ${orderData.city}
الشارع: ${orderData.street}
${orderData.landmark ? `المعلم: ${orderData.landmark}` : ''}

<b>💳 طريقة الدفع:</b>
${orderData.payment_method}

<b>⏰ وقت الطلب:</b>
${orderData.order_date}

${orderData.notes ? `<b>📝 ملاحظات:</b>\n${orderData.notes}` : ''}
      `.trim();
    } else if (messageType === 'cart_order' && body.orderData) {
      const { orderData } = body;
      orderText = `
<b>🛒 طلب متعدد المنتجات</b>

<b>👤 بيانات العميل:</b>
اسم: ${orderData.customer_name}
الإيميل: ${orderData.customer_email}
تليفون: ${orderData.phone}

<b>📦 المنتجات:</b>
${orderData.products.map((p: any) => `• ${p.name} × ${p.quantity} = ${p.price * p.quantity} ج.م`).join('\n')}

<b>💰 الإجمالي: ${orderData.total_price} ج.م</b>

<b>📍 عنوان التسليم:</b>
المحافظة: ${orderData.governorate}
${orderData.city ? `المدينة: ${orderData.city}` : ''}
العنوان: ${orderData.street}

<b>⏰ التاريخ:</b>
${new Date().toLocaleString('ar-EG')}
      `.trim();
    } else if (messageType === 'payment_success' && body.orderData) {
      const { orderData } = body;
      orderText = `
<b>💳 دفع ناجح</b>

📱 <b>رقم المعاملة:</b> ${orderData.transactionId}
💰 <b>المبلغ:</b> ${orderData.amount} جنيه
✅ <b>الحالة:</b> مؤكد

👤 <b>العميل:</b> ${orderData.customerName}
📧 <b>البريد:</b> ${orderData.customerEmail}
📞 <b>الهاتف:</b> ${orderData.phone}

📍 <b>العنوان:</b>
${orderData.address}

📦 <b>المنتجات:</b>
${orderData.items.map((item: any) => `• ${item.name} × ${item.quantity}`).join('\n')}

📅 <b>الوقت:</b> ${new Date().toLocaleString('ar-EG')}
      `.trim();
    }

    if (!orderText) {
      return NextResponse.json(
        { success: false, error: 'Invalid message type or missing data' },
        { status: 400 }
      );
    }

    // Step 1: Send text message
    console.log('🤖 Sending Telegram message...');
    const messageResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: orderText,
          parse_mode: 'HTML',
        }),
      }
    );

    const messageData = await messageResponse.json();

    if (!messageData.ok) {
      console.error('❌ Telegram message failed:', messageData);
      return NextResponse.json(
        { success: false, error: messageData.description || 'Failed to send message' },
        { status: 400 }
      );
    }

    console.log('✅ Telegram message sent successfully');

    // Step 2: Send image if provided (for bank transfers)
    if (body.imageData && messageType === 'bank_transfer') {
      console.log('📸 Sending payment proof image...');

      const photoResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            photo: body.imageData,
            caption: '📸 إثبات الدفع (Payment Proof)',
            parse_mode: 'HTML',
          }),
        }
      );

      const photoData = await photoResponse.json();

      if (!photoData.ok) {
        console.warn('⚠️ Photo send failed, but message was sent:', photoData.description);
      } else {
        console.log('✅ Payment proof image sent to Telegram');
      }
    }

    return NextResponse.json(
      { success: true, message: 'Notification sent to Telegram' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Telegram API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
