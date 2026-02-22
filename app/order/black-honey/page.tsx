"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "black-honey",
  name: "Lipgloss Black Honey",
  image: "/images/black-honey.jpeg",
  price: 99,
  color: "from-amber-700 to-amber-900",
  features: ["Long-lasting formula", "Vitamin E enriched", "Non-sticky texture", "Buildable coverage"],
  description: "Discover the luxurious beauty of Black Honey ✨ A stunning lip gloss in a warm honey-brown shade with a captivating golden shimmer that gives your lips a natural, elegant look and a plump, irresistible appearance. Its rich Vitamin E formula keeps your lips moisturized all day long.",
}

export default function BlackHoneyPage() {
  return <ProductPage product={product} />
}
