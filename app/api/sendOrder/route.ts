import { NextRequest, NextResponse } from 'next/server';
import emailjs from '@emailjs/nodejs';

// Initialize EmailJS
console.log('🔧 [Email] EmailJS Configuration Check:');
console.log('  - SERVICE_ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? '✓ Set' : '✗ Missing');
console.log('  - TEMPLATE_ID:', process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? '✓ Set' : '✗ Missing');
console.log('  - PUBLIC_KEY:', process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? '✓ Set' : '✗ Missing');

if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
  emailjs.init({
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    limitRate: {
      id: 'throttle_limit',
      throttle: 50,
    },
  });
}

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



    console.log('📬 [Email] Sending email via EmailJS:');
    console.log('   - To:', body.customer_email);
    console.log('   - Order ID:', body.order_id);
    console.log('   - Service:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.substring(0, 10) + '...');

    // Prepare template parameters for EmailJS
    const templateParams = {
      to_email: body.customer_email,
      to_name: body.customer_name,
      order_id: body.order_id,
      order_date: body.order_date,
      full_name: body.customer_name,
      phone: body.phone || '',
      whatsapp: body.whatsapp || body.phone || '',
      email: body.customer_email,
      governorate: body.governorate || '',
      city: body.city || '',
      street: body.street || '',
      landmark: body.landmark || '',
      notes: body.notes || 'بدون ملاحظات',
      products_table: productsTable,
      total: body.total_amount || 0,
    };

    // Send email via EmailJS
    const emailResponse = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams
    );

    console.log('✅ [Email] Email sent successfully via EmailJS!');
    console.log('   - Status:', emailResponse.status);
    console.log('   - Message:', emailResponse.text);

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
