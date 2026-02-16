import { NextRequest, NextResponse } from 'next/server';
import { saveOrderToExcel } from '@/lib/excel-service';
import { sendOrderToTelegram } from '@/lib/telegram-service';
import { Buffer } from 'buffer';

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
      const productsText = orderData.items 
        ? orderData.items.map((p: any) => `• ${p.name} × ${p.quantity} = ${p.price * p.quantity} ج.م`).join('\n')
        : orderData.products 
        ? orderData.products.map((p: any) => `• ${p.name} × ${p.quantity} = ${p.price * p.quantity} ج.م`).join('\n')
        : '(لا توجد منتجات)';
      
      orderText = `
<b>🛒 طلب متعدد المنتجات</b>

<b>👤 بيانات العميل:</b>
اسم: ${orderData.customer_name}
الإيميل: ${orderData.customer_email}
تليفون: ${orderData.customer_phone}

<b>📦 المنتجات:</b>
${productsText}

<b>💰 الإجمالي: ${orderData.total_price} ج.م</b>

<b>📍 عنوان التسليم:</b>
المحافظة: ${orderData.governorate}
${orderData.city ? `المدينة: ${orderData.city}` : ''}
العنوان: ${orderData.street_address}

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

    // Save order to Excel for bank transfers and cart orders
    if ((messageType === 'bank_transfer' || messageType === 'cart_order') && body.orderData) {
      console.log('═══════════════════════════════════════════════════');
      console.log('📊 [Order Flow] STEP 3: Saving to Excel');
      console.log(`   Order ID: ${body.orderData.order_id || 'N/A'}`);
      console.log('═══════════════════════════════════════════════════');
      try {
        if (messageType === 'bank_transfer') {
          // Single product bank transfer
          const excelResult = await saveOrderToExcel({
            order_id: body.orderData.order_id,
            product_name: body.orderData.product_name,
            quantity: body.orderData.quantity,
            price: body.orderData.price,
            total_amount: body.orderData.total_amount,
            customer_name: body.orderData.customer_name,
            phone: body.orderData.phone,
            customer_email: body.orderData.customer_email,
            governorate: body.orderData.governorate,
            city: body.orderData.city,
            street: body.orderData.street,
            landmark: body.orderData.landmark || '',
            notes: body.orderData.notes || '',
            payment_method: body.orderData.payment_method,
            order_date: body.orderData.order_date,
            status: 'معلق',
          });
          
          if (excelResult.success) {
            console.log('✅ [Order Flow] STEP 3 SUCCESS - Order saved to Excel');
          } else {
            console.warn('⚠️ [Order Flow] STEP 3 WARNING - Failed to save order:', excelResult.error);
          }
        } else if (messageType === 'cart_order' && body.orderData.products) {
          // Multiple products - save each one
          console.log(`   Saving ${body.orderData.products.length} products...`);
          
          const timestamp = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          for (const product of body.orderData.products) {
            try {
              await saveOrderToExcel({
                order_id: body.orderData.order_id,
                product_name: product.name,
                quantity: product.quantity,
                price: product.price,
                total_amount: product.price * product.quantity,
                customer_name: body.orderData.customer_name,
                phone: body.orderData.phone,
                customer_email: body.orderData.customer_email,
                governorate: body.orderData.governorate,
                city: body.orderData.city,
                street: body.orderData.street,
                landmark: body.orderData.landmark || '',
                notes: body.orderData.notes || '',
                payment_method: body.orderData.payment_method || 'Customer Delivery',
                order_date: body.orderData.order_date || timestamp,
                status: 'معلق',
              });
              console.log(`   ✓ Saved: ${product.name}`);
            } catch (productError: any) {
              console.warn(`   ✗ Failed to save ${product.name}:`, productError.message);
            }
          }
          console.log('✅ [Order Flow] STEP 3 SUCCESS - All products saved to Excel');
        }
      } catch (excelError) {
        console.error('❌ [Order Flow] STEP 3 FAILED - Excel error:', excelError);
      }
    } else {
      if (!['bank_transfer', 'cart_order'].includes(messageType)) {
        console.log('ℹ️ [Excel] Skipping Excel save - order type is not bank_transfer or cart_order:', messageType);
      }
      if (!body.orderData) {
        console.log('ℹ️ [Excel] Skipping Excel save - no orderData provided');
      }
    }
    if (body.imageData && ['bank_transfer', 'cart_order'].includes(messageType)) {
      console.log('📸 [Telegram] Sending payment proof image...');
      try {
        const imageBuffer = Buffer.from(body.imageData, 'base64');
        const mimeType = body.transferImageMime || 'image/jpeg';
        const filename = `${body.orderData?.order_id || 'transfer'}-proof.jpg`;
        // Use the new unified Telegram service
        const telegramResult = await sendOrderToTelegram(orderText, imageBuffer, mimeType, filename);
        if (!telegramResult.success) {
          console.warn('⚠️ [Telegram] Photo upload error (but message was sent):', telegramResult.error);
        } else {
          console.log('✅ [Telegram] Payment proof image sent successfully!');
        }
      } catch (photoError: any) {
        console.error('Telegram photo upload full error:', photoError);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Notification sent to Telegram and order saved to Excel' },
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

// Increase Vercel body size limit for large image uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};
