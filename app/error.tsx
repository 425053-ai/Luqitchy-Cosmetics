"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-secondary via-background to-background">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/30 animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            We&apos;re sorry, but something unexpected happened. Don&apos;t worry, your data is safe.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center gap-2 text-2xl">
          <span className="animate-bounce" style={{ animationDelay: "0s" }}>💄</span>
          <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>💖</span>
          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>✨</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="gap-2 rounded-full px-8"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Button>
          <Link href="/">
            <Button
              size="lg"
              className="gap-2 rounded-full px-8 w-full sm:w-auto luxury-btn"
            >
              <Home className="w-5 h-5" />
              Return Home
            </Button>
          </Link>
        </div>

        {/* Go Back */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </button>

        {/* Debug info (development only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-card rounded-xl border border-border text-left">
            <p className="text-xs text-muted-foreground mb-2">Error Details (Development Only):</p>
            <p className="text-sm font-mono text-red-500 break-all">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">Digest: {error.digest}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
