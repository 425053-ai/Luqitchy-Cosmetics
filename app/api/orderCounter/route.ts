import { NextResponse } from 'next/server'
import { formatOrderId, getCurrentOrderCounter, getNextOrderCounter, setOrderCounter } from '@/lib/order-counter'

export async function GET() {
  try {
    const currentOrder = await getCurrentOrderCounter()
    return NextResponse.json({
      currentOrder,
      orderId: formatOrderId(currentOrder),
    })
  } catch (error) {
    console.error('Error getting order counter:', error)
    return NextResponse.json({ error: 'Failed to get order counter' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const newCounter = await getNextOrderCounter()
    return NextResponse.json(
      {
        orderId: formatOrderId(newCounter),
        orderNumber: newCounter,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error generating order ID:', error)
    return NextResponse.json({ error: 'Failed to generate order ID' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const resetTo = await setOrderCounter(0)

    return NextResponse.json(
      {
        success: true,
        currentOrder: resetTo,
        orderId: formatOrderId(resetTo),
        message: 'Order counter reset to zero. Next order will be ORD-0001.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error resetting order counter:', error)
    return NextResponse.json({ error: 'Failed to reset order counter' }, { status: 500 })
  }
}
