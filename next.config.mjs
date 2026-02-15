/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize images for production
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 440, 640, 750, 828, 1080, 1440, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Unoptimized for development speed, will be optimized in production
    unoptimized: process.env.NODE_ENV === 'development',
    // Cache behavior
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Production optimizations
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  // Next.js 13+ optimizations
  reactStrictMode: false,
  // Incremental static regeneration
  experimental: {
    optimizeServerSideProps: true,
  },
}

export default nextConfig
