"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "body-lotion-splash-sugar-drop",
  name: "Body Lotion + Splash Bundle - Sugar Drop",
  image: "/images/Body Lotion + Splash Bundle - Sugar Drop.png",
  price: 300,
  color: "from-pink-400 to-orange-300",
  features: ["Luxurious hydrating lotion", "Refreshing fragrant splash", "Premium packaging", "Perfect gift set"],
  description: "The enchanting Sugar Drop Beauty Bundle 🍬💖 Immerse yourself in a world of sweetness with this luxurious set! A moisturizing lotion with a rich, creamy formula that melts into your skin, paired with a refreshing fragrant splash featuring an irresistibly sweet sugar scent. Pamper yourself with a unique skincare experience!",
}

export default function BodyLotionSplashSugarDropPage() {
  return <ProductPage product={product} />
}
