import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { fetchOrdersFromGoogleSheets } from '@/lib/google-sheets-service';

/**
 * API endpoint to download the orders Excel file
 * Fetches orders from Google Sheets and generates a fresh Excel file
 * Works from Vercel (production) and localhost (development)
 * GET /api/downloadOrders
 */
export async function GET(request: NextRequest) {
  try {
    console.log('📥 [Download] Fetching orders from Google Sheets...');
    
    // Fetch orders from Google Sheets
    const result = await fetchOrdersFromGoogleSheets();
    
    if (!result.success || !result.orders || result.orders.length === 0) {
      return NextResponse.json(
        { error: 'لا توجد طلبات بعد. الطلبات ستظهر عندما يطلب أول عميل.' },
        { status: 404 }
      );
    }

    console.log(`📊 [Download] Building Excel with ${result.orders.length} rows...`);

    // Format rows for Excel
    const excelRows = result.orders.map((order) => ({
      'Order ID': order.order_id || '',
      'Date': order.date || '',
      'Customer Name': order.customer_name || '',
      'Phone': order.phone || '',
      'Email': order.email || '',
      'Product': order.product || '',
      'Quantity': order.quantity || 0,
      'Unit Price': order.unit_price || 0,
      'Total Amount': order.total_amount || 0,
      'Governorate': order.governorate || '',
      'City': order.city || '',
      'Street': order.street || '',
      'Landmark': order.landmark || '',
      'Notes': order.notes || '',
      'Payment Method': order.payment_method || '',
      'Status': order.status || 'Pending',
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    // Set column widths
    worksheet['!cols'] = Object.keys(excelRows[0]).map((key) => ({
      wch: Math.max(key.length, 18),
    }));

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    // Generate buffer
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    const today = new Date().toISOString().split('T')[0];
    console.log(`✅ [Download] Excel generated: ${excelRows.length} orders, ${buffer.length} bytes`);

    // Return as downloadable file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Luqitchy-Orders-${today}.xlsx"`,
        'Cache-Control': 'no-cache, no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('❌ Download orders error:', error);
    return NextResponse.json(
      { error: 'فشل تنزيل ملف الطلبات' },
      { status: 500 }
    );
  }
}
