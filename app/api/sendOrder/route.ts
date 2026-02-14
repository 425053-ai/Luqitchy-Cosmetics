import { NextRequest, NextResponse } from 'next/server';

// Verify EmailJS configuration on startup
console.log('🔧 [Email] EmailJS Configuration Check:');
console.log('  - SERVICE_ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? '✓ Set' : '✗ Missing');
console.log('  - TEMPLATE_ID:', process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? '✓ Set' : '✗ Missing');
console.log('  - PUBLIC_KEY:', process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? '✓ Set' : '✗ Missing');

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
      transferImage,
      transferImageMime,
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

    // Generate products table HTML for EmailJS template
    console.log('📋 [Email] Generating products table...');
    const productsTable = generateProductsTable(body.products);
    console.log('✓ [Email] Products table generated successfully');

    // EmailJS template parameters - mapped to new "Order Confirmation" template
    const templateParams = {
      service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      template_params: {
        // Email fields
        to_email: customer_email,
        to_name: customer_name,
        
        // Order Receipt
        order_id: order_id,
        order_date: body.order_date,
        
        // Customer Information
        full_name: customer_name,
        phone: body.phone || '',
        whatsapp: body.whatsapp || body.phone || '',
        email: customer_email,
        
        // Delivery Address
        governorate: body.governorate || '',
        city: body.city || '',
        street: body.street || '',
        landmark: body.landmark || '',
        notes: body.notes || '',
        
        // Products table (HTML)
        products_table: productsTable,
        
        // Total amount
        total: body.total_amount || 0,
      }
    };

    console.log('📬 [Email] Sending email via EmailJS:');
    console.log('   - To:', customer_email);
    console.log('   - Order ID:', order_id);
    console.log('   - Service:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.substring(0, 10) + '...');
    console.log('   - Template Params Keys:', Object.keys(templateParams.template_params));

    // Send via EmailJS API
    const emailJSResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateParams),
    });

    let emailJSResult;
    let responseText = '';
    
    try {
      responseText = await emailJSResponse.text();
      emailJSResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ [Email] Failed to parse EmailJS response');
      console.error('   Raw response:', responseText);
      throw new Error('Failed to parse EmailJS response');
    }

    console.log('📥 [Email] EmailJS Response Received:');
    console.log('   - HTTP Status:', emailJSResponse.status);
    console.log('   - Response OK:', emailJSResponse.ok);
    console.log('   - Response Text:', JSON.stringify(emailJSResult, null, 2));

    if (!emailJSResponse.ok) {
      console.error('❌ [Email] EmailJS API Error:', emailJSResponse.status);
      console.error('   Response:', JSON.stringify(emailJSResult, null, 2));
      throw new Error(`EmailJS Error: ${emailJSResult?.message || emailJSResponse.statusText || 'Unknown error'}`);
    }

    console.log('✅ [Email] Customer email sent successfully via EmailJS!');
    console.log('   - Status:', emailJSResult.status);
    console.log('   - Message:', emailJSResult.text);

    // Admin email removed - using Telegram notifications instead for cost optimization

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
    console.error('❌ [Email] Exception thrown:', error.name);
    console.error('   Message:', error.message);
    
    // Log configuration debug
    console.error('🔧 [Email] Configuration Debug:');
    console.error('  - SERVICE_ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? '✓ Set' : '✗ Missing');
    console.error('  - TEMPLATE_ID:', process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? '✓ Set' : '✗ Missing');
    console.error('  - PUBLIC_KEY:', process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? '✓ Set' : '✗ Missing');
    console.error('  - EmailJS API: Reach https://api.emailjs.com/api/v1.0/email/send');
    
    // Log full error trace
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
