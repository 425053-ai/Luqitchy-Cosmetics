"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "wine",
  name: "Lipgloss Wine",
  image: "/images/wine.jpeg",
  price: 99,
  color: "from-red-600 to-red-800",
  features: ["High-shine finish", "Moisturizing blend", "Fade-resistant", "Comfortable wear"],
  description: "Shine with the captivating charm of Wine 🍷 An elegant lip gloss in a sophisticated wine-inspired shade with a luxurious high-shine finish that adds irresistible allure to your lips. Its moisturizing formula keeps your lips soft while providing long-lasting wear.",
}

export default function WinePage() {
  return <ProductPage product={product} />
}
