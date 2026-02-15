import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      paymentMethod,
      amount,
      orderId,
      items,
      customerData,
    } = body;

    if (!paymentMethod || !amount || !orderId || !items || !customerData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Since we only support Vodafone Cash with image upload,
    // no external payment gateway is needed
    if (paymentMethod === 'vodafone') {
      // Vodafone Cash: User will upload payment screenshot
      // No Paymob payment gateway needed
      const response = NextResponse.json({
        success: true,
        paymentType: 'wallet',
        message: 'Vodafone Cash payment ready - waiting for screenshot confirmation',
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Only Vodafone Cash payment method is supported' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
