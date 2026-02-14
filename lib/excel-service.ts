import * as XLSX from 'xlsx';
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
    console.log('🔍 [Excel] Starting Excel save process...');
    console.log('📥 [Excel] Received order data:', {
      order_id: orderData.order_id,
      customer_name: orderData.customer_name,
      total_amount: orderData.total_amount,
    });

    // Use public folder to store the Excel file
    const excelDir = path.join(process.cwd(), 'public', 'data');
    const excelPath = path.join(excelDir, 'orders.xlsx');

    console.log('📂 [Excel] Excel path:', excelPath);

    // Ensure directory exists
    if (!fs.existsSync(excelDir)) {
      console.log('📁 [Excel] Creating directory...');
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

    console.log('✏️ [Excel] Row data prepared:', rowData);

    let workbook: XLSX.WorkBook;
    let worksheet: XLSX.WorkSheet;
    let allData: any[] = [];

    // Check if file exists
    if (fs.existsSync(excelPath)) {
      console.log('📂 [Excel] File exists, loading existing data...');
      // Load existing workbook
      const buffer = fs.readFileSync(excelPath);
      workbook = XLSX.read(buffer, { type: 'buffer' });
      
      if (!workbook.Sheets['Orders']) {
        console.log('⚠️ [Excel] Sheet "Orders" not found, creating new one');
        worksheet = XLSX.utils.json_to_sheet([rowData]);
      } else {
        worksheet = workbook.Sheets['Orders'];

        // Read all existing data
        if (worksheet['!ref']) {
          allData = XLSX.utils.sheet_to_json(worksheet);
          console.log(`📊 [Excel] Found ${allData.length} existing orders`);
        } else {
          console.log('📊 [Excel] No existing data found');
        }

        // Add new row to data
        allData.push(rowData);
        console.log(`➕ [Excel] Adding new order, total will be ${allData.length} orders`);

        // Recreate the worksheet with all data including new row
        worksheet = XLSX.utils.json_to_sheet(allData);
        console.log('✅ [Excel] Worksheet recreated with all orders');
        
        // Apply column width formatting
        const headers = Object.keys(rowData);
        worksheet['!cols'] = headers.map(() => ({ wch: 20 }));
      }
    } else {
      console.log('📝 [Excel] Creating new file...');
      // Create new workbook with headers
      worksheet = XLSX.utils.json_to_sheet([rowData]);
      console.log('✨ [Excel] New worksheet created');

      // Apply better formatting
      const headers = Object.keys(rowData);
      worksheet['!cols'] = headers.map(() => ({ wch: 20 }));

      // Create workbook
      workbook = XLSX.utils.book_new();
      console.log('📚 [Excel] New workbook created');
    }

    // Ensure sheet is in workbook
    if (!workbook.Sheets['Orders']) {
      console.log('📌 [Excel] Appending Orders sheet to workbook');
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    } else {
      console.log('🔄 [Excel] Updating Orders sheet in workbook');
      workbook.Sheets['Orders'] = worksheet;
    }

    // Save workbook using fs.writeFileSync for better Windows/OneDrive compatibility
    console.log('💾 [Excel] Saving file...');
    try {
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      fs.writeFileSync(excelPath, wbout);
      
      // Verify file was written
      if (fs.existsSync(excelPath)) {
        const stats = fs.statSync(excelPath);
        console.log(`✅ [Excel] File saved successfully! Size: ${stats.size} bytes`);
      } else {
        console.error('❌ [Excel] File was not saved!');
        throw new Error('File save verification failed');
      }
    } catch (writeError) {
      console.error('❌ [Excel] File write error:', writeError);
      throw writeError;
    }

    console.log(`✅ Order ${orderData.order_id} saved to Excel successfully`);
    return {
      success: true,
      message: 'Order saved to Excel successfully',
    };
  } catch (error) {
    console.error('❌ Excel save error:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save to Excel',
    };
  }
}
