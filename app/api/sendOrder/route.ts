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
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #c41e5c 0%, #f4a5c3 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px 20px; border: 1px solid #ddd; }
        .section { margin-bottom: 25px; }
        .section-title { font-weight: bold; color: #c41e5c; margin-bottom: 10px; border-bottom: 2px solid #f4a5c3; padding-bottom: 8px; font-size: 14px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .total-row { background-color: #f4a5c3; color: white; font-weight: bold; padding: 12px; }
        .success-badge { display: inline-block; background-color: #4CAF50; color: white; padding: 8px 12px; border-radius: 4px; margin-bottom: 10px; font-weight: bold; }
        .payment-info { background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3; margin-top: 15px; border-radius: 4px; }
        .footer { background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        .info-row { display: flex; margin-bottom: 8px; }
        .info-label { font-weight: bold; width: 120px; color: #555; }
        .info-value { flex: 1; color: #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">✨ Order Confirmed!</h1>
          <p style="margin: 5px 0 0 0;">Thank you for your order</p>
        </div>
        
        <div class="content">
          <div class="success-badge">✓ Order Confirmed #${data.order_id}</div>
          
          <div class="section">
            <div class="section-title">📋 Order Information</div>
            <div class="info-row">
              <span class="info-label">Order ID:</span>
              <span class="info-value">${data.order_id}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${data.order_date}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">Vodafone Cash Wallet</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">👤 Customer Details</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${data.customer_name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value"><span dir="ltr">${data.phone}</span></span>
            </div>
            <div class="info-row">
              <span class="info-label">WhatsApp:</span>
              <span class="info-value"><span dir="ltr">${data.whatsapp}</span></span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">📍 Delivery Address</div>
            <div class="info-row">
              <span class="info-label">Governorate:</span>
              <span class="info-value">${data.governorate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">City:</span>
              <span class="info-value">${data.city}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Street:</span>
              <span class="info-value">${data.street}</span>
            </div>
            ${data.landmark ? `
            <div class="info-row">
              <span class="info-label">Landmark:</span>
              <span class="info-value">${data.landmark}</span>
            </div>` : ''}
          </div>
          
          <div class="section">
            <div class="section-title">📦 Products</div>
            <table>
              <thead>
                <tr style="background-color: #c41e5c; color: white;">
                  <th style="padding: 12px; text-align: left;">Product</th>
                  <th style="padding: 12px; text-align: center;">Qty</th>
                  <th style="padding: 12px; text-align: right;">Price</th>
                  <th style="padding: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${productsHTML}
                <tr class="total-row">
                  <td colspan="3" style="text-align: right; padding: 12px;">Total Amount:</td>
                  <td style="padding: 12px; text-align: right;">${data.total_amount} EGP</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          ${data.notes ? `
            <div class="section">
              <div class="section-title">📝 Special Instructions</div>
              <p>${data.notes}</p>
            </div>
          ` : ''}
          
          <div class="payment-info">
            <p style="margin-top: 0;"><strong>✅ Payment Screenshot Received</strong></p>
            <p style="margin: 8px 0;">Your Vodafone Cash payment confirmation has been received and verified. We will process your order shortly.</p>
            <p style="margin: 8px 0; font-size: 12px; color: #1976d2;"><strong>📦 Expected Delivery: Within 24-48 hours</strong></p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="text-align: center; font-size: 13px; color: #666; margin: 0;">
              ✨ Thank you for shopping with Luqitchy Cosmetics! ✨
            </p>
            <p style="text-align: center; font-size: 12px; color: #999; margin: 5px 0 0 0;">
              You will receive a shipping confirmation once your order is dispatched.
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0; font-weight: bold; font-size: 14px;">Luqitchy Cosmetics</p>
          <p style="margin: 5px 0;">✨ Premium Beauty Products</p>
          <p style="margin: 5px 0; font-size: 11px;">Follow us on Instagram @luqitchyglossy</p>
          <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0; font-size: 11px;">If you have any questions, please reply to this email or contact us via WhatsApp</p>
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

    // Validate required fields
    if (!customer_name || !customer_email || !order_id) {
      console.error('Missing required fields:', { customer_name, customer_email, order_id });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      console.error('Invalid email format:', customer_email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log(`Processing order #${order_id} for ${customer_name} (${customer_email})`);

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
      from: process.env.BREVO_SENDER_EMAIL || 'noreply@luqitchy.com',
      to: customer_email,
      subject: `Order Confirmation #${order_id} | Luqitchy Cosmetics`,
      html: htmlContent,
      attachments,
      replyTo: process.env.BREVO_SENDER_EMAIL,
    };

    console.log(`Sending customer email to: ${customer_email}`);
    const customerResult = await transporter.sendMail(customerMailOptions);
    console.log(`✅ Customer email sent successfully:`, customerResult.messageId);

    // Admin email removed - using Telegram notifications instead for cost optimization
    // All 300 daily email quota is reserved for customer confirmations

    return NextResponse.json(
      { 
        success: true, 
        message: 'Order confirmation email sent to customer',
        orderId: order_id,
        customerEmail: customer_email,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Email sending error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send order email' },
      { status: 500 }
    );
  }
}
