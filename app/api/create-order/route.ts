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

// Sanitize string fields
function sanitizeString(str: any): string {
  if (!str || typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ').substring(0, 500);
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

export async function POST(request: NextRequest) {
  let prisma: any = null;
  let products: any = [];
  let customer: any = {};
  let reservedOrderId: string | null = null;
  let sessionId = '';
  try {
    const body = await request.json();
    products = body.products;
    customer = sanitizeCustomer(body.customer);
    sessionId = String(body?.sessionId || '').trim();
    if (!products || !customer || !customer.fullName) {
      return NextResponse.json({ error: 'Missing products or customer data' }, { status: 400 });
    }

    // Calculate totals
    const { productsSubtotal, shippingFee, finalTotal } = calculateOrderTotals(products);
    reservedOrderId = formatOrderId(getNextOrderCounter());

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json(buildFallbackOrder(reservedOrderId, products, customer, productsSubtotal, shippingFee, finalTotal), { status: 200 });
    }

    prisma = await createServerPrismaClient();

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: reservedOrderId,
          products,
          customer,
          productsSubtotal,
          shippingFee,
          finalTotal,
        },
      });
      return created;
    });

    if (sessionId) {
      await insertAnalyticsEvent(prisma, {
        type: 'order_completed',
        sessionId,
        metadata: {
          orderId: order.orderNumber,
          finalTotal,
          productsCount: Array.isArray(products) ? products.length : 0,
        },
      });
    }

    return NextResponse.json({ success: true, orderNumber: order.orderNumber, orderId: order.orderNumber, order });
  } catch (error: any) {
    const { productsSubtotal, shippingFee, finalTotal } = calculateOrderTotals(products || []);
    const fallbackOrderId = reservedOrderId || formatOrderId(getNextOrderCounter());
    return NextResponse.json(buildFallbackOrder(fallbackOrderId, products || [], customer || {}, productsSubtotal, shippingFee, finalTotal), { status: 200 });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
