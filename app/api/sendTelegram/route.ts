import { NextRequest, NextResponse } from 'next/server';
import { saveOrderToExcel } from '@/lib/excel-service';
import { Buffer } from 'buffer';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

interface TelegramPayload {
  type?: 'bank_transfer' | 'cart_order' | 'payment_success' | 'text_message';
  orderData?: any;
  imageData?: string;
  transferImageMime?: string;
  message?: string;
}

  export async function POST(request: NextRequest) {
    try {
      const body: TelegramPayload = await request.json();
      const messageType = body.type || 'text_message';
      let orderText = '';

    // Build message based on type
    if (messageType === 'text_message' && body.message) {
      orderText = body.message;
    } else if (messageType === 'bank_transfer' && body.orderData) {
      const { orderData } = body;
      orderText = `<b>New Order from Luqitchy Cosmetics</b>\n\n<b>Customer Info:</b>\nName: ${orderData.customer_name}\nPhone: ${orderData.phone}\nEmail: ${orderData.customer_email}\n\n<b>Order Details:</b>\nOrder ID: <code>${orderData.order_id}</code>\nProduct: ${orderData.product_name}\nQuantity: ${orderData.quantity}\n\n<b>Subtotal:</b> ${orderData.price * orderData.quantity} EGP\n<b>Shipping (all Egypt):</b> +70 EGP\n<b>Order Total:</b> <b>${orderData.price * orderData.quantity + 70} EGP</b>\n\n<b>Delivery Address:</b>\nGovernorate: ${orderData.governorate}\nCity: ${orderData.city}\nStreet: ${orderData.street}\n${orderData.landmark ? `Landmark: ${orderData.landmark}` : ''}\n\n<b>Payment Method:</b> ${orderData.payment_method || ''}\n${orderData.notes ? `<b>Notes:</b> ${orderData.notes}` : ''}`;
    } else if (messageType === 'cart_order' && body.orderData) {
      const { orderData } = body;
      const productsText = (orderData.items || orderData.products || []).map((p: any) => `• ${p.name} × ${p.quantity} = ${p.price * p.quantity} EGP`).join('\\n');
      const subtotal = (orderData.items || orderData.products || []).reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0);
      orderText = `<b>🛒 New Cart Order</b>\n\n<b>Customer Info:</b>\nName: ${orderData.customer_name}\nEmail: ${orderData.customer_email}\nPhone: ${orderData.customer_phone}\n\n<b>Products:</b>\n${productsText}\n\n<b>Subtotal:</b> ${subtotal} EGP\n<b>Shipping (all Egypt):</b> +70 EGP\n<b>Order Total:</b> <b>${subtotal + 70} EGP</b>\n\n<b>Delivery Address:</b>\nGovernorate: ${orderData.governorate}\n${orderData.city ? `City: ${orderData.city}` : ''}\nStreet: ${orderData.street_address}`;
    }

    if (!orderText) {
      return NextResponse.json(
        { success: false, error: 'Invalid message type or missing data' },
        { status: 400 }
      );
    }

    // ✅ LOG 3: Log the message to be sent
    console.log('📝 [Telegram] Message preview (first 200 chars):');
    console.log('  ' + orderText.substring(0, 200) + '...');

    // Step 1: Send text message
   orderText = `
    console.log('🤖 [Telegram] Sending message to Telegram API...');
   orderText = `
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
             // ...existing code...
                order_date: body.orderData.order_date || timestamp,
                status: 'معلق',
              });
              console.log(`   Saved: ${product.name}`);
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
        // Strip data URI prefix (e.g., "data:image/jpeg;base64,") if present
        let rawBase64 = body.imageData;
        if (rawBase64.includes(',')) {
          rawBase64 = rawBase64.split(',')[1];
        }
        const imageBuffer = Buffer.from(rawBase64, 'base64');
        const mimeType = body.transferImageMime || 'image/jpeg';
        const filename = `${body.orderData?.order_id || 'transfer'}-proof.jpg`;
        const caption = `📸 إثبات الدفع - ${body.orderData?.order_id || 'Order'}`;
        // Use sendPhotoToTelegram (not sendOrderToTelegram to avoid duplicate message)
        const { sendPhotoToTelegram } = await import('@/lib/telegram-service');
        const telegramResult = await sendPhotoToTelegram(imageBuffer, mimeType, caption, filename);
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

// Next.js 14+ App Router: use segment config
export const runtime = 'nodejs';
export const maxDuration = 20;
