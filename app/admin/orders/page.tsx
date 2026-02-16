'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, FileSpreadsheet, RefreshCw, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminOrdersPage() {
  const [downloading, setDownloading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleDownload = async () => {
    if (downloading) return
    setDownloading(true)
    setStatus(null)

    try {
      const response = await fetch('/api/downloadOrders')

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || `فشل التنزيل (${response.status})`)
      }

      // Get the blob and download it
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      // Extract filename from Content-Disposition header
      const disposition = response.headers.get('Content-Disposition')
      const filenameMatch = disposition?.match(/filename="(.+)"/)
      a.download = filenameMatch?.[1] || `Luqitchy-Orders-${new Date().toISOString().split('T')[0]}.xlsx`

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setStatus({ type: 'success', message: 'تم تنزيل ملف الطلبات بنجاح! ✅' })
    } catch (error: any) {
      console.error('Download error:', error)
      setStatus({ type: 'error', message: error.message || 'فشل تنزيل ملف الطلبات' })
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-pink-200 dark:border-pink-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-pink-500 hover:text-pink-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-pink-500" />
              إدارة الطلبات
            </h1>
          </div>
          <Link
            href="/admin/transfers"
            className="text-sm text-pink-500 hover:text-pink-600 underline transition-colors"
          >
            التحويلات البنكية
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-pink-100 dark:border-pink-900 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-8 text-white text-center">
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-2">تنزيل ملف الطلبات (Excel)</h2>
            <p className="text-pink-100 text-sm">
              يتم جلب كل الطلبات من Google Sheets وتحويلها لملف Excel
            </p>
          </div>

          {/* Download Section */}
          <div className="p-6 space-y-6">
            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200" dir="rtl">
              <p className="font-semibold mb-2">📋 كيف يعمل النظام:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>كل طلب جديد يتحفظ تلقائياً في Google Sheets</li>
                <li>لما تضغط &quot;تنزيل&quot; بيجيب كل الطلبات ويعملها ملف Excel</li>
                <li>الملف بيتنزل على جهازك مباشرة</li>
                <li>يعمل من الموبايل والكمبيوتر</li>
              </ul>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg disabled:cursor-not-allowed"
            >
              {downloading ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  جاري التنزيل...
                </>
              ) : (
                <>
                  <Download className="w-6 h-6" />
                  تنزيل ملف الطلبات (Excel)
                </>
              )}
            </button>

            {/* Status Message */}
            {status && (
              <div
                className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium ${
                  status.type === 'success'
                    ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}
                dir="rtl"
              >
                {status.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                {status.message}
              </div>
            )}

            {/* Direct Google Sheets Link */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400" dir="rtl">
                أو يمكنك فتح{' '}
                <a
                  href="https://docs.google.com/spreadsheets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600 underline font-medium"
                >
                  Google Sheets
                </a>{' '}
                مباشرة لمشاهدة الطلبات في الوقت الحقيقي
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
