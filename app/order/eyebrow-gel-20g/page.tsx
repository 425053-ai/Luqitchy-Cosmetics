"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "eyebrow-gel-20g",
  name: "Eyebrow Gel 20g",
  image: "/images/eyebrow-gel-20g.jpeg",
  price: 115,
  color: "from-gray-300 to-gray-500",
  features: [
    "20g size",
    "Natural shaping",
    "All-day hold",
    "Easy to use",
    "Suitable for all brow types",
  ],
  description:
    "Brow gel for natural shaping and all-day hold. Size: 20g.",
}

export default function EyebrowGel20gPage() {
  return <ProductPage product={product} />
}
