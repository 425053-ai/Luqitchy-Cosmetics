import { HeroSkeleton, ProductGridSkeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="w-32 h-6 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="hidden md:flex items-center gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-4 bg-muted animate-pulse rounded" />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-muted animate-pulse rounded-full" />
              <div className="w-9 h-9 bg-muted animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <HeroSkeleton />

      {/* Products Section Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-48 h-8 bg-muted animate-pulse rounded-lg mx-auto mb-4" />
            <div className="w-96 max-w-full h-4 bg-muted animate-pulse rounded mx-auto" />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </section>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-card/90 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-lg flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    </main>
  )
}
