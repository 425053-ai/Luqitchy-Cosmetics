"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "eyebrow-gel-10g",
  name: "Eyebrow Gel",
  image: "/images/eyebrow-gel-20g.jpeg",
  price: 60,
  color: "from-gray-200 to-gray-400",
  features: [
    "10g size",
    "Natural shaping",
    "All-day hold",
    "Easy to use",
    "Suitable for all brow types",
  ],
  description:
    "Brow gel for natural shaping and all-day hold. Size: 10g.",
}

export default function EyebrowGel10gPage() {
  return <ProductPage product={product} />
}
