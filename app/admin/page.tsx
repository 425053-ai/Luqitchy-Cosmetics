"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface AnalyticsResponse {
  range: string
  kpis: {
    totalRevenue: number
    ordersToday: number
    conversionRate: number
    averageOrderValue: number
    monthlyGrowth: number
    yearlyGrowth: number
  }
  charts: {
    revenuePerMonth: Array<{ month: string; revenue: number; orders: number }>
    ordersPerDay: Array<{ day: string; orders: number; revenue: number }>
    topProducts: Array<{ product: string; qty: number; revenue: number }>
    salesByGovernorate: Array<{ governorate: string; orders: number; revenue: number }>
  }
  funnel: {
    visitors: number
    addToCart: number
    checkoutStarted: number
    completed: number
  }
  insights: {
    bestSellingHour: number
    bestSellingDay: string
    returningCustomersRate: number
    customerLifetimeValue: number
  }
}

const COLORS = ['#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#3b82f6', '#ef4444', '#22c55e', '#a855f7']

export default function AdminBIPage() {
  const [range, setRange] = useState<'30d' | '90d' | '365d' | 'all'>('30d')
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const loadAnalytics = async (selectedRange: string) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/analytics?range=${selectedRange}`)
      if (response.status === 401) {
        router.push('/admin-access')
        return
      }
      if (!response.ok) {
        throw new Error('Failed to load analytics')
      }
      const json = (await response.json()) as AnalyticsResponse
      setData(json)
    } catch {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics(range)
  }, [range])

  const funnelData = useMemo(() => {
    if (!data) return []
    return [
      { name: 'Visitors', value: data.funnel.visitors },
      { name: 'Add to cart', value: data.funnel.addToCart },
      { name: 'Checkout', value: data.funnel.checkoutStarted },
      { name: 'Completed', value: data.funnel.completed },
    ]
  }, [data])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin-access')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Business Intelligence Dashboard</h1>
            <p className="text-sm text-muted-foreground">Revenue, conversion, products, behavior and growth analytics.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/orders" className="h-10 px-4 rounded-xl border border-border bg-card inline-flex items-center text-sm">Orders</Link>
            <Link href="/admin/transfers" className="h-10 px-4 rounded-xl border border-border bg-card inline-flex items-center text-sm">Transfers</Link>
            <button onClick={handleLogout} className="h-10 px-4 rounded-xl border border-border bg-card text-sm">Logout</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['30d', '90d', '365d', 'all'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setRange(option)}
              className={`h-9 px-3 rounded-lg text-sm border ${range === option ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border'}`}
            >
              {option}
            </button>
          ))}
        </div>

        {loading && <div className="rounded-xl border border-border bg-card p-6">Loading analytics...</div>}
        {error && <div className="rounded-xl border border-red-300 bg-red-50 text-red-600 p-6">{error}</div>}

        {data && !loading && !error && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <KpiCard title="Total Revenue" value={`${data.kpis.totalRevenue.toLocaleString()} EGP`} />
              <KpiCard title="Orders Today" value={String(data.kpis.ordersToday)} />
              <KpiCard title="Conversion Rate" value={`${data.kpis.conversionRate}%`} />
              <KpiCard title="AOV" value={`${data.kpis.averageOrderValue.toLocaleString()} EGP`} />
              <KpiCard title="Monthly Growth" value={`${data.kpis.monthlyGrowth}%`} />
              <KpiCard title="Yearly Growth" value={`${data.kpis.yearlyGrowth}%`} />
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <ChartCard title="Revenue per Month">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.charts.revenuePerMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} />
                    <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Orders per Day (last 30 days)">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.charts.ordersPerDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" hide />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#3b82f6" />
                    <Bar dataKey="revenue" fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <ChartCard title="Top 5 Products">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.charts.topProducts} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="product" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="qty" fill="#f59e0b" />
                    <Bar dataKey="revenue" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Conversion Funnel">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={funnelData} dataKey="value" nameKey="name" outerRadius={100}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <ChartCard title="Sales by Governorate">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.charts.salesByGovernorate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="governorate" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#a855f7" />
                    <Bar dataKey="revenue" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Smart Insights">
                <div className="space-y-3 text-sm">
                  <InsightRow label="Best selling hour" value={`${data.insights.bestSellingHour}:00`} />
                  <InsightRow label="Best selling day" value={data.insights.bestSellingDay} />
                  <InsightRow label="Returning customers" value={`${data.insights.returningCustomersRate}%`} />
                  <InsightRow label="Customer lifetime value" value={`${data.insights.customerLifetimeValue} EGP`} />
                  <InsightRow label="Visitors" value={String(data.funnel.visitors)} />
                  <InsightRow label="Completed orders" value={String(data.funnel.completed)} />
                </div>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-lg md:text-xl font-bold mt-1">{value}</p>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  )
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/70 p-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
