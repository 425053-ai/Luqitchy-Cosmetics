"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import emailjs from "@emailjs/browser"
import { ArrowLeft, Star } from "lucide-react"

const product = {
  id: "wine",
  name: "Wine",
  image: "/images/wine.jpeg",
  price: 100,
  features: ["High-shine finish", "Moisturizing blend", "Fade-resistant", "Comfortable wear"],
}

export default function WinePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    quantity: 1,
    notes: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const total_price = formData.quantity * product.price
    try {
      // Email to admin
      await emailjs.send(
        "service_cyg3pcs",
        "template_nn2n23j",
        {
          order_id: Date.now(),
          product_name: product.name,
          product_variant: "",
          quantity: formData.quantity,
          product_price: product.price,
          total_price,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          delivery_address: formData.address,
          customer_notes: formData.notes,
          order_time: new Date().toLocaleString(),
        },
        "ktl_e7JluBPYFFjM4"
      )
      // Email to customer
      await emailjs.send(
        "service_cyg3pcs",
        "template_nq7ayum",
        {
          order_id: Date.now(),
          product_name: product.name,
          product_variant: "",
          quantity: formData.quantity,
          product_price: product.price,
          total_price,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          delivery_address: formData.address,
          customer_notes: formData.notes,
          order_time: new Date().toLocaleString(),
          title: "Your order has been received 💖",
        },
        "ktl_e7JluBPYFFjM4"
      )
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert("حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى")
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background text-center space-y-6">
        <h1 className="text-4xl font-bold text-accent">شكراً على طلبك 💖</h1>
        <p className="text-lg">
          لقد استلمنا طلبك بنجاح. إليك تفاصيل طلبك:
        </p>
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md w-full text-left">
          <p><strong>المنتج:</strong> {product.name}</p>
          <p><strong>الكمية:</strong> {formData.quantity}</p>
          <p><strong>السعر الفردي:</strong> {product.price} EGP</p>
          <p><strong>السعر الكلي:</strong> {formData.quantity * product.price} EGP</p>
          <p><strong>الاسم:</strong> {formData.name}</p>
          <p><strong>البريد الإلكتروني:</strong> {formData.email}</p>
          <p><strong>رقم الهاتف:</strong> {formData.phone}</p>
          <p><strong>العنوان:</strong> {formData.address}</p>
          <p><strong>ملاحظات:</strong> {formData.notes}</p>
        </div>
        <Link href="/" className="mt-4 px-4 py-2 bg-accent text-white rounded-lg">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-muted-foreground hover:text-accent mb-6"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Products
      </Link>

      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-primary/30">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <div className="text-2xl font-bold text-accent">{product.price} EGP</div>
          <ul className="grid grid-cols-2 gap-2">
            {product.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-accent fill-accent" /> {f}
              </li>
            ))}
          </ul>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="الاسم الكامل"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="tel"
              name="phone"
              placeholder="رقم الهاتف"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <textarea
              name="address"
              placeholder="العنوان"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="number"
              name="quantity"
              min={1}
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
            <textarea
              name="notes"
              placeholder="ملاحظات إضافية"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="bg-accent text-white px-4 py-2 rounded-lg w-full"
            >
              تأكيد الطلب
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
