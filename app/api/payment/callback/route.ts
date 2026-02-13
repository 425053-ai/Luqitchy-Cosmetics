import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET!;

// This handles the server-to-server callback from Paymob
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { obj, hmac } = body;

    if (!obj || !hmac) {
      return NextResponse.json({ error: 'Invalid callback data' }, { status: 400 });
    }

    // Verify HMAC
    const concatenatedString = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      obj.order?.id || obj.order,
      obj.owner,
      obj.pending,
      obj.source_data?.pan || '',
      obj.source_data?.sub_type || '',
      obj.source_data?.type || '',
      obj.success,
    ].join('');

    const calculatedHMAC = crypto
      .createHmac('sha512', PAYMOB_HMAC_SECRET)
      .update(concatenatedString)
      .digest('hex');

    if (calculatedHMAC !== hmac) {
      console.error('HMAC verification failed');
      return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 });
    }

    // Payment verified
    const isSuccess = obj.success === true || obj.success === 'true';
    const orderId = obj.order?.merchant_order_id || obj.merchant_order_id;
    const transactionId = obj.id;
    const amountCents = obj.amount_cents;

    console.log('Payment callback received:', {
      success: isSuccess,
      orderId,
      transactionId,
      amountCents,
    });

    if (isSuccess) {
      // Payment successful - you can trigger order confirmation here
      // For example: send Telegram notification, update database, etc.
      console.log('✅ Payment successful for order:', orderId);
    } else {
      console.log('❌ Payment failed for order:', orderId);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle GET for browser redirect after payment
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Paymob redirects with these params
  const success = searchParams.get('success');
  const txnResponseCode = searchParams.get('txn_response_code');
  const orderId = searchParams.get('merchant_order_id') || searchParams.get('order');
  const transactionId = searchParams.get('id');
  const amountCents = searchParams.get('amount_cents');
  const hmac = searchParams.get('hmac');

  // Verify the transaction (simplified for redirect)
  const isSuccess = success === 'true' && txnResponseCode === 'APPROVED';

  // Build redirect URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUrl = new URL('/payment/result', baseUrl);
  
  redirectUrl.searchParams.set('success', isSuccess ? 'true' : 'false');
  if (orderId) redirectUrl.searchParams.set('orderId', orderId);
  if (transactionId) redirectUrl.searchParams.set('transactionId', transactionId);
  if (amountCents) redirectUrl.searchParams.set('amount', String(Number(amountCents) / 100));

  return NextResponse.redirect(redirectUrl.toString());
}
