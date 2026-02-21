"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "eyebrow-gel",
  name: "Eyebrow Gel",
  image: "/images/eyebrow-gel.jpeg",
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

export default function EyebrowGelPage() {
  return <ProductPage product={product} />
}
