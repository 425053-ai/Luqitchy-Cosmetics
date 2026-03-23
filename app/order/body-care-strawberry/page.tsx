"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "body-care-strawberry",
  name: "Body Care",
  image: "/images/body-care-strawberry.jpeg",
  price: 199,
  oldPrice: 250,
  color: "from-pink-400 to-rose-500",
  features: [
    "ريحة حلوة من Strawberry Pound Cake",
    "حجم صغير يناسب الشنطة",
    "لوشن + سبلاش",
    "إحساس نظافة وأنوثة",
  ],
  description: `🍓 Strawberry Pound Cake vibes 🍓  

Mini size… max love 💕  
لوشن + سبلاش يخلوكي دايمًا fresh، sweet، و irresistible  

✨ ريحة حلوة… تدلعك طول اليوم  
✨ حجم صغير يناسب الشنطة والخروجات  
✨ إحساس نظافة وأنوثة من أول رشّة  

💖 Your sweet moment, anywhere 💖`,
}

export default function BodyCareStrawberryPage() {
  return <ProductPage product={product} />
}
