import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════
// Admin Email Notification API
// Uses a SEPARATE Brevo account (BREVO_ADMIN_API_KEY)
// 300 emails/day for admin — completely independent from customer emails
// ═══════════════════════════════════════════════════════════════

interface OrderProduct {
  name: string;
  quantity: number;
  price: number;
  total?: number;
}

interface AdminEmailRequest {
  order_id: string;
  order_date: string;
  order_type?: 'single_product' | 'cart';
  customer_name: string;
  customer_email: string;
  phone: string;
  whatsapp?: string;
  products: OrderProduct[];
  total_amount: number;
  governorate: string;
  city: string;
  street: string;
  landmark?: string;
  notes?: string;
  payment_method: string;
}

function generateAdminEmailHTML(data: AdminEmailRequest): string {
  const productsRows = data.products.map(p => `
    <tr>
      <td style="padding: 10px; border: 1px solid #d5c4e0; text-align: right;">${p.name}</td>
      <td style="padding: 10px; border: 1px solid #d5c4e0; text-align: center;">${p.quantity}</td>
      <td style="padding: 10px; border: 1px solid #d5c4e0; text-align: center;">${p.price} EGP</td>
      <td style="padding: 10px; border: 1px solid #d5c4e0; text-align: center; font-weight: bold;">${p.price * p.quantity} EGP</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #f4f0ff; margin: 0; padding: 20px; direction: rtl; }
        .container { max-width: 640px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 12px; border: 2px solid #9b59b6; box-shadow: 0 4px 12px rgba(155,89,182,0.15); }
        .header { background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; }
        .header .order-id { font-size: 18px; margin-top: 8px; background: rgba(255,255,255,0.2); display: inline-block; padding: 4px 16px; border-radius: 20px; }
        .section { margin-bottom: 18px; padding: 15px; background-color: #faf8ff; border-right: 4px solid #9b59b6; border-radius: 6px; }
        .section h2 { color: #8e44ad; margin-top: 0; font-size: 16px; border-bottom: 1px solid #e8daf5; padding-bottom: 8px; }
        .info-row { display: flex; justify-content: space-between; margin: 6px 0; padding-bottom: 6px; border-bottom: 1px solid #f0eaf5; }
        .info-label { font-weight: bold; color: #555; font-size: 14px; }
        .info-value { color: #222; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th { background-color: #9b59b6; color: white; padding: 10px; text-align: right; border: 1px solid #8e44ad; font-size: 13px; }
        td { padding: 10px; border: 1px solid #d5c4e0; font-size: 13px; text-align: right; }
        tr:nth-child(even) { background-color: #f9f5ff; }
        .total-box { background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; padding: 15px; border-radius: 10px; text-align: center; margin: 15px 0; }
        .total-box .amount { font-size: 28px; font-weight: bold; }
        .payment-badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; }
        .payment-cod { background-color: #fff3cd; color: #856404; }
        .payment-transfer { background-color: #d4edda; color: #155724; }
        .payment-card { background-color: #cce5ff; color: #004085; }
        .footer { text-align: center; color: #999; font-size: 11px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e8daf5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛒 أوردر جديد!</h1>
          <div class="order-id">${data.order_id}</div>
        </div>

        <div class="section">
          <h2>👤 بيانات العميل</h2>
          <div class="info-row">
            <span class="info-label">الاسم:</span>
            <span class="info-value">${data.customer_name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">الإيميل:</span>
            <span class="info-value">${data.customer_email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">الموبايل:</span>
            <span class="info-value"><a href="tel:${data.phone}" style="color: #9b59b6; text-decoration: none;">${data.phone || 'N/A'}</a></span>
          </div>
          <div class="info-row">
            <span class="info-label">واتساب:</span>
            <span class="info-value"><a href="https://wa.me/${(data.whatsapp || data.phone || '').replace(/[^0-9]/g, '')}" style="color: #25d366; text-decoration: none;">${data.whatsapp || data.phone || 'N/A'}</a></span>
          </div>
        </div>

        <div class="section">
          <h2>📦 المنتجات</h2>
          <table>
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${productsRows}
            </tbody>
          </table>
        </div>

        <div class="total-box">
          <div style="font-size: 14px; margin-bottom: 5px;">💰 إجمالي الأوردر</div>
          <div class="amount">${data.total_amount} EGP</div>
        </div>

        <div class="section">
          <h2>🏘️ عنوان التوصيل</h2>
          <div class="info-row">
            <span class="info-label">المحافظة:</span>
            <span class="info-value">${data.governorate}</span>
          </div>
          <div class="info-row">
            <span class="info-label">المدينة:</span>
            <span class="info-value">${data.city}</span>
          </div>
          <div class="info-row">
            <span class="info-label">الشارع:</span>
            <span class="info-value">${data.street}</span>
          </div>
          ${data.landmark ? `<div class="info-row"><span class="info-label">علامة مميزة:</span><span class="info-value">${data.landmark}</span></div>` : ''}
          ${data.notes ? `<div class="info-row"><span class="info-label">ملاحظات:</span><span class="info-value">${data.notes}</span></div>` : ''}
        </div>

        <div class="section">
          <h2>💳 طريقة الدفع</h2>
          <span class="payment-badge ${data.payment_method === 'الدفع عند الاستلام' || data.payment_method === 'Cash on Delivery' ? 'payment-cod' : data.payment_method.includes('تحويل') || data.payment_method.includes('Transfer') ? 'payment-transfer' : 'payment-card'}">${data.payment_method}</span>
        </div>

        <div class="section">
          <h2>📅 تفاصيل الأوردر</h2>
          <div class="info-row">
            <span class="info-label">تاريخ الأوردر:</span>
            <span class="info-value">${data.order_date}</span>
          </div>
          <div class="info-row">
            <span class="info-label">عدد المنتجات:</span>
            <span class="info-value">${data.products.reduce((sum, p) => sum + p.quantity, 0)} قطعة</span>
          </div>
          ${data.order_type ? `<div class="info-row"><span class="info-label">نوع الأوردر:</span><span class="info-value">${data.order_type === 'cart' ? 'سلة تسوق' : 'منتج واحد'}</span></div>` : ''}
        </div>

        <div class="footer">
          <p>Luqitchy Cosmetics - Admin Order Notification</p>
          <p style="color: #bbb; font-size: 10px;">هذا الإيميل مُرسل تلقائياً عند كل أوردر جديد</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body: AdminEmailRequest = await request.json();
    const { order_id, customer_name } = body;

    // Validate minimum required fields
    if (!order_id || !customer_name) {
      return NextResponse.json(
        { error: 'Missing required fields (order_id, customer_name)' },
        { status: 400 }
      );
    }

    // Use SEPARATE Brevo API key for admin emails (independent 300/day quota)
    // Account: belalahmedm667@gmail.com (Admin)
    const adminBrevoKey = (process.env.BREVO_ADMIN_API_KEY || '').trim();
    if (!adminBrevoKey) {
      console.error('❌ [Admin Email] BREVO_ADMIN_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Admin email service not configured. Set BREVO_ADMIN_API_KEY env variable.' },
        { status: 500 }
      );
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'luqitchycosmetics@gmail.com';
    const ADMIN_SENDER_EMAIL = process.env.BREVO_ADMIN_SENDER_EMAIL || 'belalahmedm667@gmail.com';
    const ADMIN_SENDER_NAME = process.env.BREVO_ADMIN_SENDER_NAME || 'Admin';

    const adminEmailHTML = generateAdminEmailHTML(body);

    const emailPayload = {
      to: [
        {
          email: ADMIN_EMAIL,
          name: 'Luqitchy Admin',
        }
      ],
      sender: {
        email: ADMIN_SENDER_EMAIL,
        name: ADMIN_SENDER_NAME,
      },
      subject: `🛒 أوردر جديد - ${order_id} - ${customer_name}`,
      htmlContent: adminEmailHTML,
    };

    console.log(`📬 [Admin Email] Sending admin notification to ${ADMIN_EMAIL} for order ${order_id}`);
    
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': adminBrevoKey,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json();
      console.error('❌ [Admin Email] Brevo API Error:', brevoResponse.status, errorData);
      return NextResponse.json(
        { error: `Brevo API error: ${errorData?.message || brevoResponse.status}` },
        { status: brevoResponse.status }
      );
    }

    const responseData = await brevoResponse.json();
    console.log('✅ [Admin Email] Admin notification sent! MessageId:', responseData.messageId);

    return NextResponse.json(
      {
        success: true,
        message: 'Admin notification email sent',
        orderId: order_id,
        adminEmail: ADMIN_EMAIL,
        messageId: responseData.messageId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [Admin Email] Error:', error?.message);
    return NextResponse.json(
      { error: error?.message || 'Failed to send admin email' },
      { status: 500 }
    );
  }
}
