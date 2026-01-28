"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "body-lotion-splash-mulberry",
  name: "Body Lotion + Splash Bundle - Mulberry",
  image: "/images/body-lotion-splash-mulberry.png",
  price: 300,
  color: "from-purple-600 to-pink-600",
  features: ["Luxurious hydrating lotion", "Refreshing fragrant splash", "Premium packaging", "Perfect gift set"],
  description: "The exclusive Mulberry Luxury Bundle 🫐✨ An exceptional skincare experience combining a deeply hydrating premium body lotion with a refreshing fragrant splash featuring the enchanting scent of wild berries. A rich formula that gives your skin ultimate softness and a fragrance that lasts all day. The perfect gift for someone you love!",
}

export default function BodyLotionSplashPage() {
  return <ProductPage product={product} />
}
