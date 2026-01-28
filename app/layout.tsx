import type React from "react"
import type { Metadata, Viewport } from "next"
import { Quicksand, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/context/CartContext"
import { WishlistProvider } from "@/context/WishlistContext"
import { OrderHistoryProvider } from "@/context/OrderHistoryContext"
import { ToastProvider } from "@/components/ui/toast"
import { SkipLink } from "@/components/skip-link"
import "./globals.css"

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Luqitchy Cosmetics | Premium Lip Gloss & Beauty Products in Egypt",
  description:
    "Highlight Your Beauty With Our Touches. Shop premium lip glosses in stunning shades - Black Honey, Burgundy, Wine, Mocha & Strawberry Milk. Plus nourishing lip balm and luxurious body lotions. 100% Cruelty-Free. Fast delivery across Egypt.",
  generator: "v0.app",
  keywords: [
    "cosmetics", "beauty", "lip gloss", "Luqitchy", "premium cosmetics", "makeup",
    "lip balm", "body lotion", "Egyptian cosmetics", "cruelty free makeup",
    "Black Honey lip gloss", "Burgundy lip gloss", "Wine lip gloss", "Mocha lip gloss",
    "Strawberry Milk lip gloss", "مكياج", "جلوس", "كوزمتيكس"
  ],
  authors: [{ name: "Luqitchy Cosmetics" }],
  creator: "Luqitchy Cosmetics",
  publisher: "Luqitchy Cosmetics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://luqitchy.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Luqitchy Cosmetics | Premium Lip Gloss & Beauty Products",
    description: "Highlight Your Beauty With Our Touches. Shop premium lip glosses, lip balm, and body lotions. 100% Cruelty-Free. Fast delivery across Egypt.",
    url: "https://luqitchy.com",
    siteName: "Luqitchy Cosmetics",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Luqitchy Cosmetics - Premium Beauty Products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luqitchy Cosmetics | Premium Beauty Products",
    description: "Highlight Your Beauty With Our Touches. Premium lip glosses, lip balm & body lotions.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  category: "beauty",
}

export const viewport: Viewport = {
  themeColor: "#f8b4d9",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Luqitchy Cosmetics",
              "url": "https://luqitchy.com",
              "logo": "https://luqitchy.com/images/logo.jpeg",
              "description": "Premium cosmetics featuring lip glosses, lip balm, and body lotions. 100% Cruelty-Free.",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Arabic"]
              },
              "sameAs": [
                "https://www.instagram.com/luqitchyglossy",
                "https://www.tiktok.com/@luqitchyglossy3"
              ]
            })
          }}
        />
        {/* Structured Data for Products */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Luqitchy Cosmetics Products",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "item": {
                    "@type": "Product",
                    "name": "Black Honey Lip Gloss",
                    "description": "Premium lip gloss in Black Honey shade",
                    "brand": { "@type": "Brand", "name": "Luqitchy Cosmetics" },
                    "offers": { "@type": "Offer", "priceCurrency": "EGP", "price": "165" }
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "item": {
                    "@type": "Product",
                    "name": "Burgundy Lip Gloss",
                    "description": "Premium lip gloss in Burgundy shade",
                    "brand": { "@type": "Brand", "name": "Luqitchy Cosmetics" },
                    "offers": { "@type": "Offer", "priceCurrency": "EGP", "price": "165" }
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${quicksand.variable} ${playfair.variable} font-sans antialiased`}>
        <SkipLink />
        <CartProvider>
          <WishlistProvider>
            <OrderHistoryProvider>
              <ToastProvider>
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>
                <Analytics />
              </ToastProvider>
            </OrderHistoryProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
