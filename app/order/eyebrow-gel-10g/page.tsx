"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "eyebrow-gel-10g",
  name: "Eyebrow Gel 10g",
  image: "/images/eyebrow-gel-10g.jpeg",
  images: ["/images/eyebrow-gel-10g.jpeg", "/images/eyebrow-gel-10g-2.jpeg"],
  price: 35,
  oldPrice: 100,
  color: "from-gray-200 to-gray-400",
  features: [
    "10g size",
    "Natural shaping",
    "All-day hold",
    "Easy to use",
    "Suitable for all brow types",
  ],
  description: "Brow gel for natural shaping and all-day hold. Size: 10g.",
  imageMetadata: {
    width: 1200,
    height: 1200,
    alt: "Eyebrow Gel 10g - Premium Brow Styling Product",
  }
}

export default function EyebrowGel10gPage() {
  return <ProductPage product={product} />
}
