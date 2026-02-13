import { NextRequest, NextResponse } from 'next/server';
import { initiateCardPayment, initiateWalletPayment, initiatePayPalPayment, initiateCashCollectionPayment, initiateKioskPayment } from '@/lib/paymob';

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

    // Store order data in temporary storage (will be confirmed after payment)
    // In production, you might want to use Redis or database
    const orderData = {
      orderId,
      items,
      amount,
      customerData,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage via cookie for retrieval after payment
    const orderDataEncoded = Buffer.from(JSON.stringify(orderData)).toString('base64');

    if (paymentMethod === 'visa') {
      // Card payment - returns iframe URL
      const iframeUrl = await initiateCardPayment(
        amount,
        orderId,
        items,
        customerData
      );

      const response = NextResponse.json({
        success: true,
        paymentUrl: iframeUrl,
        paymentType: 'card',
      });

      // Set cookie with order data (expires in 1 hour)
      response.cookies.set('pending_order', orderDataEncoded, {
        maxAge: 3600,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;

    } else if (paymentMethod === 'vodafone') {
      // Wallet payment - returns redirect URL
      const { redirectUrl } = await initiateWalletPayment(
        amount,
        orderId,
        items,
        customerData
      );

      const response = NextResponse.json({
        success: true,
        paymentUrl: redirectUrl,
        paymentType: 'wallet',
      });

      // Set cookie with order data
      response.cookies.set('pending_order', orderDataEncoded, {
        maxAge: 3600,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;

    } else if (paymentMethod === 'paypal') {
      // PayPal payment - returns iframe URL
      const iframeUrl = await initiatePayPalPayment(
        amount,
        orderId,
        items,
        customerData
      );

      const response = NextResponse.json({
        success: true,
        paymentUrl: iframeUrl,
        paymentType: 'paypal',
      });

      // Set cookie with order data
      response.cookies.set('pending_order', orderDataEncoded, {
        maxAge: 3600,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;

    } else if (paymentMethod === 'cashcollection') {
      // Cash Collection payment (Aman, Masary) - returns bill reference
      const { billReference, message, isRealBillRef } = await initiateCashCollectionPayment(
        amount,
        orderId,
        items,
        customerData
      );

      const response = NextResponse.json({
        success: true,
        billReference,
        message,
        isRealBillRef,
        paymentType: 'cashcollection',
      });

      // Set cookie with order data
      response.cookies.set('pending_order', orderDataEncoded, {
        maxAge: 86400, // 24 hours for cash collection
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;

    } else if (paymentMethod === 'kiosk') {
      // Kiosk payment (Fawry) - returns bill reference
      const { billReference, message, isRealBillRef } = await initiateKioskPayment(
        amount,
        orderId,
        items,
        customerData
      );

      const response = NextResponse.json({
        success: true,
        billReference,
        message,
        isRealBillRef,
        paymentType: 'kiosk',
      });

      // Set cookie with order data
      response.cookies.set('pending_order', orderDataEncoded, {
        maxAge: 86400, // 24 hours for kiosk payment
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;

    } else {
      return NextResponse.json(
        { error: 'Invalid payment method' },
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
