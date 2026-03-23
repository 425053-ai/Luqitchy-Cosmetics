"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart4, Eye, ShoppingCart, TrendingUp, Clock, Users } from 'lucide-react'

interface Visitor {
  sessionId: string
  firstSeen: string
  lastSeen: string
  eventCount: number
  pageViews: number
  productsViewed: string[]
  addedToCart: number
  orders: number
  conversionStatus: 'visitor' | 'cart_user' | 'converted'
  lastPath: string
  sessionDuration: number
}

interface VisitorResponse {
  range: string
  summary: {
    uniqueVisitors: number
    totalPageViews: number
    cartUsers: number
    conversions: number
    conversionRate: string | number
    avgSessionDuration: number
  }
  visitors: Visitor[]
}

export default function VisitorsPage() {
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h')
  const [data, setData] = useState<VisitorResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [sessionDetails, setSessionDetails] = useState<any>(null)
  const router = useRouter()

  const loadVisitors = async (selectedRange: string) => {
    setLoading(true)
    setError('')
    setSelectedSession(null)
    try {
      console.log(`📊 Fetching visitors data for range: ${selectedRange}`)
      const response = await fetch(`/api/admin/visitors?range=${selectedRange}`)
      console.log(`📊 API Response status: ${response.status}`)
      
      if (response.status === 401) {
        router.push('/admin-access')
        return
      }
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        throw new Error(`Failed to load visitors (${response.status})`)
      }
      const json = (await response.json()) as VisitorResponse
      console.log('✅ Visitors data loaded:', json)
      setData(json)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('❌ Error loading visitors:', message)
      setError(`Failed to load visitors data: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadSessionDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/admin/visitors?sessionId=${sessionId}`)
      if (!response.ok) throw new Error('Failed to load session')
      const json = await response.json()
      setSessionDetails(json)
    } catch {
      setError('Failed to load session details')
    }
  }

  useEffect(() => {
    loadVisitors(range)
  }, [range])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin-access')
    router.refresh()
  }

  const getStatusBadge = (status: string) => {
    if (status === 'converted') return 'bg-green-100 text-green-800 border-green-300'
    if (status === 'cart_user') return 'bg-blue-100 text-blue-800 border-blue-300'
    return 'bg-gray-100 text-gray-800 border-gray-300'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Live Visitors</h1>
            <p className="text-sm text-muted-foreground">Track real-time user activity and behavior</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin" className="h-10 px-4 rounded-xl border border-border bg-card inline-flex items-center text-sm">
              Analytics
            </Link>
            <Link href="/admin/orders" className="h-10 px-4 rounded-xl border border-border bg-card inline-flex items-center text-sm">
              Orders
            </Link>
            <button onClick={handleLogout} className="h-10 px-4 rounded-xl border border-border bg-card text-sm">
              Logout
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['24h', '7d', '30d'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setRange(option)}
              className={`h-9 px-3 rounded-lg text-sm border ${range === option ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border'}`}
            >
              {option === '24h' ? 'Last 24 Hours' : option === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>

        {loading && <div className="rounded-xl border border-border bg-card p-6">Loading visitor data...</div>}
        {error && <div className="rounded-xl border border-red-300 bg-red-50 text-red-600 p-6">{error}</div>}

        {data && !loading && !error && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KpiCard
                title="Unique Visitors"
                value={String(data.summary.uniqueVisitors)}
                icon="👥"
              />
              <KpiCard
                title="Cart Users"
                value={String(data.summary.cartUsers)}
                icon="🛒"
              />
              <KpiCard
                title="Conversions"
                value={String(data.summary.conversions)}
                icon="✓"
              />
              <KpiCard
                title="Conversion Rate"
                value={`${data.summary.conversionRate}%`}
                icon="📈"
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <StatCard
                label="Total Page Views"
                value={data.summary.totalPageViews}
                icon="Eye"
              />
              <StatCard
                label="Avg Session Duration"
                value={`${data.summary.avgSessionDuration}s`}
                icon="Clock"
              />
              <StatCard
                label="Page Views per Visitor"
                value={data.summary.uniqueVisitors > 0 
                  ? (data.summary.totalPageViews / data.summary.uniqueVisitors).toFixed(1)
                  : '0'
                }
                icon="TrendingUp"
              />
            </div>

            {selectedSession && sessionDetails ? (
              <SessionDetailsView
                details={sessionDetails}
                onClose={() => {
                  setSelectedSession(null)
                  setSessionDetails(null)
                }}
              />
            ) : (
              <VisitorsTable
                visitors={data.visitors}
                onSelectSession={(sessionId) => {
                  setSelectedSession(sessionId)
                  loadSessionDetails(sessionId)
                }}
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}

function KpiCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-lg md:text-xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  const Icon = icon === 'Eye' ? Eye : icon === 'Clock' ? Clock : TrendingUp
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
      <div className="p-2 bg-accent/10 rounded-lg">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  )
}

function VisitorsTable({ visitors, onSelectSession }: { visitors: Visitor[]; onSelectSession: (sessionId: string) => void }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Last Path</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Pages</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Products Viewed</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Last Seen</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody>
            {visitors.slice(0, 50).map((visitor) => (
              <tr
                key={visitor.sessionId}
                onClick={() => onSelectSession(visitor.sessionId)}
                className="border-b border-border/50 hover:bg-muted/50 cursor-pointer transition"
              >
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${
                    visitor.conversionStatus === 'converted' 
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : visitor.conversionStatus === 'cart_user'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-100 text-gray-800 border-gray-300'
                  }`}>
                    {visitor.conversionStatus === 'converted' 
                      ? '✓ Completed Order'
                      : visitor.conversionStatus === 'cart_user'
                      ? '🛒 Cart User'
                      : '👁️ Visitor'
                    }
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground truncate">{visitor.lastPath}</td>
                <td className="px-4 py-3 text-sm font-semibold">{visitor.pageViews}</td>
                <td className="px-4 py-3 text-sm">
                  {visitor.productsViewed.length > 0 ? (
                    <span className="text-xs bg-accent/10 px-2 py-1 rounded">{visitor.productsViewed.length}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{visitor.lastSeen}</td>
                <td className="px-4 py-3 text-sm font-semibold">{visitor.sessionDuration}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visitors.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No visitors yet</div>
      )}
    </div>
  )
}

function SessionDetailsView({ details, onClose }: { details: any; onClose: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <button
        onClick={onClose}
        className="mb-4 px-3 py-1 rounded-lg border border-border bg-muted hover:bg-muted/80 text-sm"
      >
        ← Back to Visitors
      </button>

      <h2 className="text-xl font-bold mb-4">Session Details</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-muted-foreground">Session ID</p>
          <p className="text-sm font-mono break-all">{details.sessionId}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Session Duration</p>
          <p className="text-sm font-semibold">{details.sessionDuration}s</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">First Seen</p>
          <p className="text-sm">{details.firstSeen}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Last Seen</p>
          <p className="text-sm">{details.lastSeen}</p>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-semibold mb-4">User Journey ({details.events.length} events)</h3>
        <div className="space-y-3">
          {details.events.map((event: any, index: number) => (
            <div key={index} className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-accent uppercase">{event.type}</span>
                    <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.path}</p>
                  {event.productName && (
                    <p className="text-sm font-semibold mt-1">📦 {event.productName}</p>
                  )}
                  {event.quantity && (
                    <p className="text-xs text-muted-foreground">Qty: {event.quantity}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
