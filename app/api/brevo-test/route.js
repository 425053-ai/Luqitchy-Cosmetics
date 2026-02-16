export async function GET() {
  try {
    const apiKey = (process.env.BREVO_API_KEY || 'xkeysib-83d40eced1ccb9f90eefCcijrCfZBuqDzBWp3qSrBEZCqBUfQVz4CWGHWF91iaEw-ztZJxwlXa58vP67T').trim();
    
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
