'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TransferProof {
  orderId: string
  customerName: string
  customerEmail: string
  phone: string
  amount: string
  uploadedAt: string
  imageData?: string
  imageMime?: string
  verified?: boolean
}

export default function AdminDashboard() {
  const [transferProofs, setTransferProofs] = useState<TransferProof[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedImage, setSelectedImage] = useState<TransferProof | null>(null)

  useEffect(() => {
    // Load from localStorage
    const savedProofs = localStorage.getItem('transfer-proofs')
    if (savedProofs) {
      try {
        setTransferProofs(JSON.parse(savedProofs))
      } catch (e) {
        console.error('Failed to load proofs:', e)
      }
    }
    setLoading(false)
  }, [])

  const handleVerify = (orderId: string) => {
    const updated = transferProofs.map(p =>
      p.orderId === orderId ? { ...p, verified: true } : p
    )
    setTransferProofs(updated)
    localStorage.setItem('transfer-proofs', JSON.stringify(updated))
  }

  const filteredProofs =
    filter === 'all'
      ? transferProofs
      : transferProofs.filter((p) =>
          filter === 'verified' ? p.verified : !p.verified
        )

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin">⏳</div>
        <p>جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← العودة للموقع
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📸 لوحة تحكم التحويلات البنكية
          </h1>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">إجمالي الطلبات</p>
              <p className="text-3xl font-bold text-pink-600">{transferProofs.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">قيد المراجعة</p>
              <p className="text-3xl font-bold text-amber-600">
                {transferProofs.filter(p => !p.verified).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">مؤكد</p>
              <p className="text-3xl font-bold text-green-600">
                {transferProofs.filter(p => p.verified).length}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { value: 'all', label: '📋 الكل', color: 'gray' },
            { value: 'pending', label: '⏳ قيد المراجعة', color: 'amber' },
            { value: 'verified', label: '✅ مؤكد', color: 'green' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === tab.value
                  ? `bg-${tab.color}-500 text-white shadow-lg`
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transfer Proofs Grid */}
        {filteredProofs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-xl text-gray-500">لا توجد طلبات في هذه الفئة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProofs.map((proof) => (
              <div
                key={proof.orderId}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* Image Preview */}
                {proof.imageData && (
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={`data:${proof.imageMime || 'image/jpeg'};base64,${proof.imageData}`}
                      alt="Transfer proof"
                      className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                      onClick={() => setSelectedImage(proof)}
                    />
                  </div>
                )}

                {/* Order Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      #{proof.orderId}
                    </h3>
                    {proof.verified ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        ✅ مؤكد
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                        ⏳ قيد المراجعة
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">العميل</p>
                      <p className="font-semibold text-gray-800">{proof.customerName}</p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs">البريد الإلكتروني</p>
                      <p className="font-mono text-blue-600 text-xs break-all">
                        {proof.customerEmail}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs">الهاتف</p>
                      <p className="font-semibold text-gray-800" dir="ltr">
                        {proof.phone}
                      </p>
                    </div>

                    <div className="bg-pink-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">المبلغ</p>
                      <p className="text-2xl font-bold text-pink-600">{proof.amount} EGP</p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs">التاريخ</p>
                      <p className="text-gray-700">{proof.uploadedAt}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    {!proof.verified && (
                      <button
                        onClick={() => handleVerify(proof.orderId)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                      >
                        ✅ تأكيد الدفع
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedImage(proof)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                    >
                      👁️ عرض كامل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-white rounded-xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-between">
                <h3 className="text-xl font-bold">#{selectedImage.orderId} - صورة التحويل</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-2xl hover:bg-white/20 p-1 rounded transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                {selectedImage.imageData && (
                  <img
                    src={`data:${selectedImage.imageMime || 'image/jpeg'};base64,${selectedImage.imageData}`}
                    alt="Full transfer proof"
                    className="w-full rounded-lg border-2 border-gray-200"
                  />
                )}

                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">المبلغ</p>
                      <p className="text-2xl font-bold text-pink-600">{selectedImage.amount} EGP</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">التاريخ</p>
                      <p className="text-lg font-semibold">{selectedImage.uploadedAt}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700"><strong>العميل:</strong> {selectedImage.customerName}</p>
                    <p className="text-gray-700"><strong>البريد:</strong> {selectedImage.customerEmail}</p>
                    <p className="text-gray-700"><strong>الهاتف:</strong> {selectedImage.phone}</p>
                  </div>
                </div>

                {!selectedImage.verified && (
                  <button
                    onClick={() => {
                      handleVerify(selectedImage.orderId)
                      setSelectedImage(null)
                    }}
                    className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    ✅ تأكيد الدفع
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
