import { NextRequest, NextResponse } from 'next/server';

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
            <span class="info-value">${data.phone || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">WhatsApp:</span>
            <span class="info-value">${data.whatsapp || data.phone || 'N/A'}</span>
          </div>
        </div>

        <div class="section">
          <h2>📦 Products</h2>
          <table>
            <thead>
              <tr style="background-color: #ffb6c1;">
                <th>Product Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${productsTable}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>🏘️ Delivery Address</h2>
          <div class="address-box">
            <div style="margin-bottom: 8px;"><strong>${data.governorate}</strong>, ${data.city}</div>
            <div style="margin-bottom: 8px;">${data.street}</div>
            ${data.landmark ? `<div style="margin-bottom: 8px;"><em>Landmark: ${data.landmark}</em></div>` : ''}
            ${data.notes ? `<div style="margin-bottom: 8px; padding-top: 8px; border-top: 1px solid #ffe0ec;"><strong>Notes:</strong> ${data.notes}</div>` : ''}
          </div>
        </div>

        <div class="section">
          <h2>💳 Payment Method</h2>
          <div class="info-row">
            <span class="info-label">Method:</span>
            <span class="info-value">${data.payment_method}</span>
          </div>
        </div>

        <div class="section" style="background-color: #fff5e6; border-left-color: #ff9900;">
          <h2 style="color: #ff9900;">💰 Total Amount</h2>
          <div class="total">${data.total_amount} EGP</div>
        </div>

        <div style="background-color: #e6f9f0; padding: 15px; border-radius: 10px; margin: 20px 0;">
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

    // Check Brevo API key
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error('❌ [Email] BREVO_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Generate products table HTML
    console.log('📋 [Email] Generating products table...');
    const productsTable = generateProductsTable(body.products);
    const emailHTML = generateEmailHTML(body, productsTable);
    console.log('✓ [Email] Email HTML generated successfully');

    console.log('📬 [Email] Sending email via Brevo API:');
    console.log('   - To:', customer_email);
    console.log('   - Order ID:', order_id);
    console.log('   - Subject: Order Confirmation - ' + order_id);

    // Send email via Brevo API
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        to: [
          {
            email: customer_email,
            name: customer_name,
          }
        ],
        sender: {
          email: process.env.BREVO_SENDER_EMAIL || 'luqitchycosmetics@gmail.com',
          name: process.env.BREVO_SENDER_NAME || 'Luqitchy Cosmetics 💖',
        },
        subject: `Order Confirmation - ${order_id}`,
        htmlContent: emailHTML,
        replyTo: {
          email: 'luqitchycosmetics@gmail.com',
          name: 'Luqitchy Cosmetics Support',
        },
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json();
      console.error('❌ [Email] Brevo API Error:');
      console.error('   Status:', brevoResponse.status);
      console.error('   Error:', errorData);
      throw new Error(`Brevo API error: ${JSON.stringify(errorData)}`);
    }

    const responseData = await brevoResponse.json();
    console.log('✅ [Email] Email sent successfully via Brevo!');
    console.log('   - Message ID:', responseData.messageId);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Order confirmation email sent to customer',
        orderId: order_id,
        customerEmail: customer_email,
        messageId: responseData.messageId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [Email] Error sending email:');
    console.error('   Message:', error.message);
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
