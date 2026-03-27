"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "creamy-blusher",
  name: "Creamy Blush\n\" Strawberry Kiss \"",
  image: "/images/creamy-blusher.jpeg",
  price: 95,
  oldPrice: 150,
  color: "from-pink-400 to-rose-500",
  shadeOptions: ["Strawberry Kiss"],
  features: [
    "Texture كريمي ناعم بيدوب على البشرة",
    "لون بينك حيوي يناسب كل الـ vibes",
    "Blend بسهولة من غير ما يسيب بقع",
    "Finish glossy يخلي وشك منور طول اليوم",
  ],
  description: `💗 مش بلاشر… ده glow بيحكي عنك  

لو عايزة لون طبيعي يخلي خدودك باينة صحية ومليانة حياة…  
الـ Creamy Blush ده معمول علشانك ✨  

• Texture كريمي ناعم بيدوب على البشرة  
• لون بينك حيوي يناسب كل الـ vibes 💕  
• Blend بسهولة من غير ما يسيب بقع  
• Finish glossy يخلي وشك منور طول اليوم  

حطي نقطة واحدة بس… وهتشوفي الفرق بنفسك 👀  

✨ خلي خدودك تقول "أنا الـ main character"  

اطلبيه دلوقتي قبل ما يخلص 💖`,
}

export default function CreamyBlusherPage() {
  return <ProductPage product={product} />
}
