import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { OrderForm } from "@/components/order-form"
import { ArrowLeft, Sparkles, Star, Shield, Truck, Heart } from "lucide-react"

const products = [
  {
    id: "black-honey",
    name: "Black Honey",
    description: "A rich, warm honey-brown with golden shimmer that adds a luxurious glow to your lips.",
    longDescription:
      "Indulge in the warm, sophisticated tones of Black Honey. This stunning shade features a rich honey-brown base infused with delicate golden shimmer particles that catch the light beautifully. Perfect for creating a natural, sun-kissed look or adding warmth to any makeup style.",
    image: "/images/black-honey.jpeg",
    color: "from-amber-700 to-amber-900",
    accent: "bg-amber-600",
    price: "EGP 100",
    features: ["Long-lasting formula", "Vitamin E enriched", "Non-sticky texture", "Buildable coverage"],
  },
  {
    id: "burgundy",
    name: "Burgundy",
    description: "A deep, luxurious berry red with cherry undertones for a bold, elegant look.",
    longDescription:
      "Make a statement with Burgundy - a deep, wine-inspired shade that exudes elegance and sophistication. The rich berry tones with subtle cherry undertones create a luxurious finish that's perfect for evening events or when you want to add drama to your look.",
    image: "/images/burgundy.jpeg",
    color: "from-red-800 to-red-950",
    accent: "bg-red-800",
    price: "EGP 100",
    features: ["Intense pigmentation", "Hydrating formula", "Smooth application", "All-day wear"],
  },
  {
    id: "wine",
    name: "Wine",
    description: "An elegant wine-inspired red with a glossy finish for sophisticated beauty.",
    longDescription:
      "Elevate your look with Wine - an elegant, sophisticated shade inspired by the finest vintages. This beautiful red with its glossy finish adds instant glamour to any occasion. The formula glides on smoothly, leaving lips looking plump and irresistible.",
    image: "/images/wine.jpeg",
    color: "from-red-600 to-red-800",
    accent: "bg-red-600",
    price: "EGP 100",
    features: ["High-shine finish", "Moisturizing blend", "Fade-resistant", "Comfortable wear"],
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "A creamy coffee-inspired nude with warm undertones for everyday elegance.",
    longDescription:
      "Start your day with Mocha - a creamy, coffee-inspired nude that flatters every skin tone. The warm undertones create a natural, polished look that's perfect for everyday wear. This versatile shade transitions seamlessly from day to night.",
    image: "/images/mocha.jpeg",
    color: "from-amber-800 to-amber-950",
    accent: "bg-amber-800",
    price: "EGP 100",
    features: ["Universal shade", "Nourishing oils", "Subtle shimmer", "Lightweight feel"],
  },
  {
    id: "strawberry-milk",
    name: "Strawberry Milk",
    description: "A sweet, playful pink with creamy shimmer for a youthful, fresh look.",
    longDescription:
      "Embrace your playful side with Strawberry Milk - a sweet, delightful pink that brings joy to your beauty routine. The creamy shimmer adds dimension and catches the light beautifully, creating a fresh, youthful appearance that's perfect for any occasion.",
    image: "/images/strawberry-milk.jpeg",
    color: "from-pink-400 to-pink-600",
    accent: "bg-pink-400",
    price: "EGP 100",
    features: ["Delicious scent", "Plumping effect", "Sheer to full coverage", "Refreshing formula"],
  },
  {
    id: "body-lotion-splash",
    name: "Body Lotion + Splash Bundle",
    description: "",
    longDescription: "",
    image: "",
    color: "from-purple-600 to-pink-600",
    accent: "bg-purple-500",
    price: "EGP 300",
    features: ["Hydrating lotion", "Beautifully packaged", "Refreshing splash", "Great as a gift"],
    scents: [
      {
        id: "mulberry",
        name: "Mulberry",
        description:
          "Rich, fruity-floral fragrance with deep berry notes and soft floral undertones.",
        image: "/images/body-lotion-splash-mulberry.jpeg",
      },
      {
        id: "sugar-drop",
        name: "Sugar Drop",
        description: "Light, sweet candy-like scent - airy, playful, and uplifting.",
        image: "/images/body-lotion-splash-sugardrop.jpeg",
      },
    ],
  },
  {
    id: "lip-balm",
    name: "LipBalm",
    description: "Nourishing lip care with delicious flavor and moisturizing ingredients.",
    longDescription:
      "Keep your lips soft, smooth, and moisturized with our nourishing LipBalm. Enriched with natural oils and vitamins, this silky formula provides long-lasting hydration while leaving a subtle shine. Perfect for everyday wear or as a base for lipstick.",
    image: "/images/lip-balm.jpeg",
    color: "from-rose-500 to-pink-500",
    accent: "bg-rose-400",
    price: "EGP 100",
    features: ["Moisturizing formula", "Natural ingredients", "Subtle shine", "Portable size"],
  },
]

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export default function OrderPage({ params }: { params: { id: string } }) {
  const { id } = params
  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  // For Body Lotion + Splash, default to first scent
  let selectedScent = product.scents?.[0] || null

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/#products"
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Products</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.jpeg"
                alt="Luqitchy Cosmetics"
                width={40}
                height={40}
                className="rounded-full ring-2 ring-primary/30"
              />
              <span className="font-serif text-lg font-bold gradient-text hidden sm:inline">Luqitchy</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Product Image */}
          <div className="relative perspective-1000">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-20 blur-3xl rounded-full transform scale-90`}
            />
            <div
              className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-primary/30 animate-float-slow"
              style={{
                transform: "rotateY(-3deg) rotateX(2deg)",
              }}
            >
              <Image
                src={selectedScent?.image || product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <span className="absolute -top-4 -right-4 text-4xl animate-sparkle">✨</span>
              <span className="absolute -bottom-2 -left-4 text-3xl animate-heartbeat">💖</span>
              <span className="absolute top-1/4 -right-6 text-2xl animate-float">🎀</span>
            </div>
          </div>

          {/* Product Details & Order Form */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary/80 px-4 py-2 rounded-full border border-primary/30 mb-4">
                <Sparkles className="w-4 h-4 text-accent animate-sparkle" />
                <span className="text-sm font-medium text-foreground">Premium Quality</span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                {product.name}
                {selectedScent && <> - {selectedScent.name}</>}
                <span className="ml-3 text-3xl animate-sparkle">✨</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {selectedScent?.description || product.longDescription || product.description}
              </p>

              <div className="text-3xl font-bold text-accent mb-8">{product.price}</div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                  <Truck className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                  <Heart className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Made with Love</span>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-lg shadow-primary/10">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                Place Your Order
                <span className="animate-heartbeat">💖</span>
              </h2>
              <OrderForm productName={product.name} productPrice={product.price} scents={product.scents} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
