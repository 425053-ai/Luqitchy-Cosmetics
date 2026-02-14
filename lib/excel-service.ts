import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

interface OrderData {
  order_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total_amount: number;
  customer_name: string;
  phone: string;
  customer_email: string;
  governorate: string;
  city: string;
  street: string;
  landmark: string;
  notes: string;
  payment_method: string;
  order_date: string;
  status?: string;
}

export async function saveOrderToExcel(orderData: OrderData) {
  try {
    // Use public folder to store the Excel file
    const excelDir = path.join(process.cwd(), 'public', 'data');
    const excelPath = path.join(excelDir, 'orders.xlsx');

    // Ensure directory exists
    if (!fs.existsSync(excelDir)) {
      fs.mkdirSync(excelDir, { recursive: true });
    }

    // Prepare row data
    const rowData = {
      'Order ID': orderData.order_id,
      'Date': orderData.order_date,
      'Customer Name': orderData.customer_name,
      'Phone': orderData.phone,
      'Email': orderData.customer_email,
      'Product': orderData.product_name,
      'Quantity': orderData.quantity,
      'Unit Price': orderData.price,
      'Total Amount': orderData.total_amount,
      'Governorate': orderData.governorate,
      'City': orderData.city,
      'Street': orderData.street,
      'Landmark': orderData.landmark,
      'Notes': orderData.notes,
      'Payment Method': orderData.payment_method,
      'Status': orderData.status || 'Pending',
    };

    let workbook: XLSX.WorkBook;
    let worksheet: XLSX.WorkSheet;

    // Check if file exists
    if (fs.existsSync(excelPath)) {
      // Load existing workbook
      const buffer = fs.readFileSync(excelPath);
      workbook = XLSX.read(buffer, { type: 'buffer' });
      worksheet = workbook.Sheets['Orders'];

      // Get current row count
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      const nextRow = range.e.r + 2; // +2 because rows are 0-indexed

      // Add new row
      XLSX.utils.sheet_add_json(worksheet, [rowData], {
        origin: `A${nextRow}`,
        header: 'A',
      });
    } else {
      // Create new workbook with headers
      const newWorksheet = XLSX.utils.json_to_sheet([rowData], {
        header: 1,
      });

      // Apply better formatting
      const headers = Object.keys(rowData);
      newWorksheet['!cols'] = headers.map(() => ({ wch: 20 }));

      // Create workbook
      workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, newWorksheet, 'Orders');
    }

    // Save workbook
    XLSX.writeFile(workbook, excelPath);

    console.log(`✅ Order ${orderData.order_id} saved to Excel`);
    return {
      success: true,
      message: 'Order saved to Excel successfully',
    };
  } catch (error) {
    console.error('❌ Excel save error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save to Excel',
    };
  }
}
