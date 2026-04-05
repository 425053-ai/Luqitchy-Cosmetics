import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Order Counter API is no longer in use. Orders now use customer names instead of Order IDs.',
    status: 'disabled'
  }, { status: 200 })
}

export async function POST() {
  return NextResponse.json({
    message: 'Order Counter API is no longer in use. Orders now use customer names instead of Order IDs.',
    status: 'disabled'
  }, { status: 200 })
}

export async function PUT() {
  return NextResponse.json({
    message: 'Order Counter API is no longer in use. Orders now use customer names instead of Order IDs.',
    status: 'disabled'
  }, { status: 200 })
}
