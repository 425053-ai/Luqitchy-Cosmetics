export async function GET() {
  try {
    const response = await fetch("https://api.brevo.com/v3/account", {
      method: "GET",
      headers: {
        "api-key": "xkeysib-83d40eced1ccb9f90eefCcijrCfZBuqDzBWp3qSrBEZCqBUfQVz4CWGHWF91iaEw-2GNyw9s0wv1KWdqa",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return Response.json({
      status: response.status,
      message: "Brevo API test successful",
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
