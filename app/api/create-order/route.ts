import { NextRequest, NextResponse } from 'next/server';
import { calculateOrderTotals } from '@/lib/order-totals';
import { formatOrderId, getNextOrderCounter } from '@/lib/order-counter';

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

export async function POST(request: NextRequest) {
  let prisma: any = null;
  let products: any = [];
  let customer: any = {};
  let reservedOrderId: string | null = null;
  try {
    const body = await request.json();
    products = body.products;
    customer = body.customer;
    if (!products || !customer) {
      return NextResponse.json({ error: 'Missing products or customer data' }, { status: 400 });
    }

    // Calculate totals
    const { productsSubtotal, shippingFee, finalTotal } = calculateOrderTotals(products);
    reservedOrderId = formatOrderId(getNextOrderCounter());

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json(buildFallbackOrder(reservedOrderId, products, customer, productsSubtotal, shippingFee, finalTotal), { status: 200 });
    }

    const [{ PrismaClient }, { PrismaPg }] = await Promise.all([
      import('@prisma/client'),
      import('@prisma/adapter-pg'),
    ]);

    const adapter = new PrismaPg({ connectionString: databaseUrl });
    prisma = new PrismaClient({ adapter });

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
