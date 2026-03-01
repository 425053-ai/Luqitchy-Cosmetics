/**
 * Google Sheets Service - sends order data to Google Sheets via Apps Script webhook
 * Works from both localhost and Vercel (mobile + desktop)
 */

const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() || '';

const GOOGLE_SHEETS_CONFIG_ERROR =
  'Google Sheets webhook misconfigured. Deploy Apps Script as Web App (Anyone) and set GOOGLE_SHEETS_WEBHOOK_URL to the /exec URL.';

function isLikelyAppsScriptUrl(rawUrl: string): boolean {
  if (!rawUrl || rawUrl.includes('your-deployment-id')) {
    return false;
  }

  try {
    const parsed = new URL(rawUrl);
    const isGoogleHost = parsed.hostname === 'script.google.com' || parsed.hostname.endsWith('.script.google.com');
    const isExecPath = /\/macros\/s\/.+\/exec\/?$/.test(parsed.pathname);
    return isGoogleHost && isExecPath;
  } catch {
    return false;
  }
}

function normalizeWebhookUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return trimmed;
  }
}

function classifyNonJsonResponse(contentType: string, text: string): 'html-access' | 'html-other' | 'non-json' {
  const snippet = text.substring(0, 1200).toLowerCase();
  const isHtml = contentType.includes('text/html') || /<!doctype html>|<html/i.test(snippet);

  if (!isHtml) {
    return 'non-json';
  }

  const accessDeniedMarkers = [
    'request access',
    'you need access',
    'access denied',
    'signin',
    'log in',
    'يجب طلب الإذن بالوصول',
    'يمكنك فتح المستند',
    'تم رفض الدخول',
  ];

  return accessDeniedMarkers.some((marker) => snippet.includes(marker)) ? 'html-access' : 'html-other';
}

interface OrderRow {
  order_id: string;
  date: string;
  customer_name: string;
  phone: string;
  email: string;
  product: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  governorate: string;
  city: string;
  street: string;
  landmark: string;
  notes: string;
  payment_method: string;
  status: string;
}

/**
 * Fetch all orders from Google Sheets (via Apps Script doGet)
 */
export async function fetchOrdersFromGoogleSheets(): Promise<{ success: boolean; orders?: OrderRow[]; error?: string }> {
  try {
    console.log('📊 [Google Sheets] Fetching all orders...');

    const webhookUrl = normalizeWebhookUrl(GOOGLE_SHEETS_WEBHOOK_URL);
    if (!isLikelyAppsScriptUrl(webhookUrl)) {
      console.error('❌ [Google Sheets] Invalid webhook URL format:', webhookUrl);
      return { success: true, orders: [], error: GOOGLE_SHEETS_CONFIG_ERROR };
    }
    
    const response = await fetch(`${webhookUrl}?action=getOrders`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    const text = await response.text();
    const contentType = response.headers.get('content-type') || '';
    console.log('📊 [Google Sheets] Fetch response status:', response.status);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const snippet = text.substring(0, 200).replace(/\s+/g, ' ');
      const responseType = classifyNonJsonResponse(contentType, text);

      if (responseType === 'html-access') {
        console.warn('⚠️ [Google Sheets] Access-restricted HTML response from Apps Script. Returning empty orders safely.');
        return { success: true, orders: [], error: GOOGLE_SHEETS_CONFIG_ERROR };
      }

      if (responseType === 'html-other') {
        console.warn('⚠️ [Google Sheets] HTML response from webhook (unexpected). Returning empty orders safely.');
        return { success: true, orders: [], error: 'Google Sheets returned HTML instead of JSON' };
      }

      console.warn('⚠️ [Google Sheets] Non-JSON response. Returning empty orders safely. Snippet:', snippet);
      return { success: true, orders: [], error: 'Invalid response from Google Sheets' };
    }

    if (data.success !== false && data.orders) {
      console.log(`✅ [Google Sheets] Fetched ${data.orders.length} orders`);
      return { success: true, orders: data.orders };
    } else if (data.success !== false && Array.isArray(data)) {
      console.log(`✅ [Google Sheets] Fetched ${data.length} orders`);
      return { success: true, orders: data };
    } else {
      console.error('❌ [Google Sheets] Fetch error:', data.error);
      return { success: false, error: data.error || 'Failed to fetch orders' };
    }
  } catch (error: any) {
    console.error('❌ [Google Sheets] Fetch exception:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Save a single product order to Google Sheets
 */
export async function saveOrderToGoogleSheets(orderData: {
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
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('📊 [Google Sheets] Saving single order:', orderData.order_id);

    const webhookUrl = normalizeWebhookUrl(GOOGLE_SHEETS_WEBHOOK_URL);
    if (!isLikelyAppsScriptUrl(webhookUrl)) {
      console.error('❌ [Google Sheets] Invalid webhook URL format:', webhookUrl);
      return { success: false, error: GOOGLE_SHEETS_CONFIG_ERROR };
    }

    const row: OrderRow = {
      order_id: orderData.order_id,
      date: orderData.order_date,
      customer_name: orderData.customer_name,
      phone: orderData.phone,
      email: orderData.customer_email,
      product: orderData.product_name,
      quantity: orderData.quantity,
      unit_price: orderData.price,
      total_amount: orderData.total_amount,
      governorate: orderData.governorate,
      city: orderData.city,
      street: orderData.street,
      landmark: orderData.landmark || '',
      notes: orderData.notes || '',
      payment_method: orderData.payment_method,
      status: orderData.status || 'Pending',
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });

    // Google Apps Script returns 302 redirect on success, follow it
    const text = await response.text();
    console.log('📊 [Google Sheets] Response status:', response.status);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const responseType = classifyNonJsonResponse(response.headers.get('content-type') || '', text);
      if (responseType === 'html-access') {
        console.error('❌ [Google Sheets] Access denied HTML response while saving order.');
        return { success: false, error: GOOGLE_SHEETS_CONFIG_ERROR };
      }

      if (responseType === 'html-other') {
        console.warn('⚠️ [Google Sheets] Non-JSON HTML response while saving order, treating as success fallback.');
        data = { success: true };
      } else {
        console.warn('⚠️ [Google Sheets] Non-JSON response while saving order, treating as success fallback.');
        data = { success: true };
      }
    }

    if (data.success !== false) {
      console.log('✅ [Google Sheets] Order saved successfully!');
      return { success: true };
    } else {
      console.error('❌ [Google Sheets] Error:', data.error);
      return { success: false, error: data.error };
    }
  } catch (error: any) {
    console.error('❌ [Google Sheets] Exception:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Save a cart order (multiple products) to Google Sheets
 */
export async function saveBulkOrderToGoogleSheets(bulkOrderData: {
  order_id: string;
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
  products: { name: string; quantity: number; price: number }[];
  total_amount: number;
  status?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('📊 [Google Sheets] Saving bulk order:', bulkOrderData.order_id, `(${bulkOrderData.products.length} products)`);

    const webhookUrl = normalizeWebhookUrl(GOOGLE_SHEETS_WEBHOOK_URL);
    if (!isLikelyAppsScriptUrl(webhookUrl)) {
      console.error('❌ [Google Sheets] Invalid webhook URL format:', webhookUrl);
      return { success: false, error: GOOGLE_SHEETS_CONFIG_ERROR };
    }

    const rows: OrderRow[] = bulkOrderData.products.map((product) => ({
      order_id: bulkOrderData.order_id,
      date: bulkOrderData.order_date,
      customer_name: bulkOrderData.customer_name,
      phone: bulkOrderData.phone,
      email: bulkOrderData.customer_email,
      product: product.name,
      quantity: product.quantity,
      unit_price: product.price,
      total_amount: product.quantity * product.price,
      governorate: bulkOrderData.governorate,
      city: bulkOrderData.city,
      street: bulkOrderData.street,
      landmark: bulkOrderData.landmark || '',
      notes: bulkOrderData.notes || '',
      payment_method: bulkOrderData.payment_method,
      status: bulkOrderData.status || 'Pending',
    }));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows }),
    });

    const text = await response.text();
    console.log('📊 [Google Sheets] Response status:', response.status);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const responseType = classifyNonJsonResponse(response.headers.get('content-type') || '', text);
      if (responseType === 'html-access') {
        console.error('❌ [Google Sheets] Access denied HTML response while saving bulk order.');
        return { success: false, error: GOOGLE_SHEETS_CONFIG_ERROR };
      }

      if (responseType === 'html-other') {
        console.warn('⚠️ [Google Sheets] Non-JSON HTML response while saving bulk order, treating as success fallback.');
        data = { success: true };
      } else {
        console.warn('⚠️ [Google Sheets] Non-JSON response while saving bulk order, treating as success fallback.');
        data = { success: true };
      }
    }

    if (data.success !== false) {
      console.log(`✅ [Google Sheets] Bulk order saved! (${rows.length} rows)`);
      return { success: true };
    } else {
      console.error('❌ [Google Sheets] Error:', data.error);
      return { success: false, error: data.error };
    }
  } catch (error: any) {
    console.error('❌ [Google Sheets] Exception:', error.message);
    return { success: false, error: error.message };
  }
}
