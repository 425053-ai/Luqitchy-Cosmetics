"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "burgundy",
  name: "Burgundy",
  image: "/images/burgundy.jpeg",
  price: 99,
  color: "from-red-800 to-red-950",
  features: ["Intense pigmentation", "Hydrating formula", "Smooth application", "All-day wear"],
  description: "Embrace the classic elegance of Burgundy 💋 A luxurious lip gloss in a deep, rich berry shade with enchanting cherry undertones. Designed to give you full, bold, and sophisticated lips with a color that lasts all day and exceptional hydration.",
}

export default function BurgundyPage() {
  return <ProductPage product={product} />
}

