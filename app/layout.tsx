import type React from "react"
import type { Metadata, Viewport } from "next"
import { Quicksand, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
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
  title: "Luqitchy Cosmetics | Premium Beauty Products",
  description:
    "Highlight Your Beauty With Our Touches. Discover high-end quality cosmetics in stunning shades - Black Honey, Burgundy, Wine, Mocha, and Strawberry Milk.",
  generator: "v0.app",
  keywords: ["cosmetics", "beauty", "lip gloss", "Luqitchy", "premium cosmetics", "makeup"],
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
    <html lang="en">
      <body className={`${quicksand.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
