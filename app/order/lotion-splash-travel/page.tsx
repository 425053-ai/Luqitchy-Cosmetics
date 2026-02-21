"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "lotion-splash-travel",
  name: "Lotion & Splash travel Size",
  image: "/images/lotion-splash-travel.jpeg",
  price: 175,
  color: "from-pink-300 to-purple-400",
  features: [
    "Travel-friendly size",
    "Mixed scent dupe Burberry Her & Strawberry Bound Cake",
    "Strawberry and berry mix for refreshment",
    "Stability for 8 hours",
    "Perfect after shower",
  ],
  description:
    "Mixed scent dupe Burberry Her and Strawberry Bound Cake. Strawberry and berry mix to give you the feeling of refreshment after showering. Stability for 8 hours.",
}

export default function LotionSplashTravelPage() {
  return <ProductPage product={product} />
}
