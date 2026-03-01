"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "creamy-blusher",
  name: "Creamy Blusher",
  image: "/images/creamy-blusher.jpeg",
  price: 95,
  oldPrice: 125,
  color: "from-pink-400 to-rose-500",
  shadeOptions: ["Hotty", "Hazelnut", "Pinky"],
  features: [
    "Super long lasting",
    "Easy to blend",
    "Natural hydrated finish",
    "Shades: Hotty, Hazelnut, Pinky",
  ],
  description:
    "Our creamy blusher formula gives a natural look, smooth blend, and skin-safe hydration with beautiful shades for every mood.",
}

export default function CreamyBlusherPage() {
  return <ProductPage product={product} />
}
