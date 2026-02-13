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

    // Check file size
    if (transferImage.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image is too large. Please use an image smaller than 2MB.' },
        { status: 413 }
      );
    }

    // Convert image to base64 for storage and transmission
    const buffer = await transferImage.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const mimeType = transferImage.type || 'image/jpeg';

    // Create data URI for email
    const imageDataUri = `data:${mimeType};base64,${base64Image}`;

    // Return success with image data
    return NextResponse.json({
      success: true,
      orderId,
      message: 'Transfer proof received successfully',
      imageData: base64Image,
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

