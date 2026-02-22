"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "strawberry-milk",
  name: "Lipgloss Strawberry Milk",
  image: "/images/strawberry-milk.jpeg",
  price: 99,
  color: "from-pink-400 to-pink-600",
  features: ["Delicious scent", "Plumping effect", "Sheer to full coverage", "Refreshing formula"],
  description: "Enjoy the sweet magic of Strawberry Milk 🍓 A dreamy pink lip gloss with a creamy, luminous finish. The delicious strawberry scent combined with a plumping effect gives you a youthful, refreshing, and irresistibly attractive look.",
}

export default function StrawberryMilkPage() {
  return <ProductPage product={product} />
}
