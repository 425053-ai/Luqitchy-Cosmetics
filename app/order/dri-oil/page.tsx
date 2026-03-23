"use client"

import { ProductPage } from "@/components/product-page"

const product = {
  id: "dri-oil",
  name: "Dry Oil",
  image: "/images/dri-oil.jpeg",
  price: 250,
  oldPrice: 350,
  color: "from-yellow-400 to-amber-500",
  features: [
    "خفيف جدًا على البشرة",
    "يمتص بسرعة من غير greasy feeling",
    "لمعة صحية وجذابة",
    "ريحة أنثوية ناعمة",
  ],
  description: `✨ Glow من غير أي إحساس دهني ✨  

لو بتحبي بشرتك تبقى ناعمة، لامعة، وريحتها تحفة… يبقى الـ Dry Oil ده معمول علشانك 💖  

💧 خفيف جدًا على البشرة  
💧 بيمتص بسرعة من غير ما يسيب أي greasy feeling  
💧 بيدي لمعة صحية وجذابة (مش لامعة زيادة)  
💧 بريحة أنثوية ناعمة تخليكي دايمًا fresh  

استخدميه بعد الشاور أو قبل الخروج علشان بشرتك تبقى soft & glowing طول اليوم ✨  

✨ لأنك تستاهلي تباني دايمًا بأحلى شكل ✨`,
}

export default function DriOilPage() {
  return <ProductPage product={product} />
}
