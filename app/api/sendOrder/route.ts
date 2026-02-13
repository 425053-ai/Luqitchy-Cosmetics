import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure Brevo SMTP
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_SENDER_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

interface OrderProduct {
  name: string;
  quantity: number;
  price: number;
  total: number;
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
  transferImage?: string;
  transferImageMime?: string;
}

function generateOrderHTML(data: SendOrderRequest): string {
  const productsHTML = data.products
    .map(
      (p) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${p.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center;">${p.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">${p.price} EGP</td>
      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: bold;">${p.total} EGP</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 500px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f4a5c3; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; color: #c41e5c; margin-bottom: 10px; border-bottom: 2px solid #f4a5c3; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .total-row { background-color: #f4a5c3; color: white; font-weight: bold; padding: 10px; }
        .success-badge { display: inline-block; background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 4px; margin-bottom: 10px; }
        .bank-transfer { background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3; margin-top: 15px; }
        .footer { background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ شكراً لطلبك!</h1>
          <p>تم استلام طلبك بنجاح</p>
        </div>
        
        <div class="content">
          <div class="success-badge">✓ الطلب مؤكد #${data.order_id}</div>
          
          <div class="section">
            <div class="section-title">📋 معلومات الطلب</div>
            <p><strong>رقم الطلب:</strong> ${data.order_id}</p>
            <p><strong>التاريخ:</strong> ${data.order_date}</p>
            <p><strong>طريقة الدفع:</strong> ${data.payment_method}</p>
          </div>
          
          <div class="section">
            <div class="section-title">👤 بيانات العميل</div>
            <p><strong>الاسم:</strong> ${data.customer_name}</p>
            <p><strong>الهاتف:</strong> <span dir="ltr">${data.phone}</span></p>
            <p><strong>واتساب:</strong> <span dir="ltr">${data.whatsapp}</span></p>
          </div>
          
          <div class="section">
            <div class="section-title">📍 عنوان التوصيل</div>
            <p><strong>المحافظة:</strong> ${data.governorate}</p>
            <p><strong>المدينة:</strong> ${data.city}</p>
            <p><strong>الشارع:</strong> ${data.street}</p>
            ${data.landmark ? `<p><strong>علامة مميزة:</strong> ${data.landmark}</p>` : ''}
          </div>
          
          <div class="section">
            <div class="section-title">📦 المنتجات</div>
            <table>
              <thead>
                <tr style="background-color: #f4a5c3; color: white;">
                  <th style="padding: 10px; text-align: left;">المنتج</th>
                  <th style="padding: 10px; text-align: center;">الكمية</th>
                  <th style="padding: 10px; text-align: right;">السعر</th>
                  <th style="padding: 10px; text-align: right;">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                ${productsHTML}
                <tr class="total-row">
                  <td colspan="3" style="text-align: right; padding: 10px;">الإجمالي:</td>
                  <td style="padding: 10px; text-align: right;">${data.total_amount} EGP</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          ${data.notes ? `
            <div class="section">
              <div class="section-title">📝 ملاحظات</div>
              <p>${data.notes}</p>
            </div>
          ` : ''}
          
          ${data.payment_method.includes('تحويل') || data.payment_method.includes('bank') ? `
            <div class="bank-transfer">
              <p><strong>✅ تم استلام صورة التحويل</strong></p>
              <p>سيتم التحقق من التحويل والتأكيد خلال 24 ساعة</p>
              ${data.transferImage ? `<p style="margin-top: 10px; font-size: 12px; color: #666;">شاملة على صورة التحويل المرفقة</p>` : ''}
            </div>
          ` : ''}
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="text-align: center; font-size: 13px; color: #666;">
              ستتلقى رسالة تأكيد أخرى عند بدء إجراءات التوصيل
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Luqitchy Cosmetics</strong></p>
          <p>✨ Your Beauty Journey Starts Here</p>
          <p>📧 luqitchycosmetics@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendOrderRequest = await request.json();

    const {
      customer_name,
      customer_email,
      order_id,
      transferImage,
      transferImageMime,
    } = body;

    if (!customer_name || !customer_email || !order_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const htmlContent = generateOrderHTML(body);

    // Prepare attachments
    const attachments: any[] = [];

    if (transferImage && transferImageMime) {
      attachments.push({
        filename: `transfer-proof-${order_id}.jpg`,
        content: Buffer.from(transferImage, 'base64'),
        contentType: transferImageMime,
      });
    }

    // Send to customer
    const customerMailOptions = {
      from: process.env.BREVO_SENDER_EMAIL,
      to: customer_email,
      subject: `تأكيد طلبك #${order_id} | Luqitchy Cosmetics`,
      html: htmlContent,
      attachments,
    };

    await transporter.sendMail(customerMailOptions);

    // Send to admin (store owner)
    const adminHtmlContent = `
      <h2>طلب جديد!</h2>
      ${htmlContent}
      <hr>
      <p><strong>تفاصيل العميل:</strong></p>
      <p>البريد: ${customer_email}</p>
    `;

    const adminMailOptions = {
      from: process.env.BREVO_SENDER_EMAIL,
      to: process.env.BREVO_SENDER_EMAIL, // Store owner email
      subject: `[طلب جديد] #${order_id} - ${customer_name}`,
      html: adminHtmlContent,
      attachments,
    };

    await transporter.sendMail(adminMailOptions);

    return NextResponse.json(
      { success: true, message: 'Order sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send order email' },
      { status: 500 }
    );
  }
}
