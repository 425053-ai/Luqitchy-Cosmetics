export async function GET() {
  const response = await fetch("https://api.brevo.com/v3/account", {
    method: "GET",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return Response.json({
    status: response.status,
    data,
  });
}
