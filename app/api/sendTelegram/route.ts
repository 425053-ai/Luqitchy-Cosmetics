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

    // ✅ LOG 1: Check environment variables
    console.log('🔧 [Telegram] Environment Variables Check:');
    console.log('  - TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN ? '✓ Set (' + TELEGRAM_BOT_TOKEN.substring(0, 15) + '...)' : '✗ MISSING');
    console.log('  - TELEGRAM_CHAT_ID:', TELEGRAM_CHAT_ID ? '✓ Set (' + TELEGRAM_CHAT_ID + ')' : '✗ MISSING');

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('❌ [Telegram] Missing Telegram credentials - cannot send notification');
      return NextResponse.json(
        { success: false, error: 'Missing Telegram configuration' },
        { status: 500 }
      );
    }

    // ✅ LOG 2: Log incoming request
    console.log('📥 [Telegram] Received request with type:', body.type || 'text_message');
    console.log('📥 [Telegram] Request body keys:', Object.keys(body));

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
      console.warn('⚠️ [Telegram] Invalid message type or missing data - type:', messageType);
      return NextResponse.json(
        { success: false, error: 'Invalid message type or missing data' },
        { status: 400 }
      );
    }

    // ✅ LOG 3: Log the message to be sent
    console.log('📝 [Telegram] Message preview (first 200 chars):');
    console.log('  ' + orderText.substring(0, 200) + '...');

    // Step 1: Send text message
    console.log('🤖 [Telegram] Sending message to Telegram API...');
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    console.log('   URL:', telegramUrl.substring(0, 50) + '...');

    const messageResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: orderText,
        parse_mode: 'HTML',
      }),
    });

    const messageData = await messageResponse.json();

    // ✅ LOG 4: Log Telegram API response
    console.log('📬 [Telegram] API Response received:');
    console.log('  - HTTP Status:', messageResponse.status);
    console.log('  - ok flag:', messageData.ok);
    console.log('  - Error Code:', messageData.error_code || 'None');
    console.log('  - Description:', messageData.description || messageData.error_description || 'None');

    if (!messageData.ok) {
      console.error('❌ [Telegram] Message failed to send');
      console.error('  - Full response:', JSON.stringify(messageData, null, 2));
      return NextResponse.json(
        { success: false, error: messageData.description || 'Failed to send message', details: messageData },
        { status: 400 }
      );
    }

    console.log('✅ [Telegram] Message sent successfully! Message ID:', messageData.result?.message_id);

    // Step 2: Send image if provided (for bank transfers)
    if (body.imageData && messageType === 'bank_transfer') {
      console.log('📸 [Telegram] Sending payment proof image...');

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

      // ✅ LOG 5: Log photo response
      console.log('📷 [Telegram] Photo Response:');
      console.log('  - ok flag:', photoData.ok);
      console.log('  - Message ID:', photoData.result?.message_id || 'N/A');

      if (!photoData.ok) {
        console.warn('⚠️ [Telegram] Photo send failed, but message was sent. Error:', photoData.description);
      } else {
        console.log('✅ [Telegram] Payment proof image sent successfully');
      }
    }

    return NextResponse.json(
      { success: true, message: 'Notification sent to Telegram' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [Telegram] Exception thrown:', error.name);
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
