import nodemailer from 'nodemailer';

export async function POST(request) {
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

  // Admin Email - New Order Alert (different from customer email)
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>🚨 NEW ORDER ALERT!</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #1a1a2e; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #16213e; padding: 20px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); border: 2px solid #e94560;">
        
        <div style="background: linear-gradient(135deg, #e94560, #ff4d6d); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #fff; text-align: center; margin: 0;">🚨 NEW ORDER RECEIVED!</h1>
          <p style="color: #fff; text-align: center; font-size: 14px; margin: 10px 0 0 0;">A new order just came in - Action Required!</p>
        </div>

        <div style="background: #0f3460; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #e94560;">
          <h2 style="color: #e94560; margin: 0 0 10px 0;">📋 Order Summary</h2>
          <table style="width: 100%; color: #fff;">
            <tr><td style="padding: 5px 0; color: #aaa;">Order ID:</td><td style="padding: 5px 0; font-weight: bold;">${order_id}</td></tr>
            <tr><td style="padding: 5px 0; color: #aaa;">Order Date:</td><td style="padding: 5px 0;">${order_date}</td></tr>
            <tr><td style="padding: 5px 0; color: #aaa;">Total Items:</td><td style="padding: 5px 0;">${products.length} products</td></tr>
          </table>
        </div>

        <div style="background: #0f3460; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00d9ff;">
          <h2 style="color: #00d9ff; margin: 0 0 10px 0;">👤 Customer Details</h2>
          <table style="width: 100%; color: #fff;">
            <tr><td style="padding: 5px 0; color: #aaa;">Name:</td><td style="padding: 5px 0; font-weight: bold;">${customer_name}</td></tr>
            <tr><td style="padding: 5px 0; color: #aaa;">Phone:</td><td style="padding: 5px 0;"><a href="tel:${phone}" style="color: #00d9ff;">${phone}</a></td></tr>
            <tr><td style="padding: 5px 0; color: #aaa;">WhatsApp:</td><td style="padding: 5px 0;"><a href="https://wa.me/${whatsapp?.replace(/[^0-9]/g, '')}" style="color: #25d366;">${whatsapp}</a></td></tr>
            <tr><td style="padding: 5px 0; color: #aaa;">Email:</td><td style="padding: 5px 0;"><a href="mailto:${customer_email}" style="color: #00d9ff;">${customer_email}</a></td></tr>
          </table>
        </div>

        <div style="background: #0f3460; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffd700;">
          <h2 style="color: #ffd700; margin: 0 0 10px 0;">📍 Shipping Address</h2>
          <table style="width: 100%; color: #fff;">
            <tr><td style="padding: 5px 0; color: #aaa;">Governorate:</td><td style="padding: 5px 0;">${governorate}</td></tr>
            <tr><td style="padding: 5px 0; color: #aaa;">City:</td><td style="padding: 5px 0;">${city}</td></tr>
            <tr><td style="padding: 5px 0; color: #aaa;">Street:</td><td style="padding: 5px 0;">${street}</td></tr>
            <tr><td style="padding: 5px 0; color: #aaa;">Landmark:</td><td style="padding: 5px 0;">${landmark || 'Not provided'}</td></tr>
            <tr><td style="padding: 5px 0; color: #aaa;">Notes:</td><td style="padding: 5px 0;">${notes || 'No notes'}</td></tr>
          </table>
        </div>

        <div style="background: #0f3460; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ff4d6d;">
          <h2 style="color: #ff4d6d; margin: 0 0 15px 0;">📦 Ordered Products</h2>
          ${products.map(p => `
            <div style="background: #16213e; padding: 10px; border-radius: 5px; margin-bottom: 10px; border: 1px solid #333;">
              <p style="color: #fff; margin: 0 0 5px 0; font-weight: bold;">🛍️ ${p.name}</p>
              <p style="color: #aaa; margin: 0; font-size: 14px;">Quantity: ${p.quantity} × ${p.price} EGP = <span style="color: #00d9ff; font-weight: bold;">${p.total || (p.price * p.quantity)} EGP</span></p>
            </div>
          `).join('')}
        </div>

        <div style="background: linear-gradient(135deg, #00d9ff, #0f3460); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <p style="color: #fff; font-size: 14px; margin: 0;">TOTAL AMOUNT</p>
          <p style="color: #fff; font-size: 32px; font-weight: bold; margin: 10px 0 0 0;">💰 ${total_amount} EGP</p>
        </div>

        <div style="text-align: center; padding: 15px;">
          <a href="https://wa.me/${whatsapp?.replace(/[^0-9]/g, '')}" style="display: inline-block; padding: 12px 25px; margin: 5px; background-color: #25d366; color: #fff; text-decoration: none; border-radius: 25px; font-weight: bold;">💬 Contact on WhatsApp</a>
          <a href="tel:${phone}" style="display: inline-block; padding: 12px 25px; margin: 5px; background-color: #e94560; color: #fff; text-decoration: none; border-radius: 25px; font-weight: bold;">📞 Call Customer</a>
        </div>

        <p style="text-align: center; color: #666; margin-top: 20px; font-size: 12px;">📊 Luqitchy Cosmetics Admin Dashboard</p>
      </div>
    </body>
    </html>
  `;

  try {
    console.log('Sending email with Gmail SMTP...');
    console.log('Sending to:', customer_email);
    
    // Create transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Send email to customer
    await transporter.sendMail({
      from: `"Luqitchy Cosmetics 💄" <${process.env.GMAIL_USER}>`,
      to: customer_email,
      subject: `🎉 Order Confirmation - ${order_id}`,
      html: customerEmailHtml
    });

    // Also send notification to admin (different email template)
    await transporter.sendMail({
      from: `"Luqitchy Orders 📦" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `🚨 NEW ORDER - ${order_id} - ${customer_name} - ${total_amount} EGP`,
      html: adminEmailHtml
    });

    console.log('Email sent successfully!');
    return Response.json({ message: 'Email sent successfully' });
    
  } catch (error) {
    console.error('Email Error:', error);
    // Still return success - order was placed, just email failed
    return Response.json({ 
      message: 'Order placed successfully! (Email notification pending)',
      warning: 'Email service temporarily unavailable',
      error: error.message
    }, { status: 200 });
  }
}
