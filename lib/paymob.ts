// Paymob Payment Gateway Integration
// Documentation: https://docs.paymob.com/docs/accept-standard-redirect

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY!;
const PAYMOB_CARD_INTEGRATION_ID = process.env.PAYMOB_CARD_INTEGRATION_ID!;
const PAYMOB_WALLET_INTEGRATION_ID = process.env.PAYMOB_WALLET_INTEGRATION_ID!;
const PAYMOB_PAYPAL_INTEGRATION_ID = process.env.PAYMOB_PAYPAL_INTEGRATION_ID!;
const PAYMOB_CASH_COLLECTION_INTEGRATION_ID = process.env.PAYMOB_CASH_COLLECTION_INTEGRATION_ID!;
const PAYMOB_KIOSK_INTEGRATION_ID = process.env.PAYMOB_KIOSK_INTEGRATION_ID!;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID!;
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET!;

interface PaymobAuthResponse {
  token: string;
}

interface OrderItem {
  name: string;
  amount_cents: number;
  quantity: number;
}

interface PaymobOrderResponse {
  id: number;
  created_at: string;
  delivery_needed: boolean;
  merchant: { id: number };
  amount_cents: number;
}

interface PaymentKeyResponse {
  token: string;
}

interface BillingData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  apartment?: string;
  floor?: string;
  building?: string;
}

// Step 1: Get Authentication Token
export async function getPaymobAuthToken(): Promise<string> {
  console.log('Paymob Auth: Starting authentication...');
  
  if (!PAYMOB_API_KEY) {
    throw new Error('PAYMOB_API_KEY is not configured');
  }
  
  const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Paymob Auth Error:', errorData);
    throw new Error(`Failed to authenticate with Paymob: ${JSON.stringify(errorData)}`);
  }

  const data: PaymobAuthResponse = await response.json();
  console.log('Paymob Auth: Success');
  return data.token;
}

// Step 2: Create Order
export async function createPaymobOrder(
  authToken: string,
  amountCents: number,
  items: OrderItem[],
  merchantOrderId: string
): Promise<number> {
  const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: 'EGP',
      merchant_order_id: merchantOrderId,
      items: items,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create Paymob order');
  }

  const data: PaymobOrderResponse = await response.json();
  return data.id;
}

// Step 3: Get Payment Key
export async function getPaymentKey(
  authToken: string,
  orderId: number,
  amountCents: number,
  billingData: BillingData,
  integrationId: string
): Promise<string> {
  console.log('Paymob Payment Key: Starting...', { orderId, amountCents, integrationId });
  
  if (!integrationId) {
    throw new Error('Integration ID is not configured');
  }
  
  const requestBody = {
    auth_token: authToken,
    amount_cents: amountCents,
    expiration: 3600,
    order_id: orderId,
    billing_data: {
      ...billingData,
      country: 'EG',
      postal_code: 'NA',
      building: billingData.building || 'NA',
      floor: billingData.floor || 'NA',
      apartment: billingData.apartment || 'NA',
    },
    currency: 'EGP',
    integration_id: parseInt(integrationId),
    lock_order_when_paid: true,
  };
  
  const response = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    console.error('Payment key error:', error);
    console.error('Request was:', { orderId, amountCents, integrationId, billingData });
    throw new Error(`Failed to get payment key: ${error.message || error.detail || JSON.stringify(error)}`);
  }

  const data: PaymentKeyResponse = await response.json();
  console.log('Paymob Payment Key: Success');
  return data.token;
}

// Main function to initiate card payment
export async function initiateCardPayment(
  amountEGP: number,
  orderId: string,
  items: { name: string; price: number; quantity: number }[],
  customerData: {
    fullName: string;
    email: string;
    phone: string;
    governorate: string;
    city: string;
    streetAddress: string;
  }
): Promise<string> {
  // Convert to cents
  const amountCents = Math.round(amountEGP * 100);

  // Format items for Paymob
  const paymobItems: OrderItem[] = items.map(item => ({
    name: item.name,
    amount_cents: Math.round(item.price * 100),
    quantity: item.quantity,
  }));

  // Parse name
  const nameParts = customerData.fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || 'Customer';

  const billingData: BillingData = {
    first_name: firstName,
    last_name: lastName,
    email: customerData.email,
    phone_number: customerData.phone,
    street: customerData.streetAddress,
    city: customerData.city,
    state: customerData.governorate,
    country: 'EG',
    postal_code: 'NA',
  };

  // Step 1: Auth
  const authToken = await getPaymobAuthToken();

  // Step 2: Create Order
  const paymobOrderId = await createPaymobOrder(authToken, amountCents, paymobItems, orderId);

  // Step 3: Get Payment Key
  const paymentKey = await getPaymentKey(
    authToken,
    paymobOrderId,
    amountCents,
    billingData,
    PAYMOB_CARD_INTEGRATION_ID
  );

  // Return iframe URL for card payment
  return `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
}

// Main function to initiate wallet payment (Vodafone Cash)
export async function initiateWalletPayment(
  amountEGP: number,
  orderId: string,
  items: { name: string; price: number; quantity: number }[],
  customerData: {
    fullName: string;
    email: string;
    phone: string;
    governorate: string;
    city: string;
    streetAddress: string;
  }
): Promise<{ redirectUrl: string }> {
  // Convert to cents
  const amountCents = Math.round(amountEGP * 100);

  // Format items for Paymob
  const paymobItems: OrderItem[] = items.map(item => ({
    name: item.name,
    amount_cents: Math.round(item.price * 100),
    quantity: item.quantity,
  }));

  // Parse name
  const nameParts = customerData.fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || 'Customer';

  const billingData: BillingData = {
    first_name: firstName,
    last_name: lastName,
    email: customerData.email,
    phone_number: customerData.phone,
    street: customerData.streetAddress,
    city: customerData.city,
    state: customerData.governorate,
    country: 'EG',
    postal_code: 'NA',
  };

  // Step 1: Auth
  const authToken = await getPaymobAuthToken();

  // Step 2: Create Order
  const paymobOrderId = await createPaymobOrder(authToken, amountCents, paymobItems, orderId);

  // Step 3: Get Payment Key for wallet
  const paymentKey = await getPaymentKey(
    authToken,
    paymobOrderId,
    amountCents,
    billingData,
    PAYMOB_WALLET_INTEGRATION_ID
  );

  // Step 4: Request wallet payment
  const walletResponse = await fetch('https://accept.paymob.com/api/acceptance/payments/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: {
        identifier: customerData.phone,
        subtype: 'WALLET',
      },
      payment_token: paymentKey,
    }),
  });

  if (!walletResponse.ok) {
    const error = await walletResponse.json();
    console.error('Wallet payment error:', error);
    throw new Error('Failed to initiate wallet payment');
  }

  const walletData = await walletResponse.json();
  
  // Return redirect URL for wallet payment
  return {
    redirectUrl: walletData.redirect_url || walletData.iframe_redirection_url,
  };
}

// Verify HMAC callback
export function verifyPaymobHMAC(
  receivedHMAC: string,
  data: {
    amount_cents: string;
    created_at: string;
    currency: string;
    error_occured: string;
    has_parent_transaction: string;
    id: string;
    integration_id: string;
    is_3d_secure: string;
    is_auth: string;
    is_capture: string;
    is_refunded: string;
    is_standalone_payment: string;
    is_voided: string;
    order: string;
    owner: string;
    pending: string;
    source_data_pan: string;
    source_data_sub_type: string;
    source_data_type: string;
    success: string;
  }
): boolean {
  const crypto = require('crypto');
  
  // Concatenate values in specific order
  const concatenatedString = [
    data.amount_cents,
    data.created_at,
    data.currency,
    data.error_occured,
    data.has_parent_transaction,
    data.id,
    data.integration_id,
    data.is_3d_secure,
    data.is_auth,
    data.is_capture,
    data.is_refunded,
    data.is_standalone_payment,
    data.is_voided,
    data.order,
    data.owner,
    data.pending,
    data.source_data_pan,
    data.source_data_sub_type,
    data.source_data_type,
    data.success,
  ].join('');

  const calculatedHMAC = crypto
    .createHmac('sha512', PAYMOB_HMAC_SECRET)
    .update(concatenatedString)
    .digest('hex');

  return calculatedHMAC === receivedHMAC;
}

// Main function to initiate PayPal payment
export async function initiatePayPalPayment(
  amountEGP: number,
  orderId: string,
  items: { name: string; price: number; quantity: number }[],
  customerData: {
    fullName: string;
    email: string;
    phone: string;
    governorate: string;
    city: string;
    streetAddress: string;
  }
): Promise<string> {
  // Convert to cents
  const amountCents = Math.round(amountEGP * 100);

  // Format items for Paymob
  const paymobItems: OrderItem[] = items.map(item => ({
    name: item.name,
    amount_cents: Math.round(item.price * 100),
    quantity: item.quantity,
  }));

  // Parse name
  const nameParts = customerData.fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || 'Customer';

  const billingData: BillingData = {
    first_name: firstName,
    last_name: lastName,
    email: customerData.email,
    phone_number: customerData.phone,
    street: customerData.streetAddress,
    city: customerData.city,
    state: customerData.governorate,
    country: 'EG',
    postal_code: 'NA',
  };

  // Step 1: Auth
  const authToken = await getPaymobAuthToken();

  // Step 2: Create Order
  const paymobOrderId = await createPaymobOrder(authToken, amountCents, paymobItems, orderId);

  // Step 3: Get Payment Key for PayPal
  const paymentKey = await getPaymentKey(
    authToken,
    paymobOrderId,
    amountCents,
    billingData,
    PAYMOB_PAYPAL_INTEGRATION_ID
  );

  // Return iframe URL for PayPal payment
  return `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
}

// Main function to initiate Cash Collection payment (Aman, Masary, etc.)
export async function initiateCashCollectionPayment(
  amountEGP: number,
  orderId: string,
  items: { name: string; price: number; quantity: number }[],
  customerData: {
    fullName: string;
    email: string;
    phone: string;
    governorate: string;
    city: string;
    streetAddress: string;
  }
): Promise<{ billReference: string; message: string; isRealBillRef: boolean }> {
  // Convert to cents
  const amountCents = Math.round(amountEGP * 100);

  // Format items for Paymob
  const paymobItems: OrderItem[] = items.map(item => ({
    name: item.name,
    amount_cents: Math.round(item.price * 100),
    quantity: item.quantity,
  }));

  // Parse name
  const nameParts = customerData.fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || 'Customer';

  const billingData: BillingData = {
    first_name: firstName,
    last_name: lastName,
    email: customerData.email,
    phone_number: customerData.phone,
    street: customerData.streetAddress,
    city: customerData.city,
    state: customerData.governorate,
    country: 'EG',
    postal_code: 'NA',
  };

  // Step 1: Auth
  const authToken = await getPaymobAuthToken();

  // Step 2: Create Order
  const paymobOrderId = await createPaymobOrder(authToken, amountCents, paymobItems, orderId);

  // Step 3: Get Payment Key
  const paymentKey = await getPaymentKey(
    authToken,
    paymobOrderId,
    amountCents,
    billingData,
    PAYMOB_CASH_COLLECTION_INTEGRATION_ID
  );

  // Step 4: Request Cash Collection payment
  const cashResponse = await fetch('https://accept.paymob.com/api/acceptance/payments/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: {
        identifier: 'cash',
        subtype: 'CASH',
      },
      payment_token: paymentKey,
    }),
  });

  if (!cashResponse.ok) {
    const error = await cashResponse.json();
    console.error('Cash collection error:', error);
    throw new Error('Failed to initiate cash collection payment');
  }

  const cashData = await cashResponse.json();
  
  // Log full response for debugging
  console.log('Cash Collection Paymob Response:', JSON.stringify(cashData, null, 2));
  
  // Extract bill reference from various possible locations in Paymob response
  // Priority: data.bill_reference (actual bill ref) > pending_data > bill_reference > id (fallback)
  let billReference: string;
  let isRealBillRef = false;
  
  if (cashData.data?.bill_reference) {
    billReference = cashData.data.bill_reference;
    isRealBillRef = true;
    console.log('✅ Got REAL bill reference from data.bill_reference:', billReference);
  } else if (cashData.pending_data?.bill_reference) {
    billReference = cashData.pending_data.bill_reference;
    isRealBillRef = true;
    console.log('✅ Got REAL bill reference from pending_data.bill_reference:', billReference);
  } else if (cashData.bill_reference) {
    billReference = cashData.bill_reference;
    isRealBillRef = true;
    console.log('✅ Got REAL bill reference from root.bill_reference:', billReference);
  } else {
    // Fallback to transaction ID (NOT a real bill reference for payment!)
    billReference = cashData.id?.toString() || 'N/A';
    console.warn('⚠️ WARNING: Using transaction ID as fallback (not a real bill reference):', billReference);
    console.warn('Customers may NOT be able to pay with this reference at outlets.');
    console.warn('Full Paymob response:', cashData);
  }
  
  if (!billReference || billReference === 'N/A') {
    console.error('❌ No bill reference found in Paymob response:', cashData);
    throw new Error('Failed to get bill reference from Paymob');
  }
  
  return {
    billReference: billReference,
    isRealBillRef: isRealBillRef,
    message: isRealBillRef 
      ? `🧾 Bill Reference: ${billReference}. Pay at any Aman or Masary outlet.`
      : `🧾 Transaction ID: ${billReference}. (Sandbox mode - not a real bill reference)`,
  };
}

// Main function to initiate Kiosk payment (Fawry, etc.)
export async function initiateKioskPayment(
  amountEGP: number,
  orderId: string,
  items: { name: string; price: number; quantity: number }[],
  customerData: {
    fullName: string;
    email: string;
    phone: string;
    governorate: string;
    city: string;
    streetAddress: string;
  }
): Promise<{ billReference: string; message: string; isRealBillRef: boolean }> {
  // Convert to cents
  const amountCents = Math.round(amountEGP * 100);

  // Format items for Paymob
  const paymobItems: OrderItem[] = items.map(item => ({
    name: item.name,
    amount_cents: Math.round(item.price * 100),
    quantity: item.quantity,
  }));

  // Parse name
  const nameParts = customerData.fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || 'Customer';

  const billingData: BillingData = {
    first_name: firstName,
    last_name: lastName,
    email: customerData.email,
    phone_number: customerData.phone,
    street: customerData.streetAddress,
    city: customerData.city,
    state: customerData.governorate,
    country: 'EG',
    postal_code: 'NA',
  };

  // Step 1: Auth
  const authToken = await getPaymobAuthToken();

  // Step 2: Create Order
  const paymobOrderId = await createPaymobOrder(authToken, amountCents, paymobItems, orderId);

  // Step 3: Get Payment Key
  const paymentKey = await getPaymentKey(
    authToken,
    paymobOrderId,
    amountCents,
    billingData,
    PAYMOB_KIOSK_INTEGRATION_ID
  );

  // Step 4: Request Kiosk payment
  const kioskResponse = await fetch('https://accept.paymob.com/api/acceptance/payments/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: {
        identifier: 'AGGREGATOR',
        subtype: 'AGGREGATOR',
      },
      payment_token: paymentKey,
    }),
  });

  if (!kioskResponse.ok) {
    const error = await kioskResponse.json();
    console.error('Kiosk payment error:', error);
    throw new Error('Failed to initiate kiosk payment');
  }

  const kioskData = await kioskResponse.json();
  
  // Log full response for debugging
  console.log('Kiosk Paymob Response:', JSON.stringify(kioskData, null, 2));
  
  // Extract bill reference from various possible locations in Paymob response
  // Priority: data.bill_reference (actual bill ref) > pending_data > bill_reference > id (fallback)
  let billReference: string;
  let isRealBillRef = false;
  
  if (kioskData.data?.bill_reference) {
    billReference = kioskData.data.bill_reference;
    isRealBillRef = true;
    console.log('✅ Got REAL bill reference from data.bill_reference:', billReference);
  } else if (kioskData.pending_data?.bill_reference) {
    billReference = kioskData.pending_data.bill_reference;
    isRealBillRef = true;
    console.log('✅ Got REAL bill reference from pending_data.bill_reference:', billReference);
  } else if (kioskData.bill_reference) {
    billReference = kioskData.bill_reference;
    isRealBillRef = true;
    console.log('✅ Got REAL bill reference from root.bill_reference:', billReference);
  } else {
    // Fallback to transaction ID (NOT a real bill reference for payment!)
    billReference = kioskData.id?.toString() || 'N/A';
    console.warn('⚠️ WARNING: Using transaction ID as fallback (not a real bill reference):', billReference);
    console.warn('Customers may NOT be able to pay with this reference at outlets.');
    console.warn('Full Paymob response:', kioskData);
  }
  
  if (!billReference || billReference === 'N/A') {
    console.error('❌ No bill reference found in Paymob response:', kioskData);
    throw new Error('Failed to get bill reference from Paymob');
  }
  
  return {
    billReference: billReference,
    isRealBillRef: isRealBillRef,
    message: isRealBillRef 
      ? `🎫 Reference Number: ${billReference}. Pay at any Fawry machine or payment kiosk.`
      : `🎫 Transaction ID: ${billReference}. (Sandbox mode - not a real bill reference)`,
  };
}

export { 
  PAYMOB_IFRAME_ID, 
  PAYMOB_CARD_INTEGRATION_ID, 
  PAYMOB_WALLET_INTEGRATION_ID, 
  PAYMOB_PAYPAL_INTEGRATION_ID,
  PAYMOB_CASH_COLLECTION_INTEGRATION_ID,
  PAYMOB_KIOSK_INTEGRATION_ID
};
