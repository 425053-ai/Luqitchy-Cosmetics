import { NextRequest, NextResponse } from 'next/server';
import { calculateOrderTotals } from '@/lib/order-totals';
import { formatOrderId, getNextOrderCounter } from '@/lib/order-counter';
import { insertAnalyticsEvent } from '@/lib/analytics-db';
import { createServerPrismaClient } from '@/lib/server-prisma';

function buildFallbackOrder(orderNumber: string, products: any, customer: any, productsSubtotal: number, shippingFee: number, finalTotal: number) {
  const createdAt = new Date().toISOString();
  return {
    success: true,
    orderNumber,
    orderId: orderNumber,
    order: {
      id: orderNumber,
      orderNumber,
      products,
      customer,
      productsSubtotal,
      shippingFee,
      finalTotal,
      createdAt,
      persisted: false,
    },
    fallback: true,
  };
}

// Sanitize string fields - STRICT cleaning to prevent Prisma errors
function sanitizeString(str: any): string {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') return String(str).trim();
  
  // Remove ALL non-printable characters, multiple spaces, and control characters
  return str
    .trim()
    .replace(/[\n\r\t]/g, ' ')           // Replace newlines/tabs with space
    .replace(/\s+/g, ' ')                 // Replace multiple spaces with single space
    .replace(/[\x00-\x1F\x7F]/g, '')      // Remove control characters
    .substring(0, 1000);
}

// Sanitize customer object
function sanitizeCustomer(customer: any): any {
  if (!customer || typeof customer !== 'object') return {};
  return {
    fullName: sanitizeString(customer.fullName),
    email: sanitizeString(customer.email),
    phone: sanitizeString(customer.phone),
    whatsapp: sanitizeString(customer.whatsapp),
    governorate: sanitizeString(customer.governorate),
    city: sanitizeString(customer.city),
    streetAddress: sanitizeString(customer.streetAddress),
    landmark: sanitizeString(customer.landmark),
    notes: sanitizeString(customer.notes),
  };
}

// Sanitize products array
function sanitizeProducts(products: any[]): any[] {
  if (!Array.isArray(products)) return [];
  return products.map(p => ({
    name: sanitizeString(p.name),
    quantity: Number(p.quantity) || 0,
    price: Number(p.price) || 0,
    total: Number(p.total) || 0,
    shade: p.shade ? sanitizeString(p.shade) : undefined,
  })).filter(p => p.quantity > 0 && p.price > 0);
}

export async function POST(request: NextRequest) {
  let prisma: any = null;
  let products: any[] = [];
  let customer: any = {};
  let reservedOrderId: string | null = null;
  let sessionId = '';
  
  try {
    const body = await request.json();
    
    // STRICT sanitization of all inputs BEFORE any processing
    products = sanitizeProducts(body.products);
    customer = sanitizeCustomer(body.customer);
    sessionId = String(body?.sessionId || '').trim();
    
    // Validate after sanitization
    if (!products || products.length === 0) {
      console.error('❌ [Order] No valid products after sanitization');
      return NextResponse.json({ error: 'No valid products' }, { status: 400 });
    }
    
    if (!customer || !customer.fullName) {
      console.error('❌ [Order] Invalid customer data after sanitization:', { customer });
      return NextResponse.json({ error: 'Invalid customer data' }, { status: 400 });
    }

    console.log('✅ [Order] Data sanitized successfully');
    console.log('   Customer:', customer.fullName);
    console.log('   Products:', products.length);

    // Calculate totals from CLEANED products
    const { productsSubtotal, shippingFee, finalTotal } = calculateOrderTotals(products);
    reservedOrderId = formatOrderId(getNextOrderCounter());

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.warn('⚠️ [Order] No database URL, returning fallback');
      return NextResponse.json(buildFallbackOrder(reservedOrderId, products, customer, productsSubtotal, shippingFee, finalTotal), { status: 200 });
    }

    prisma = await createServerPrismaClient();

    // Create order in transaction with cleaned data
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: reservedOrderId!,
          products: JSON.parse(JSON.stringify(products)),  // Ensure clean JSON
          customer: JSON.parse(JSON.stringify(customer)),   // Ensure clean JSON
          productsSubtotal,
          shippingFee,
          finalTotal,
        },
      });
      return created;
    });

    console.log('✅ [Order] Successfully created:', order.orderNumber);

    if (sessionId) {
      await insertAnalyticsEvent(prisma, {
        type: 'order_completed',
        sessionId,
        metadata: {
          orderId: order.orderNumber,
          finalTotal,
          productsCount: products.length,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      orderNumber: order.orderNumber, 
      orderId: order.orderNumber, 
      order 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('❌ [Order] Error creating order:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    // Still return fallback so order isn't lost
    const { productsSubtotal, shippingFee, finalTotal } = calculateOrderTotals(products || []);
    const fallbackOrderId = reservedOrderId || formatOrderId(getNextOrderCounter());
    
    const fallback = buildFallbackOrder(
      fallbackOrderId, 
      products || [], 
      customer || {}, 
      productsSubtotal, 
      shippingFee, 
      finalTotal
    );
    
    console.log('✅ [Order] Returning fallback order:', fallbackOrderId);
    return NextResponse.json(fallback, { status: 200 });
    
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
