import { NextRequest, NextResponse } from 'next/server';
import { fetchBankTransfers, updateTransferStatus } from '@/lib/google-sheets-service';

// GET: Fetch all bank transfer proofs from Google Sheets
export async function GET(request: NextRequest) {
  try {
    const result = await fetchBankTransfers();
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to fetch transfers' }, { status: 500 });
    }
    return NextResponse.json({ success: true, transfers: result.transfers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update transfer status (e.g., confirm payment)
export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }
    const result = await updateTransferStatus(orderId, status);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update status' }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
