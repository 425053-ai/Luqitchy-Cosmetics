import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, isAdminSessionTokenValid } from '@/lib/admin-auth'
import { getAnalyticsEvents } from '@/lib/analytics-db'
import { createServerPrismaClient } from '@/lib/server-prisma'

type RangeKey = '30d' | '90d' | '365d' | 'all'

interface AnalyticsEventRow {
  id: number
  type: 'visit' | 'add_to_cart' | 'checkout_started' | 'order_completed'
  session_id: string
  metadata: Record<string, unknown> | null
  created_at: string | Date
}

function buildEmptyAnalytics(range: RangeKey, warning?: string) {
  return {
    range,
    kpis: {
      totalRevenue: 0,
      ordersToday: 0,
      conversionRate: 0,
      averageOrderValue: 0,
      monthlyGrowth: 0,
      yearlyGrowth: 0,
    },
    charts: {
      revenuePerMonth: [],
      ordersPerDay: [],
      topProducts: [],
      salesByGovernorate: [],
    },
    funnel: {
      visitors: 0,
      addToCart: 0,
      checkoutStarted: 0,
      completed: 0,
    },
    insights: {
      bestSellingHour: 0,
      bestSellingDay: 'N/A',
      returningCustomersRate: 0,
      customerLifetimeValue: 0,
    },
    ...(warning ? { warning } : {}),
  }
}

function toPercent(value: number) {
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : 0
}

function getSinceDate(range: RangeKey) {
  if (range === 'all') return undefined
  const now = new Date()
  const days = range === '30d' ? 30 : range === '90d' ? 90 : 365
  now.setDate(now.getDate() - days)
  return now
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getRevenue(orders: any[]) {
  return orders.reduce((sum, order) => sum + Number(order?.finalTotal || 0), 0)
}

function parseProducts(order: any): Array<{ name: string; quantity: number; revenue: number }> {
  if (!Array.isArray(order?.products)) return []

  return order.products.map((item: any) => {
    const quantity = Number(item?.quantity || 1)
    const price = Number(item?.price || 0)
    const revenue = Number(item?.total ?? price * quantity)
    return {
      name: String(item?.name || 'Unknown Product'),
      quantity: Number.isFinite(quantity) ? quantity : 1,
      revenue: Number.isFinite(revenue) ? revenue : 0,
    }
  })
}

function parseGovernorate(order: any) {
  const governorate = order?.customer?.governorate
  if (!governorate) return 'Unknown'
  return String(governorate)
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let prisma: any = null
  const rangeParam = (request.nextUrl.searchParams.get('range') || '30d') as RangeKey
  const range: RangeKey = ['30d', '90d', '365d', 'all'].includes(rangeParam) ? rangeParam : '30d'

  try {
    const since = getSinceDate(range)

    try {
      prisma = await createServerPrismaClient()
    } catch {
      return NextResponse.json(buildEmptyAnalytics(range, 'Analytics data source is not configured yet'))
    }

    const ordersWhere = since ? { createdAt: { gte: since } } : undefined
    const orders = await prisma.order.findMany({
      where: ordersWhere,
      orderBy: { createdAt: 'asc' },
    })

    const events = (await getAnalyticsEvents(prisma, since)) as AnalyticsEventRow[]

    const totalRevenue = getRevenue(orders)
    const avgOrderValue = orders.length ? totalRevenue / orders.length : 0

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const ordersToday = orders.filter((order: any) => new Date(order.createdAt) >= todayStart).length

    const visitSessions = new Set(events.filter((e) => e.type === 'visit').map((e) => e.session_id))
    const addToCartSessions = new Set(events.filter((e) => e.type === 'add_to_cart').map((e) => e.session_id))
    const checkoutSessions = new Set(events.filter((e) => e.type === 'checkout_started').map((e) => e.session_id))
    const completedSessions = new Set(events.filter((e) => e.type === 'order_completed').map((e) => e.session_id))

    const conversionRate = visitSessions.size > 0 ? (completedSessions.size / visitSessions.size) * 100 : 0

    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisYearStart = new Date(now.getFullYear(), 0, 1)
    const prevYearStart = new Date(now.getFullYear() - 1, 0, 1)

    const [thisMonthOrders, prevMonthOrders, thisYearOrders, prevYearOrders] = await Promise.all([
      prisma.order.findMany({ where: { createdAt: { gte: thisMonthStart } } }),
      prisma.order.findMany({ where: { createdAt: { gte: prevMonthStart, lt: thisMonthStart } } }),
      prisma.order.findMany({ where: { createdAt: { gte: thisYearStart } } }),
      prisma.order.findMany({ where: { createdAt: { gte: prevYearStart, lt: thisYearStart } } }),
    ])

    const thisMonthRevenue = getRevenue(thisMonthOrders)
    const prevMonthRevenue = getRevenue(prevMonthOrders)
    const thisYearRevenue = getRevenue(thisYearOrders)
    const prevYearRevenue = getRevenue(prevYearOrders)

    const monthlyGrowth = prevMonthRevenue > 0 ? ((thisMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0
    const yearlyGrowth = prevYearRevenue > 0 ? ((thisYearRevenue - prevYearRevenue) / prevYearRevenue) * 100 : 0

    const revenuePerMonthMap = new Map<string, { month: string; revenue: number; orders: number }>()
    const ordersPerDayMap = new Map<string, { day: string; orders: number; revenue: number }>()
    const topProductsMap = new Map<string, { product: string; qty: number; revenue: number }>()
    const governorateMap = new Map<string, { governorate: string; orders: number; revenue: number }>()
    const customerOrdersMap = new Map<string, { count: number; revenue: number }>()
    const ordersByHour = new Map<number, number>()
    const ordersByWeekDay = new Map<string, number>()

    for (const order of orders) {
      const createdAt = new Date(order.createdAt)
      const orderRevenue = Number(order.finalTotal || 0)

      const month = monthKey(createdAt)
      const monthRow = revenuePerMonthMap.get(month) || { month, revenue: 0, orders: 0 }
      monthRow.revenue += orderRevenue
      monthRow.orders += 1
      revenuePerMonthMap.set(month, monthRow)

      const day = dayKey(createdAt)
      const dayRow = ordersPerDayMap.get(day) || { day, orders: 0, revenue: 0 }
      dayRow.orders += 1
      dayRow.revenue += orderRevenue
      ordersPerDayMap.set(day, dayRow)

      const governorate = parseGovernorate(order)
      const govRow = governorateMap.get(governorate) || { governorate, orders: 0, revenue: 0 }
      govRow.orders += 1
      govRow.revenue += orderRevenue
      governorateMap.set(governorate, govRow)

      const hour = createdAt.getHours()
      ordersByHour.set(hour, (ordersByHour.get(hour) || 0) + 1)

      const weekDay = createdAt.toLocaleDateString('en-US', { weekday: 'long' })
      ordersByWeekDay.set(weekDay, (ordersByWeekDay.get(weekDay) || 0) + 1)

      const customerEmail = String(order?.customer?.email || '').trim().toLowerCase()
      if (customerEmail) {
        const customerRow = customerOrdersMap.get(customerEmail) || { count: 0, revenue: 0 }
        customerRow.count += 1
        customerRow.revenue += orderRevenue
        customerOrdersMap.set(customerEmail, customerRow)
      }

      for (const item of parseProducts(order)) {
        const current = topProductsMap.get(item.name) || { product: item.name, qty: 0, revenue: 0 }
        current.qty += item.quantity
        current.revenue += item.revenue
        topProductsMap.set(item.name, current)
      }
    }

    const revenuePerMonth = Array.from(revenuePerMonthMap.values()).sort((a, b) => a.month.localeCompare(b.month))
    const ordersPerDay = Array.from(ordersPerDayMap.values())
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(-30)

    const topProducts = Array.from(topProductsMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)

    const salesByGovernorate = Array.from(governorateMap.values())
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 8)

    let bestSellingHour = 0
    let bestSellingHourCount = 0
    for (const [hour, count] of ordersByHour.entries()) {
      if (count > bestSellingHourCount) {
        bestSellingHour = hour
        bestSellingHourCount = count
      }
    }

    let bestSellingDay = 'N/A'
    let bestSellingDayCount = 0
    for (const [dayName, count] of ordersByWeekDay.entries()) {
      if (count > bestSellingDayCount) {
        bestSellingDay = dayName
        bestSellingDayCount = count
      }
    }

    const uniqueCustomers = customerOrdersMap.size
    const returningCustomers = Array.from(customerOrdersMap.values()).filter((c) => c.count > 1).length
    const returningCustomersRate = uniqueCustomers > 0 ? (returningCustomers / uniqueCustomers) * 100 : 0
    const customerLifetimeValue = uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0

    return NextResponse.json({
      range,
      kpis: {
        totalRevenue: Math.round(totalRevenue),
        ordersToday,
        conversionRate: toPercent(conversionRate),
        averageOrderValue: toPercent(avgOrderValue),
        monthlyGrowth: toPercent(monthlyGrowth),
        yearlyGrowth: toPercent(yearlyGrowth),
      },
      charts: {
        revenuePerMonth,
        ordersPerDay,
        topProducts,
        salesByGovernorate,
      },
      funnel: {
        visitors: visitSessions.size,
        addToCart: addToCartSessions.size,
        checkoutStarted: checkoutSessions.size,
        completed: completedSessions.size,
      },
      insights: {
        bestSellingHour,
        bestSellingDay,
        returningCustomersRate: toPercent(returningCustomersRate),
        customerLifetimeValue: toPercent(customerLifetimeValue),
      },
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json(buildEmptyAnalytics(range, 'Analytics temporarily unavailable, showing empty dataset'))
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}
