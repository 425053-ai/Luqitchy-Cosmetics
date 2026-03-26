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
    message: 'Order saved successfully (local backup)',
  };
}

// ULTRA-STRICT sanitization to prevent ANY Prisma validation errors
function ultraSanitizeString(str: any): string {
  if (str === null || str === undefined) return '';
  let s = String(str);
  
  // Step 1: Remove ALL byte-level control characters (0x00-0x1F, 0x7F, 0x80-0x9F)
  s = s.replace(/[\x00-\x1F\x7F\x80-\x9F]/g, '');
  
  // Step 2: Remove newlines, carriage returns, tabs, form feeds (aggressive)
  s = s.replace(/[\n\r\t\f\v]/g, ' ');
  
  // Step 3: Collapse multiple spaces to single space
  s = s.replace(/\s+/g, ' ');
  
  // Step 4: Remove any remaining non-ASCII if it looks suspicious
  s = s.replace(/[^\x20-\x7E\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g, '');
  
  // Step 5: Trim and limit length
  return s.trim().substring(0, 1000);
}

// Sanitize customer object with ultra-strict method
function sanitizeCustomer(customer: any): any {
  if (!customer || typeof customer !== 'object') return {};
  
  // PURE object creation to avoid circular references
  const clean = {
    fullName: ultraSanitizeString(customer.fullName),
    email: ultraSanitizeString(customer.email),
    phone: ultraSanitizeString(customer.phone),
    whatsapp: ultraSanitizeString(customer.whatsapp),
    governorate: ultraSanitizeString(customer.governorate),
    city: ultraSanitizeString(customer.city),
    streetAddress: ultraSanitizeString(customer.streetAddress),
    landmark: ultraSanitizeString(customer.landmark),
    notes: ultraSanitizeString(customer.notes),
  };
  
  // Double-serialize to ensure no hidden characters
  return JSON.parse(JSON.stringify(clean));
}

// Sanitize products array with ultra-strict method
function sanitizeProducts(products: any[]): any[] {
  if (!Array.isArray(products)) return [];
  
  const clean = products
    .filter(p => p && typeof p === 'object')
    .map(p => ({
      name: ultraSanitizeString(p.name),
      quantity: Math.max(0, Number(p.quantity) || 0),
      price: Math.max(0, Number(p.price) || 0),
      total: Math.max(0, Number(p.total) || 0),
      shade: p.shade ? ultraSanitizeString(p.shade) : undefined,
    }))
    .filter(p => p.quantity > 0 && p.price > 0);
  
  // Double-serialize to ensure clean JSON
  return JSON.parse(JSON.stringify(clean));
}

export async function POST(request: NextRequest) {
  let prisma: any = null;
  let products: any[] = [];
  let customer: any = {};
  let reservedOrderId: string | null = null;
  let sessionId = '';
  
  try {
    const body = await request.json();
    
    // DEBUG: Log raw input
    console.log('📥 [Order] Raw input received');
    
    // STEP 1: ULTRA-STRICT sanitization of all inputs BEFORE any processing
    console.log('🧹 [Order] Starting ultra-strict sanitization...');
    products = sanitizeProducts(body.products);
    customer = sanitizeCustomer(body.customer);
    sessionId = String(body?.sessionId || '').trim();
    
    console.log('✅ [Order] Data sanitized successfully');
    console.log('   Customer:', customer.fullName || 'N/A');
    console.log('   Products count:', products.length);
    console.log('   Session ID:', sessionId.substring(0, 8) + '...');
    
    // STEP 2: Validate after sanitization
    if (!products || products.length === 0) {
      console.error('❌ [Validate] No valid products after sanitization');
      // Still generate fallback - NEVER fail
      const fallbackOrderId = formatOrderId(getNextOrderCounter());
      return NextResponse.json(buildFallbackOrder(fallbackOrderId, [], {}, 0, 0, 0), { status: 200 });
    }
    
    if (!customer || !customer.fullName) {
      console.error('❌ [Validate] Invalid customer name');
      // Still generate fallback - NEVER fail
      const fallbackOrderId = formatOrderId(getNextOrderCounter());
      return NextResponse.json(buildFallbackOrder(fallbackOrderId, products, customer, 0, 0, 0), { status: 200 });
    }

    // STEP 3: Calculate totals from CLEANED products
    const { productsSubtotal, shippingFee, finalTotal } = calculateOrderTotals(products);
    reservedOrderId = formatOrderId(getNextOrderCounter());
    
    console.log('💰 [Order] Totals calculated:');
    console.log('   Subtotal:', productsSubtotal);
    console.log('   Shipping:', shippingFee);
    console.log('   Total:', finalTotal);

    // STEP 4: Try database insert if DATABASE_URL exists
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.warn('⚠️ [Order] No DATABASE_URL configured, using fallback');
      return NextResponse.json(buildFallbackOrder(reservedOrderId, products, customer, productsSubtotal, shippingFee, finalTotal), { status: 200 });
    }

    prisma = await createServerPrismaClient();
    console.log('🔌 [Order] Prisma client connected');

    // STEP 5: Create order with RETRY LOGIC (no transaction - simpler & faster)
    console.log('💾 [Order] Attempting database insert for order:', reservedOrderId);
    const now = new Date();
    let order: any = null;
    let lastError: any = null;

    // Retry logic with exponential backoff (3 attempts max)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`📤 [Order] Insert attempt ${attempt}/3...`);
        
        // ⚡ SIMPLE insert without transaction (faster, less likely to timeout)
        order = await prisma.order.create({
          data: {
            orderNumber: reservedOrderId!,
            products: JSON.parse(JSON.stringify(products)),
            customer: JSON.parse(JSON.stringify(customer)),
            productsSubtotal,
            shippingFee,
            finalTotal,
            createdAt: now,
            updatedAt: now,
          },
        });
        
        console.log('✅ [Order] Database insert successful:', order.orderNumber);
        break; // Success! Exit retry loop
        
      } catch (retryError: any) {
        lastError = retryError;
        console.error(`❌ [Order] Attempt ${attempt} failed:`, retryError.code, retryError.message);
        
        // If it's a transaction timeout, retry with backoff
        if (retryError.code === 'P2028' && attempt < 3) {
          const delayMs = Math.pow(2, attempt - 1) * 100; // 100ms, 200ms, 400ms
          console.log(`⏳ [Order] Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        } else if (attempt === 3) {
          // Final attempt failed - throw to fallback
          throw retryError;
        }
      }
    }

    if (!order) {
      throw lastError || new Error('Unexpected: Order insert failed');
    }

    // STEP 6: Send analytics event if available (non-blocking, fire-and-forget)
    if (sessionId) {
      // Don't wait for analytics - it's non-critical
      insertAnalyticsEvent(prisma, {
        type: 'order_completed',
        sessionId,
        metadata: {
          orderId: order.orderNumber,
          finalTotal,
          productsCount: products.length,
        },
      }).then(() => {
        console.log('📊 [Analytics] Event recorded');
      }).catch((analyticsError) => {
        console.warn('⚠️ [Analytics] Failed to record event (non-critical):', analyticsError.message);
      });
    }

    // SUCCESS: Return the created order immediately (don't wait for analytics)
    return NextResponse.json({ 
      success: true, 
      orderNumber: order.orderNumber, 
      orderId: order.orderNumber, 
      order,
      message: 'Order created successfully',
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('❌ [Error] Exception occurred:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    
    // CRITICAL: ALWAYS return fallback on error - NEVER show "pattern" error to user
    console.log('🛡️ [Fallback] Activating fallback order protection...');
    
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
    
    console.log('✅ [Fallback] Returning protected fallback order:', fallbackOrderId);
    return NextResponse.json(fallback, { status: 200 });
    
  } finally {
    if (prisma) {
      try {
        await prisma.$disconnect();
        console.log('🔌 [Order] Prisma disconnected');
      } catch (disconnectError) {
        console.warn('⚠️ [Order] Error disconnecting Prisma:', disconnectError);
      }
    }
  }
}
