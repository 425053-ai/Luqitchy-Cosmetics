import Image from "next/image"
import Link from "next/link"

const products = [
  { id: "black-honey", name: "Black Honey", price: 100, image: "/images/black-honey.jpeg", description: "A rich, warm honey-brown with golden shimmer." },
  { id: "burgundy", name: "Burgundy", price: 100, image: "/images/burgundy.jpeg", description: "Deep, luxurious berry red with cherry undertones." },
  { id: "wine", name: "Wine", price: 100, image: "/images/wine.jpeg", description: "Elegant wine-inspired red with glossy finish." },
  { id: "mocha", name: "Mocha", price: 100, image: "/images/mocha.jpeg", description: "Creamy coffee-inspired nude with warm undertones." },
  { id: "strawberry-milk", name: "Strawberry Milk", price: 100, image: "/images/strawberry-milk.jpeg", description: "Sweet, playful pink with creamy shimmer." },
  { id: "body-lotion-splash", name: "Body Lotion + Splash Bundle", price: 300, image: "/images/body-lotion-splash-mulberry.jpeg", description: "Hydrating lotion & refreshing splash bundle." },
  { id: "lip-balm", name: "LipBalm", price: 100, image: "/images/lip-balm.jpeg", description: "Nourishing lip care with moisturizing ingredients." },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <h1 className="text-4xl font-bold text-center mb-12">Luqitchy Cosmetics 💖</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
            <div className="relative w-full aspect-[3/4]">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <div className="text-lg font-bold text-accent mb-4">{product.price} EGP</div>
              </div>
              <Link
                href={`/order/${product.id}`}
                className="mt-auto bg-accent text-white text-center py-2 rounded-lg hover:bg-accent/90 transition"
              >
                Order Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
