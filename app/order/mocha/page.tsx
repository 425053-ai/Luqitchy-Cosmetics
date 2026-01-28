"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "mocha",
  name: "Mocha",
  image: "/images/mocha.jpeg",
  price: 100,
  color: "from-amber-800 to-amber-950",
  features: ["Universal shade", "Nourishing oils", "Subtle shimmer", "Lightweight feel"],
  description: "Indulge in the creamy warmth of Mocha ☕ A gorgeous lip gloss in a warm nude shade inspired by luxurious coffee. A universally flattering color that gives you a naturally elegant look with nourishing oils for silky-smooth lips.",
}

export default function MochaPage() {
  return <ProductPage product={product} />
}
