import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { calculateOrderTotals } from '@/lib/order-totals';

function buildFallbackOrder(products: any, customer: any, productsSubtotal: number, shippingFee: number, finalTotal: number) {
  const fallbackId = Date.now();
  const createdAt = new Date().toISOString();
  return {
    success: true,
    orderNumber: `LQ-${fallbackId}`,
    order: {
      id: fallbackId,
      orderNumber: `LQ-${fallbackId}`,
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

export async function POST(request: NextRequest) {
  let prisma: PrismaClient | null = null;
  let products: any = [];
  let customer: any = {};
  try {
    const body = await request.json();
    products = body.products;
    customer = body.customer;
    if (!products || !customer) {
      return NextResponse.json({ error: 'Missing products or customer data' }, { status: 400 });
    }

    // Calculate totals
    const { productsSubtotal, shippingFee, finalTotal } = calculateOrderTotals(products);

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json(buildFallbackOrder(products, customer, productsSubtotal, shippingFee, finalTotal), { status: 200 });
    }

    const adapter = new PrismaPg({ connectionString: databaseUrl });
    prisma = new PrismaClient({ adapter });

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          products,
          customer,
          productsSubtotal,
          shippingFee,
          finalTotal,
        },
      });
      const orderNumber = `LQ-${created.id.toString().padStart(6, '0')}`;
      return await tx.order.update({
        where: { id: created.id },
        data: { orderNumber },
      });
    });
    return NextResponse.json({ success: true, orderNumber: order.orderNumber, order });
  } catch (error: any) {
    const { productsSubtotal, shippingFee, finalTotal } = calculateOrderTotals(products || []);
    return NextResponse.json(buildFallbackOrder(products || [], customer || {}, productsSubtotal, shippingFee, finalTotal), { status: 200 });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
