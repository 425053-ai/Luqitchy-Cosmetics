export async function GET() {
  return Response.json({
    exists: !!process.env.BREVO_API_KEY,
    valuePreview: process.env.BREVO_API_KEY?.substring(0, 12)
  });
}
