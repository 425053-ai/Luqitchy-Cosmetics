import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * API endpoint to download the orders Excel file
 * GET /api/downloadOrders
 */
export async function GET(request: NextRequest) {
  try {
    const excelPath = path.join(process.cwd(), 'public', 'data', 'orders.xlsx');

    if (!fs.existsSync(excelPath)) {
      return NextResponse.json(
        { error: 'No orders file found yet. Orders will be created when you receive the first bank transfer.' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = fs.readFileSync(excelPath);

    // Return as downloadable file
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="luqitchy-orders-${new Date().toISOString().split('T')[0]}.xlsx"`,
        'Cache-Control': 'no-cache, no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('❌ Download orders error:', error);
    return NextResponse.json(
      { error: 'Failed to download orders file' },
      { status: 500 }
    );
  }
}
