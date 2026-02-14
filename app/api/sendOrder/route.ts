import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Verify Brevo SMTP configuration on startup
console.log('🔧 [Email] Brevo SMTP Configuration Check:');
console.log('  - BREVO_SMTP_KEY:', process.env.BREVO_SMTP_KEY ? '✓ Set' : '✗ Missing');
console.log('  - BREVO_SENDER_EMAIL:', process.env.BREVO_SENDER_EMAIL ? '✓ Set' : '✗ Missing');

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

function generateOrderHTML(data: SendOrderRequest): string {
  const productsHTML = data.products
    .map(
      (p) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${p.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center;">${p.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">${p.price} EGP</td>
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
        body { 
          font-family: Arial, Helvetica, sans-serif;
          background-color: #fff0f6;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #ffb6c9, #f78fb3);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 16px;
          opacity: 0.95;
        }
        .content {
          padding: 30px 20px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-weight: bold;
          color: #e84393;
          margin-bottom: 15px;
          font-size: 16px;
        }
        .info-row {
          margin-bottom: 8px;
          line-height: 1.6;
        }
        .info-label {
          font-weight: bold;
          color: #333;
        }
        .note {
          background-color: #fff5f9;
          border-left: 4px solid #e84393;
          padding: 15px;
          margin: 15px 0;
          border-radius: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th {
          background-color: #e84393;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #e0e0e0;
        }
        .total-row {
          background-color: #fff5f9;
          font-weight: bold;
          padding: 15px;
          text-align: right;
          color: #e84393;
          font-size: 18px;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
        }
        .footer p {
          margin: 8px 0;
        }
        .button-group {
          text-align: center;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 25px;
          margin: 0 8px;
          background-color: #e84393;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🎉 Thank You For Your Order!</h1>
          <p>Your order has been received successfully. We will contact you soon!</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Save Email Notice -->
          <div class="note">
            <strong>📸 Save this email!</strong> Take a screenshot of your order.
          </div>

          <!-- Order Receipt Section -->
          <div class="section">
            <div class="section-title">🧾 Order Receipt</div>
            <div class="info-row">
              <span class="info-label">Order ID:</span> ${data.order_id}
            </div>
            <div class="info-row">
              <span class="info-label">Order Date:</span> ${data.order_date}
            </div>
          </div>

          <!-- Customer Information -->
          <div class="section">
            <div class="section-title">👤 Customer Information</div>
            <div class="info-row">
              <span class="info-label">Full Name:</span> ${data.customer_name}
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span> ${data.phone}
            </div>
            <div class="info-row">
              <span class="info-label">WhatsApp:</span> ${data.whatsapp}
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span> ${data.customer_email}
            </div>
          </div>

          <!-- Delivery Address -->
          <div class="section">
            <div class="section-title">📍 Delivery Address</div>
            <div class="info-row">
              <span class="info-label">Governorate:</span> ${data.governorate}
            </div>
            <div class="info-row">
              <span class="info-label">City:</span> ${data.city}
            </div>
            <div class="info-row">
              <span class="info-label">Street:</span> ${data.street}
            </div>
            ${data.landmark ? `<div class="info-row"><span class="info-label">Landmark:</span> ${data.landmark}</div>` : ''}
            ${data.notes ? `<div class="info-row"><span class="info-label">Notes:</span> ${data.notes}</div>` : ''}
          </div>

          <!-- Products -->
          <div class="section">
            <div class="section-title">📦 Products (${data.products.length} items)</div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${productsHTML}
              </tbody>
            </table>
            <div class="total-row">
              💰 Total: ${data.total_amount} EGP
            </div>
          </div>

          <!-- Confirmation -->
          <div class="note">
            <strong>✅ Your order has been confirmed!</strong> We will contact you at ${data.phone} to confirm delivery details.
          </div>

          <!-- Contact Info -->
          <div class="section">
            <div class="info-row">
              📧 Contact: <strong>${data.customer_email}</strong>
            </div>
          </div>

          <!-- Buttons -->
          <div class="button-group">
            <a href="http://localhost:3000" class="button">🏠 Back to Home</a>
            <a href="http://localhost:3000" class="button">🛍️ Shop More</a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>✨ Luqitchy Cosmetics — Your beauty starts here</strong></p>
          <p>Thank you for your purchase! We appreciate your business.</p>
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
    } = body;

    // Validate required fields
    if (!customer_name || !customer_email || !order_id) {
      console.error('❌ [Email] Missing required fields:', { customer_name, customer_email, order_id });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      console.error('❌ [Email] Invalid email format:', customer_email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log(`📧 [Email] Processing order #${order_id} for ${customer_name} (${customer_email})`);

    // Generate products table HTML
    console.log('📋 [Email] Generating products table...');
    const productsTable = generateProductsTable(body.products);
    console.log('✓ [Email] Products table generated successfully');

    // Create Nodemailer transporter for Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SENDER_EMAIL,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });

    // Generate HTML email content
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, Helvetica, sans-serif; background-color: #fff0f6; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #ffb6c9, #f78fb3); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }
          .content { padding: 30px 20px; }
          .section { margin-bottom: 25px; }
          .section-title { font-weight: bold; color: #e84393; margin-bottom: 15px; font-size: 16px; }
          .info-row { margin-bottom: 8px; line-height: 1.6; }
          .info-label { font-weight: bold; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background-color: #e84393; color: white; padding: 12px; text-align: left; font-weight: bold; }
          td { padding: 10px; border-bottom: 1px solid #e0e0e0; }
          .total-row { background-color: #fff5f9; font-weight: bold; padding: 15px; text-align: right; color: #e84393; font-size: 18px; }
          .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎀 طلب جديد تم استلامه</h1>
            <p>شكراً لطلبك! تم استلام طلبك بنجاح</p>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">👤 بيانات العميل</div>
              <div class="info-row"><span class="info-label">الاسم:</span> ${body.customer_name}</div>
              <div class="info-row"><span class="info-label">الهاتف:</span> ${body.phone}</div>
              <div class="info-row"><span class="info-label">البريد:</span> ${body.customer_email}</div>
              <div class="info-row"><span class="info-label">WhatsApp:</span> ${body.whatsapp}</div>
            </div>

            <div class="section">
              <div class="section-title">🎁 تفاصيل الطلب</div>
              <div class="info-row"><span class="info-label">رقم الطلب:</span> <code>${body.order_id}</code></div>
              <div class="info-row"><span class="info-label">التاريخ:</span> ${body.order_date}</div>
              <div class="info-row"><span class="info-label">المحافظة:</span> ${body.governorate}</div>
              <div class="info-row"><span class="info-label">المدينة:</span> ${body.city}</div>
              <div class="info-row"><span class="info-label">الشارع:</span> ${body.street}</div>
              ${body.landmark ? `<div class="info-row"><span class="info-label">العلامة المميزة:</span> ${body.landmark}</div>` : ''}
            </div>

            <div class="section">
              <div class="section-title">📦 المنتجات</div>
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
                  ${productsTable}
                </tbody>
              </table>
              <div class="total-row">الإجمالي: ${body.total_amount} EGP</div>
            </div>

            <div class="section">
              <div class="section-title">💳 طريقة الدفع</div>
              <div class="info-row">${body.payment_method}</div>
              ${body.notes ? `<div class="info-row"><span class="info-label">ملاحظات:</span> ${body.notes}</div>` : ''}
            </div>
          </div>

          <div class="footer">
            <p><strong>✨ Luqitchy Cosmetics — For Your Beauty</strong></p>
            <p>شكراً لشرائك منا!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('📬 [Email] Sending email via Brevo SMTP:');
    console.log('   - To:', body.customer_email);
    console.log('   - From:', process.env.BREVO_SENDER_EMAIL);
    console.log('   - Order ID:', body.order_id);

    // Send email via Nodemailer + Brevo SMTP
    const info = await transporter.sendMail({
      from: process.env.BREVO_SENDER_EMAIL,
      to: body.customer_email,
      subject: `تأكيد الطلب #${body.order_id} - Luqitchy Cosmetics`,
      html: emailHTML,
    });

    console.log('✅ [Email] Email sent successfully via Brevo SMTP!');
    console.log('   - Message ID:', info.messageId);
    console.log('   - Response:', info.response);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Order confirmation email sent to customer',
        orderId: body.order_id,
        customerEmail: body.customer_email,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [Email] Error sending email:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    console.error('   Full error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to send order email',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}
