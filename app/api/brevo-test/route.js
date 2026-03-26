export async function GET() {
  try {
    const apiKey = (process.env.BREVO_API_KEY || '').trim();
    
    if (!apiKey) {
      return Response.json({
        status: 400,
        message: 'BREVO_API_KEY environment variable not configured',
        error: 'Please set BREVO_API_KEY in your .env.local or Vercel settings',
      });
    }
    
    const response = await fetch("https://api.brevo.com/v3/account", {
      method: "GET",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return Response.json({
      status: response.status,
      message: response.ok ? "Brevo REST API test successful" : "Brevo API key invalid",
      data,
    });
  } catch (err) {
    return Response.json({
      status: 500,
      message: "Error connecting to Brevo API",
      error: err.message,
    });
  }
}
