const brevo = require('@getbrevo/brevo');

export async function POST(request) {
  console.log('📧 Starting email send process with Brevo...');
  
  const {
    customer_name,
    customer_email,
    phone,
    whatsapp,
    order_id,
    order_date,
    products,
    total_amount,
    governorate,
    city,
    street,
    landmark,
    notes
  } = await request.json();

  console.log('📧 Email will be sent to:', customer_email);

  // Build products HTML for email
  const productsHtml = products.map(p => `
    <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
      <p style="margin: 5px 0;"><strong>${p.name}</strong></p>
      <p style="margin: 5px 0;">Qty: ${p.quantity}</p>
      <p style="margin: 5px 0;">Price: ${p.price} × ${p.quantity} = ${p.total || (p.price * p.quantity)} EGP</p>
    </div>
  `).join('');

  // Customer Email - Thank you message
  const customerEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>🎉 Thank You For Your Order!</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #ff4d6d; text-align: center;">🎉 Thank You For Your Order!</h1>
        <p style="color: #555; text-align: center;">Your order has been received successfully. We will contact you soon!</p>

        <div style="margin-bottom: 20px; background: #fff8f8; padding: 15px; border-radius: 8px;">
          <p style="color: #ff4d6d; text-align: center; font-weight: bold;">📸 Save this email! Take a screenshot of your order.</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #ff4d6d; padding-bottom: 5px;">🧾 Order Receipt</h2>
          <p style="color: #555;"><strong>Order ID:</strong> ${order_id}</p>
          <p style="color: #555;"><strong>Order Date:</strong> ${order_date}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #ff4d6d; padding-bottom: 5px;">👤 Customer Information</h2>
          <p style="color: #555;"><strong>Full Name:</strong> ${customer_name}</p>
          <p style="color: #555;"><strong>Phone:</strong> ${phone}</p>
          <p style="color: #555;"><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p style="color: #555;"><strong>Email:</strong> ${customer_email}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #ff4d6d; padding-bottom: 5px;">📍 Delivery Address</h2>
          <p style="color: #555;"><strong>Governorate:</strong> ${governorate}</p>
          <p style="color: #555;"><strong>City:</strong> ${city}</p>
          <p style="color: #555;"><strong>Street:</strong> ${street}</p>
          <p style="color: #555;"><strong>Landmark:</strong> ${landmark || '-'}</p>
          <p style="color: #555;"><strong>Notes:</strong> ${notes || '-'}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #ff4d6d; padding-bottom: 5px;">📦 Products (${products.length} items)</h2>
          ${productsHtml}
        </div>

        <div style="background: #ff4d6d; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <p style="font-size: 20px; font-weight: bold; margin: 0;">💰 Total: ${total_amount} EGP</p>
        </div>

        <p style="color: #555;">✅ Your order has been confirmed! We will contact you at <strong>${phone}</strong> to confirm delivery details.</p>

        <p style="color: #555;">📧 Contact: <a href="mailto:luqitchycosmetics@gmail.com" style="color: #ff4d6d;">luqitchycosmetics@gmail.com</a></p>

        <div style="text-align: center; margin-top: 20px;">
          <a href="https://luqitchy-cosmetics.vercel.app" style="display: inline-block; padding: 10px 20px; margin: 5px; background-color: #ff4d6d; color: #fff; text-decoration: none; border-radius: 5px;">🏠 Back to Home</a>
          <a href="https://luqitchy-cosmetics.vercel.app" style="display: inline-block; padding: 10px 20px; margin: 5px; background-color: #ff4d6d; color: #fff; text-decoration: none; border-radius: 5px;">🛍️ Shop More</a>
        </div>

        <p style="text-align: center; color: #999; margin-top: 20px;">✨ Luqitchy Cosmetics — Your beauty starts here</p>
      </div>
    </body>
    </html>
  `;

  try {
    // Check if Brevo API key is configured
    if (!process.env.BREVO_API_KEY) {
      console.log('⚠️ BREVO_API_KEY not configured, skipping email send');
      return Response.json({ 
        message: 'Order placed successfully! Email not configured.',
        warning: 'BREVO_API_KEY not set'
      }, { status: 200 });
    }

    // Validate customer email
    if (!customer_email || !customer_email.includes('@')) {
      console.error('📧 Invalid customer email:', customer_email);
      throw new Error('Invalid customer email address');
    }

    // Initialize Brevo API
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'luqitchycosmetics@gmail.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'Luqitchy Cosmetics';

    // Create email object
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `🎉 Order Confirmation - ${order_id} | Luqitchy Cosmetics`;
    sendSmtpEmail.htmlContent = customerEmailHtml;
    sendSmtpEmail.sender = { name: senderName, email: senderEmail };
    sendSmtpEmail.to = [{ email: customer_email, name: customer_name }];
    sendSmtpEmail.replyTo = { email: senderEmail, name: senderName };

    // Send email to customer
    console.log('📧 Sending email to customer via Brevo...');
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('📧 Customer email sent successfully! Message ID:', result.body?.messageId);

    // Send to n8n webhook if configured
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        console.log('🔗 Sending order to n8n...');
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order_id,
            orderDate: order_date,
            customer: {
              name: customer_name,
              email: customer_email,
              phone: phone,
              whatsapp: whatsapp
            },
            shipping: {
              governorate: governorate,
              city: city,
              street: street,
              landmark: landmark,
              notes: notes
            },
            products: products,
            totalAmount: total_amount,
            source: 'Luqitchy Website'
          })
        });
        console.log('🔗 Order sent to n8n successfully!');
      } catch (n8nError) {
        console.error('🔗 n8n Error:', n8nError.message);
      }
    }
    
    return Response.json({ 
      message: 'Email sent successfully',
      messageId: result.body?.messageId
    });
    
  } catch (error) {
    console.error('📧 Email Error:', error);
    console.error('📧 Error message:', error.message);
    
    // Return success anyway so the order goes through
    return Response.json({ 
      message: 'Order placed successfully! Email notification may have failed.',
      warning: 'Email service encountered an issue',
      error: error.message
    }, { status: 200 });
  }
}
