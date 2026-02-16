/**
 * Google Apps Script for Luqitchy Cosmetics - Order Management
 * 
 * ===== HOW TO SET UP =====
 * 
 * 1. Go to: https://script.google.com
 * 2. Create a new project (or open your existing one)
 * 3. Replace ALL the code with this file's content
 * 4. Click "Deploy" > "New deployment"
 * 5. Type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Click "Deploy" and copy the URL
 * 9. Set the URL as GOOGLE_SHEETS_WEBHOOK_URL in your Vercel environment variables
 * 10. If you already have a deployment, click "Deploy" > "Manage deployments" > 
 *     Edit (pencil icon) > "New version" > Deploy 
 *
 * ===== IMPORTANT =====
 * Every time you change this script, you MUST create a NEW VERSION deployment.
 * Just clicking "Deploy" with the same version will NOT update the code.
 * =====================
 */

// ========== CONFIGURATION ==========
const SHEET_NAME = 'Orders'; // Name of the sheet tab

// ========== doPost: Receive new orders ==========
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Handle bulk order (cart with multiple products)
    if (data.rows && Array.isArray(data.rows)) {
      data.rows.forEach(function(row) {
        appendOrderRow(sheet, row);
      });
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, message: 'Bulk order saved', count: data.rows.length })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Handle single product order
    appendOrderRow(sheet, data);
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Order saved' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ========== doGet: Fetch all orders ==========
function doGet(e) {
  try {
    var action = e.parameter.action || 'getOrders';
    
    if (action === 'getOrders') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      
      if (!sheet) {
        return ContentService.createTextOutput(
          JSON.stringify({ success: true, orders: [] })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      var data = sheet.getDataRange().getValues();
      
      if (data.length <= 1) {
        // Only headers, no data
        return ContentService.createTextOutput(
          JSON.stringify({ success: true, orders: [] })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      var headers = data[0];
      var orders = [];
      
      for (var i = 1; i < data.length; i++) {
        var row = {};
        for (var j = 0; j < headers.length; j++) {
          var header = headers[j].toString().toLowerCase().replace(/\s+/g, '_');
          row[header] = data[i][j];
        }
        // Map to standard field names
        orders.push({
          order_id: row['order_id'] || row['order id'] || '',
          date: row['date'] || '',
          customer_name: row['customer_name'] || row['customer name'] || '',
          phone: row['phone'] || '',
          email: row['email'] || '',
          product: row['product'] || '',
          quantity: Number(row['quantity']) || 0,
          unit_price: Number(row['unit_price'] || row['unit price']) || 0,
          total_amount: Number(row['total_amount'] || row['total amount']) || 0,
          governorate: row['governorate'] || '',
          city: row['city'] || '',
          street: row['street'] || '',
          landmark: row['landmark'] || '',
          notes: row['notes'] || '',
          payment_method: row['payment_method'] || row['payment method'] || '',
          status: row['status'] || 'Pending'
        });
      }
      
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, orders: orders })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: 'Unknown action' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ========== Helper Functions ==========

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add headers
    var headers = [
      'Order ID', 'Date', 'Customer Name', 'Phone', 'Email',
      'Product', 'Quantity', 'Unit Price', 'Total Amount',
      'Governorate', 'City', 'Street', 'Landmark',
      'Notes', 'Payment Method', 'Status'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

function appendOrderRow(sheet, data) {
  var row = [
    data.order_id || '',
    data.date || new Date().toLocaleString('en-EG'),
    data.customer_name || '',
    data.phone || '',
    data.email || '',
    data.product || '',
    Number(data.quantity) || 0,
    Number(data.unit_price) || 0,
    Number(data.total_amount) || 0,
    data.governorate || '',
    data.city || '',
    data.street || '',
    data.landmark || '',
    data.notes || '',
    data.payment_method || '',
    data.status || 'Pending'
  ];
  
  sheet.appendRow(row);
}
