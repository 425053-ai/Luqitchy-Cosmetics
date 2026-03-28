"use client"

import { useState } from "react"
import { Upload, AlertCircle, Check, X } from "lucide-react"
import { compressImage } from "@/lib/image-compression"

interface PaymentConfirmationUploadProps {
  transferImage: File | null
  imagePreview: string
  onImageChange: (file: File | null, preview: string) => void
  isRequired?: boolean
  disabled?: boolean
}

export function PaymentConfirmationUpload({
  transferImage,
  imagePreview,
  onImageChange,
  isRequired = true,
  disabled = false,
}: PaymentConfirmationUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string>("")
  const [isCompressing, setIsCompressing] = useState(false)

  const handleImageChange = async (file: File | null) => {
    setError("")
    if (!file) {
      onImageChange(null, "")
      return
    }

    setIsCompressing(true)
    try {
      const result = await compressImage(file)
      onImageChange(result.file, result.preview)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image")
      onImageChange(null, "")
    } finally {
      setIsCompressing(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleImageChange(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0] || null
    handleImageChange(file)
  }

  const handleRemoveImage = () => {
    onImageChange(null, "")
    setError("")
  }

  return (
    <div className="space-y-4">
      {/* Header with Required Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">📸 Payment Confirmation</h3>
            {isRequired && (
              <span className="inline-block px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                Required
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Requirements Box */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-300 dark:border-blue-800 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Screenshot must clearly show:
            </h4>
            <ul className="space-y-1.5 text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-start gap-2">
                <span className="text-lg mt-0">✓</span>
                <span>Your Vodafone Cash wallet transaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg mt-0">✓</span>
                <span>Amount paid</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg mt-0">✓</span>
                <span>Payment status (Completed/Success)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg mt-0">✓</span>
                <span>Receiver number: <span className="font-semibold text-amber-600 dark:text-amber-400">01012622315</span></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Area or Image Preview */}
      {imagePreview ? (
        <div className="rounded-lg border-2 border-dashed border-green-300 bg-green-50 dark:bg-green-950/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-700 dark:text-green-300">Screenshot uploaded successfully</span>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled || isCompressing}
              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              aria-label="Remove screenshot"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>

          {/* Image Preview */}
          <div className="relative rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800">
            <img
              src={imagePreview}
              alt="Payment confirmation preview"
              className="w-full h-auto max-h-64 object-contain"
            />
          </div>

          {/* Change Image Button */}
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              disabled={disabled || isCompressing}
              className="hidden"
              aria-label="Choose new screenshot"
            />
            <button
              type="button"
              onClick={() => {
                const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                input?.click();
              }}
              disabled={disabled || isCompressing}
              className="w-full px-4 py-2 text-sm font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg transition-colors disabled:opacity-50"
            >
              {isCompressing ? "Processing..." : "Change Screenshot"}
            </button>
          </label>
        </div>
      ) : (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative block rounded-lg border-2 border-dashed transition-all cursor-pointer p-8 text-center ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-slate-300 dark:border-slate-600 hover:border-primary hover:bg-primary/5"
          } ${disabled || isCompressing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            disabled={disabled || isCompressing}
            className="hidden"
            aria-label="Upload payment confirmation screenshot"
          />

          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="w-6 h-6 text-primary" />
              </div>
            </div>

            <div>
              <p className="text-base font-semibold text-foreground">
                {isCompressing ? "Processing image..." : "Click to select screenshot"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">or drag screenshot here</p>
            </div>

            <p className="text-xs text-muted-foreground">
              JPG or PNG - Maximum 5MB
            </p>
          </div>
        </label>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Info Message */}
      {!imagePreview && !error && (
        <div className="text-sm text-muted-foreground text-center py-2">
          {isRequired && (
            <p className="text-amber-600 dark:text-amber-400">
              ⚠️ Payment confirmation is required to complete your order
            </p>
          )}
        </div>
      )}
    </div>
  )
}
