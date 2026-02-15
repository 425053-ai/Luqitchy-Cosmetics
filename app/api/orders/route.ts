import { NextRequest, NextResponse } from 'next/server';
import { saveOrderToExcel, saveBulkOrderToExcel } from '@/lib/excel-service';

interface OrderProduct {
  name: string;
  quantity: number;
  price: number;
  total?: number;
}

interface UnifiedOrderRequest {
  // Order type and IDs
  order_id: string;
  order_date: string;
  order_type: 'single_product' | 'cart'; // Differentiator

  // Customer information
  customer_name: string;
  customer_email: string;
  phone: string;
  whatsapp?: string;

  // Products
  products: OrderProduct[];
  total_amount: number;

  // Delivery address
  governorate: string;
  city: string;
  street: string;
  landmark?: string;
  notes?: string;

  // Payment
  payment_method: string;
  
  // Optional payment proof image (base64)
  imageData?: string;
  transferImageMime?: string;
}

interface SendOrderRequest {
  customer_name: string;
  customer_email: string;
  phone: string;
  whatsapp: string;
  order_id: string;
  order_date: string;
  products: OrderProduct[];
  total_amount: number;
  governorate: string;
  city: string;
  street: string;
  landmark?: string;
  notes?: string;
  payment_method: string;
}

interface TelegramPayload {
  type: 'bank_transfer' | 'cart_order' | 'payment_success' | 'text_message';
  orderData: any;
  imageData?: string;
  transferImageMime?: string;
}

function generateProductsTable(products: OrderProduct[]): string {
  return products
    .map(
      (product) => `
        <tr style="border: 1px solid #ff66b2;">
          <td style="padding: 8px; border: 1px solid #ff66b2;">${product.name}</td>
          <td style="padding: 8px; border: 1px solid #ff66b2; text-align: center;">${product.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ff66b2; text-align: center;">${product.price}</td>
          <td style="padding: 8px; border: 1px solid #ff66b2; text-align: center;">${product.price * product.quantity}</td>
        </tr>
      `
    )
    .join('');
}

function generateEmailHTML(data: SendOrderRequest, productsTable: string): string {
  return `
    <!DOCTYPE html>
    <html dir="ltr" lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; background-color: #ffe6f0; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #fff0f5; padding: 30px; border-radius: 15px; border: 2px solid #ff66b2; }
        .header { background: linear-gradient(135deg, #ff66b2 0%, #ff88d0 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 28px; }
        .section { margin-bottom: 20px; padding: 15px; background-color: #fff; border-left: 4px solid #ff66b2; }
        .section h2 { color: #ff66b2; margin-top: 0; font-size: 16px; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; padding-bottom: 8px; border-bottom: 1px solid #ffe0ec; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background-color: #ffb6c1; padding: 10px; text-align: left; color: #333; border: 1px solid #ff66b2; }
        td { padding: 10px; border: 1px solid #ff66b2; }
        .total { font-size: 20px; font-weight: bold; color: #ff66b2; text-align: right; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #ffe0ec; padding-top: 15px; }
        .address-box { background-color: #fff; padding: 12px; border-radius: 8px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Order Confirmation</h1>
          <p style="margin: 10px 0 0 0;">Thank you for your purchase!</p>
        </div>

        <div class="section">
          <h2>📋 Order Details</h2>
          <div class="info-row">
            <span class="info-label">Order ID:</span>
            <span class="info-value"><strong>${data.order_id}</strong></span>
          </div>
          <div class="info-row">
            <span class="info-label">Order Date:</span>
            <span class="info-value">${data.order_date}</span>
          </div>
        </div>

        <div class="section">
          <h2>👤 Customer Information</h2>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">${data.customer_name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${data.customer_email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">${data.phone}</span>
          </div>
          ${data.whatsapp ? `<div class="info-row">
            <span class="info-label">WhatsApp:</span>
            <span class="info-value">${data.whatsapp}</span>
          </div>` : ''}
        </div>

        <div class="section">
          <h2>📦 Products</h2>
          <table>
            <thead>
              <tr style="background-color: #ffb6c1;">
                <th style="padding: 10px; border: 1px solid #ff66b2;">Product</th>
                <th style="padding: 10px; border: 1px solid #ff66b2; text-align: center;">Qty</th>
                <th style="padding: 10px; border: 1px solid #ff66b2; text-align: center;">Price</th>
                <th style="padding: 10px; border: 1px solid #ff66b2; text-align: center;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${productsTable}
              <tr style="background-color: #fff0f5; font-weight: bold;">
                <td colspan="3" style="padding: 10px; border: 1px solid #ff66b2; text-align: right;">TOTAL:</td>
                <td style="padding: 10px; border: 1px solid #ff66b2; text-align: center;">${data.total_amount} EGP</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>📍 Delivery Address</h2>
          <div class="address-box">
            <div class="info-row" style="border: none;">
              <span class="info-label">Governorate:</span>
              <span class="info-value">${data.governorate}</span>
            </div>
            <div class="info-row" style="border: none;">
              <span class="info-label">City:</span>
              <span class="info-value">${data.city}</span>
            </div>
            <div class="info-row" style="border: none;">
              <span class="info-label">Street:</span>
              <span class="info-value">${data.street}</span>
            </div>
            ${data.landmark ? `<div class="info-row" style="border: none;">
              <span class="info-label">Landmark:</span>
              <span class="info-value">${data.landmark}</span>
            </div>` : ''}
            ${data.notes ? `<div class="info-row" style="border: none;">
              <span class="info-label">Notes:</span>
              <span class="info-value">${data.notes}</span>
            </div>` : ''}
          </div>
        </div>

        <div class="section">
          <h2>💳 Payment Method</h2>
          <div class="info-row">
            <span class="info-label">Method:</span>
            <span class="info-value">${data.payment_method}</span>
          </div>
        </div>

        <div class="section">
          <h3 style="color: #2db67a; margin-top: 0;">✅ What's Next?</h3>
          <ul style="color: #333; padding-left: 20px;">
            <li>Our team will contact you within 24-48 hours to confirm delivery</li>
            <li>You'll receive a tracking update</li>
            <li>Stay tuned for your order!</li>
          </ul>
        </div>

        <div class="footer">
          <p>Need help? Contact us on WhatsApp: <strong>+201012622315</strong></p>
          <p>Email: <strong>luqitchycosmetics@gmail.com</strong></p>
          <p style="margin-top: 15px; border-top: 1px solid #ffe0ec; padding-top: 15px;">
            © 2026 Luqitchy Cosmetics. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendEmailNotification(data: SendOrderRequest): Promise<{ success: boolean; error?: string }> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.error('❌ [Email] BREVO_API_KEY environment variable is not set');
    return { success: false, error: 'Email service not configured' };
  }

  const trimmedKey = brevoApiKey.trim();
  const productsTable = generateProductsTable(data.products);
  const emailHTML = generateEmailHTML(data, productsTable);

  console.log(`📧 [Email] Sending to ${data.customer_email} for order ${data.order_id}`);

  try {
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': trimmedKey,
      },
      body: JSON.stringify({
        to: [
          {
            email: data.customer_email,
            name: data.customer_name,
          }
        ],
        sender: {
          email: process.env.BREVO_SENDER_EMAIL || 'luqitchycosmetics@gmail.com',
          name: process.env.BREVO_SENDER_NAME || 'Luqitchy Cosmetics 💖',
        },
        subject: `Order Confirmation - ${data.order_id}`,
        htmlContent: emailHTML,
        replyTo: {
          email: 'luqitchycosmetics@gmail.com',
          name: 'Luqitchy Cosmetics Support',
        },
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json();
      console.error('❌ [Email] Brevo API Error:', errorData);
      return { success: false, error: `Brevo API error: ${JSON.stringify(errorData)}` };
    }

    const responseData = await brevoResponse.json();
    console.log('✅ [Email] Email sent successfully!');
    return { success: true };
  } catch (error: any) {
    console.error('❌ [Email] Error sending email:', error.message);
    return { success: false, error: error.message };
  }
}

async function sendTelegramNotification(telegramPayload: TelegramPayload): Promise<{ success: boolean; error?: string }> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ [Telegram] Missing Telegram credentials');
    return { success: false, error: 'Missing Telegram configuration' };
  }

  try {
    // Send text message
    const messageResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramPayload.message || '',
          parse_mode: 'HTML',
        }),
      }
    );

    const messageData = await messageResponse.json();

    if (!messageData.ok) {
      console.error('❌ [Telegram] Message failed:', messageData.description);
      return { success: false, error: messageData.description };
    }

    console.log('✅ [Telegram] Message sent successfully!');

    // Send image if provided
    if (telegramPayload.imageData && ['bank_transfer', 'cart_order'].includes(telegramPayload.type)) {
      console.log('📸 [Telegram] Sending payment proof image...');
      try {
        const buffer = Buffer.from(telegramPayload.imageData, 'base64');
        const mimeType = telegramPayload.transferImageMime || 'image/jpeg';

        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);

        const blob = new Blob([buffer], { type: mimeType });
        formData.append('photo', blob, `${telegramPayload.orderData?.order_id || 'transfer'}-proof.jpg`);
        formData.append('caption', `📸 إثبات الدفع - ${telegramPayload.orderData?.order_id || 'Order'}`);
        formData.append('parse_mode', 'HTML');

        const photoResponse = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const photoData = await photoResponse.json();

        if (!photoData.ok) {
          console.warn('⚠️ [Telegram] Photo send failed:', photoData.description);
        } else {
          console.log('✅ [Telegram] Payment proof image sent successfully!');
        }
      } catch (photoError: any) {
        console.warn('⚠️ [Telegram] Photo upload error:', photoError.message);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('❌ [Telegram] Error sending notification:', error.message);
    return { success: false, error: error.message };
  }
}

async function saveToExcel(orderType: string, orderData: any, products: OrderProduct[]): Promise<{ success: boolean; error?: string }> {
  try {
    if (orderType === 'single_product') {
      const excelOrderData = {
        order_id: orderData.order_id,
        product_name: products[0]?.name || 'Product',
        quantity: products[0]?.quantity || 1,
        price: products[0]?.price || 0,
        total_amount: orderData.total_amount,
        customer_name: orderData.customer_name,
        phone: orderData.phone,
        customer_email: orderData.customer_email,
        governorate: orderData.governorate,
        city: orderData.city,
        street: orderData.street,
        landmark: orderData.landmark || '',
        notes: orderData.notes || '',
        payment_method: orderData.payment_method,
        order_date: orderData.order_date,
        status: 'Pending',
      };

      const result = await saveOrderToExcel(excelOrderData);
      if (result.success) {
        console.log('✅ [Excel] Single product order saved');
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } else if (orderType === 'cart') {
      const excelOrderData = {
        order_id: orderData.order_id,
        customer_name: orderData.customer_name,
        phone: orderData.phone,
        customer_email: orderData.customer_email,
        governorate: orderData.governorate,
        city: orderData.city,
        street: orderData.street,
        landmark: orderData.landmark || '',
        notes: orderData.notes || '',
        payment_method: orderData.payment_method,
        order_date: orderData.order_date,
        products: products,
        total_amount: orderData.total_amount,
        status: 'Pending',
      };

      const result = await saveBulkOrderToExcel(excelOrderData);
      if (result.success) {
        console.log('✅ [Excel] Cart order saved');
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    }

    return { success: false, error: 'Unknown order type' };
  } catch (error: any) {
    console.error('❌ [Excel] Error saving order:', error.message);
    return { success: false, error: error.message };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: UnifiedOrderRequest = await request.json();

    const {
      order_id,
      order_date,
      order_type,
      customer_name,
      customer_email,
      phone,
      whatsapp,
      products,
      total_amount,
      governorate,
      city,
      street,
      landmark,
      notes,
      payment_method,
      imageData,
      transferImageMime,
    } = body;

    console.log('═══════════════════════════════════════════════════');
    console.log('[Order Processing] New order received');
    console.log(`   Type: ${order_type}`);
    console.log(`   Order ID: ${order_id}`);
    console.log(`   Products: ${products.length}`);
    console.log('═══════════════════════════════════════════════════');

    // Validate required fields
    if (!order_id || !order_type || !customer_name || !customer_email || !products || !total_amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // STEP 1: Send email notification
    console.log('📧 [Order Flow] STEP 1: Sending email notification...');
    const emailResult = await sendEmailNotification({
      customer_name,
      customer_email,
      phone,
      whatsapp: whatsapp || phone,
      order_id,
      order_date,
      products,
      total_amount,
      governorate,
      city,
      street,
      landmark,
      notes,
      payment_method,
    });

    if (!emailResult.success) {
      console.warn('⚠️ [Email] Failed but continuing with order processing');
    }

    // STEP 2: Send Telegram notification with image
    console.log('🤖 [Order Flow] STEP 2: Sending Telegram notification...');
    
    let telescopeMessage = '';
    if (order_type === 'single_product') {
      const product = products[0];
      telescopeMessage = `
<b>🎀 طلب جديد من Luqitchy Cosmetics</b>

<b>👤 بيانات العميل:</b>
اسم: ${customer_name}
الهاتف: ${phone}
البريد: ${customer_email}

<b>📦 تفاصيل الطلب:</b>
رقم الطلب: <code>${order_id}</code>
المنتج: ${product.name}
الكمية: ${product.quantity}
السعر: ${product.price} ج.م
الإجمالي: <b>${total_amount} ج.م</b>

<b>📍 عنوان التسليم:</b>
المحافظة: ${governorate}
المدينة: ${city}
الشارع: ${street}
${landmark ? `المعلم: ${landmark}` : ''}

<b>💳 طريقة الدفع:</b>
${payment_method}

<b>⏰ وقت الطلب:</b>
${order_date}

${notes ? `<b>📝 ملاحظات:</b>\n${notes}` : ''}
      `.trim();
    } else if (order_type === 'cart') {
      const productsText = products
        .map((p) => `• ${p.name} × ${p.quantity} = ${p.quantity * p.price} ج.م`)
        .join('\n');

      telescopeMessage = `
<b>🛒 طلب متعدد المنتجات</b>

<b>👤 بيانات العميل:</b>
اسم: ${customer_name}
الإيميل: ${customer_email}
تليفون: ${phone}

<b>📦 المنتجات:</b>
${productsText}

<b>💰 الإجمالي: ${total_amount} ج.م</b>

<b>📍 عنوان التسليم:</b>
المحافظة: ${governorate}
المدينة: ${city}
العنوان: ${street}
${landmark ? `المعلم: ${landmark}` : ''}

<b>⏰ التاريخ:</b>
${new Date().toLocaleString('ar-EG')}

${notes ? `<b>📝 ملاحظات:</b>\n${notes}` : ''}
      `.trim();
    }

    const telegramResult = await sendTelegramNotification({
      type: order_type === 'single_product' ? 'bank_transfer' : 'cart_order',
      message: telescopeMessage,
      orderData: {
        order_id,
        customer_name,
        customer_email,
        phone,
        governorate,
        city,
        street,
        landmark,
        notes,
        payment_method,
        order_date,
        products,
        total_price: total_amount,
      },
      imageData,
      transferImageMime,
    });

    if (!telegramResult.success) {
      console.warn('⚠️ [Telegram] Failed but continuing with order processing');
    }

    // STEP 3: Save to Excel
    console.log('📊 [Order Flow] STEP 3: Saving to Excel...');
    const excelResult = await saveToExcel(order_type, body, products);

    if (!excelResult.success) {
      console.warn('⚠️ [Excel] Failed but order was processed');
    }

    console.log('═══════════════════════════════════════════════════');
    console.log('✅ [Order Processing] Order completed successfully');
    console.log(`   Order ID: ${order_id}`);
    console.log('═══════════════════════════════════════════════════');

    return NextResponse.json(
      {
        success: true,
        message: 'Order processed successfully',
        orderId: order_id,
        email: customer_email,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [Order Processing] Error:', error.message);
    return NextResponse.json(
      {
        error: error.message || 'Failed to process order',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}
