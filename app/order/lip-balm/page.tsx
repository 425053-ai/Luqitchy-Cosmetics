"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "lip-balm",
  name: "Lip Balm",
  image: "/images/lip-balm.jpeg",
  price: 65,
  color: "from-rose-500 to-pink-500",
  features: ["Moisturizing formula", "Natural ingredients", "Subtle shine", "Portable size"],
  description: "The perfect care for your lips with Lip Balm 💋✨ A premium lip balm with natural ingredients that moisturizes and protects your lips from dryness. Its lightweight formula gives you a subtle shine and a feeling of softness all day long. The perfect size for your bag for instant care anytime!",
}

export default function LipBalmPage() {
  return <ProductPage product={product} />
}
