import { NextRequest, NextResponse } from 'next/server';

// Bank Transfer API - Handles proof of transfer image uploads
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const orderId = formData.get('orderId') as string;
    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const phone = formData.get('phone') as string;
    const amount = formData.get('amount') as string;
    const bankName = formData.get('bankName') as string;
    const transferImage = formData.get('transferImage') as File;

    if (!orderId || !customerName || !customerEmail || !phone || !amount || !transferImage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Accept images up to 10MB (Vercel limit is ~4.5MB for request, but we only need to store metadata)
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (transferImage.size > maxSize) {
      return NextResponse.json(
        { error: 'Image is too large. Please use an image smaller than 10MB.' },
        { status: 413 }
      );
    }

    // Convert image to base64 ONLY if size is reasonable (< 2MB for safe transmission)
    const buffer = await transferImage.arrayBuffer();
    const mimeType = transferImage.type || 'image/jpeg';
    
    let base64Image = '';
    // Only convert to base64 if under 2MB (to avoid Vercel payload limits)
    if (buffer.byteLength < 2 * 1024 * 1024) {
      base64Image = Buffer.from(buffer).toString('base64');
    }

    // Return success with image data
    return NextResponse.json({
      success: true,
      orderId,
      message: 'Transfer proof received successfully',
      imageData: base64Image,
      imageSize: buffer.byteLength,
      mimeType,
      transferData: {
        orderId,
        customerName,
        customerEmail,
        phone,
        amount,
        bankName,
        uploadedAt: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Bank Transfer Error:', error);
    return NextResponse.json(
      { error: 'Failed to process bank transfer. Please try again or contact support.' },
      { status: 500 }
    );
  }
}

