import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const data = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const productsRows = data.cart.map(item => `
      <tr>
        <td style="padding:8px;border:1px solid #ff66b2;">${item.name}</td>
        <td style="padding:8px;border:1px solid #ff66b2;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border:1px solid #ff66b2;text-align:center;">${item.price}</td>
        <td style="padding:8px;border:1px solid #ff66b2;text-align:center;">${item.price * item.quantity}</td>
      </tr>
    `).join("");

    await transporter.sendMail({
      from: '"Luqitchy Cosmetics 💖" <luqitchycosmetics@gmail.com>',
      to: data.email,
      subject: `Order Confirmation - ${data.orderId}`,
      html: `
        <div style="background:#ffe6f0;padding:20px;font-family:Arial;">
          <div style="max-width:600px;margin:auto;background:#fff0f5;padding:20px;border-radius:15px;">
            <h2 style="color:#ff66b2;text-align:center;">Thank You For Your Order 💖</h2>
            <p><strong>Order ID:</strong> ${data.orderId}</p>

            <table style="width:100%;border-collapse:collapse;margin-top:15px;">
              <thead>
                <tr style="background:#ffb6c1;">
                  <th style="padding:8px;border:1px solid #ff66b2;">Product</th>
                  <th style="padding:8px;border:1px solid #ff66b2;">Qty</th>
                  <th style="padding:8px;border:1px solid #ff66b2;">Price</th>
                  <th style="padding:8px;border:1px solid #ff66b2;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${productsRows}
              </tbody>
            </table>

            <h3 style="text-align:right;color:#ff66b2;">Total: ${data.total} EGP</h3>
          </div>
        </div>
      `
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}
