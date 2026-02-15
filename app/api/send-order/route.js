import { NextRequest, NextResponse } from 'next/server';

function generateProductsTable(cart) {
  return cart
    .map(
      (item) => `
        <tr style="border: 1px solid #ff66b2;">
          <td style="padding: 8px; border: 1px solid #ff66b2;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ff66b2; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ff66b2; text-align: center;">${item.price}</td>
          <td style="padding: 8px; border: 1px solid #ff66b2; text-align: center;">${item.price * item.quantity}</td>
        </tr>
      `
    )
    .join('');
}

function generateEmailHTML(data, productsTable) {
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
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background-color: #ffb6c1; padding: 10px; text-align: left; color: #333; border: 1px solid #ff66b2; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Order Confirmation</h1>
          <p style="margin: 10px 0 0 0;">Thank you for your purchase!</p>
        </div>

        <div style="padding: 20px;">
          <h2 style="color: #ff66b2;">Thank You For Your Order 💖</h2>
          <p><strong>Order ID:</strong> ${data.orderId}</p>

          <table>
            <thead>
              <tr style="background: #ffb6c1;">
                <th style="padding: 8px; border: 1px solid #ff66b2;">Product</th>
                <th style="padding: 8px; border: 1px solid #ff66b2;">Qty</th>
                <th style="padding: 8px; border: 1px solid #ff66b2;">Price</th>
                <th style="padding: 8px; border: 1px solid #ff66b2;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${productsTable}
            </tbody>
          </table>

          <h3 style="text-align: right; color: #ff66b2;">Total: ${data.total} EGP</h3>
        </div>

        <div class="footer">
          <p>Thank you for shopping with Luqitchy Cosmetics!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(req) {
  try {
    const data = await req.json();
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.error('❌ [Email] BREVO_API_KEY is not set');
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const productsTable = generateProductsTable(data.cart);
    const emailHTML = generateEmailHTML(data, productsTable);

    console.log(`📧 [Email] Sending email via Brevo to ${data.email}`);

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
            email: data.email,
          }
        ],
        sender: {
          email: process.env.BREVO_SENDER_EMAIL || 'luqitchycosmetics@gmail.com',
          name: process.env.BREVO_SENDER_NAME || 'Luqitchy Cosmetics',
        },
        subject: `Order Confirmation - ${data.orderId}`,
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
      throw new Error(`Brevo error: ${JSON.stringify(errorData)}`);
    }

    console.log('✅ [Email] Email sent successfully via Brevo');
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ [Email] Error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
