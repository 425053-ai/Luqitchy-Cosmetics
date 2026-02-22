"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Star, Quote, ChevronLeft, ChevronRight, Verified } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Sara Ahmed",
    avatar: "👩",
    rating: 5,
    product: "Black Honey Lip Gloss",
    review: "Absolutely love this lip gloss! The color is stunning and it stays on for hours. My new favorite! 💕",
    date: "2 days ago",
    verified: true,
    image: "/images/black-honey.jpeg"
  },
  {
    id: 2,
    name: "Nour Mohamed",
    avatar: "👧",
    rating: 5,
    product: "Burgundy Lip Gloss",
    review: "The best lip gloss I've ever tried! So moisturizing and the color is perfect for everyday wear. Highly recommend! ⭐",
    date: "1 week ago",
    verified: true,
    image: "/images/burgundy.jpeg"
  },
  {
    id: 3,
    name: "Mariam Hassan",
    avatar: "👩‍🦱",
    rating: 5,
    product: "Strawberry Milk Lip Gloss",
    review: "OMG! This smells amazing and looks so pretty! I got so many compliments. Will definitely order again! 🍓",
    date: "3 days ago",
    verified: true,
    image: "/images/strawberry-milk.jpeg"
  },
  {
    id: 4,
    name: "Yasmin Ali",
    avatar: "👱‍♀️",
    rating: 5,
    product: "Body Lotion Splash",
    review: "The body lotion is heavenly! My skin feels so soft and the scent lasts all day. Love it! 🌸",
    date: "5 days ago",
    verified: true,
    image: "/images/body-lotion-splash-mulberry.jpeg"
  },
  {
    id: 5,
    name: "Hana Ibrahim",
    avatar: "👩‍🦰",
    rating: 5,
    product: "Mocha Lip Gloss",
    review: "Perfect nude shade! Goes with everything and the formula is non-sticky. 10/10 would recommend! ☕",
    date: "1 week ago",
    verified: true,
    image: "/images/mocha.jpeg"
  },
  {
    id: 6,
    name: "Layla Mahmoud",
    avatar: "👩‍🦳",
    rating: 5,
    product: "Wine Lip Gloss",
    review: "Such a gorgeous deep color! Perfect for special occasions. The quality is amazing for the price! 🍷",
    date: "4 days ago",
    verified: true,
    image: "/images/wine.jpeg"
  },
]

export function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-purple-50/30 dark:via-purple-950/10 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-8xl opacity-5">💬</div>
        <div className="absolute bottom-20 right-10 text-8xl opacity-5">⭐</div>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <Star className="w-8 h-8 fill-current" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              What Our Customers Say
            </span>
          </h2>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold">{averageRating}</span>
            <span className="text-muted-foreground">({reviews.length} reviews)</span>
          </div>
          
          {/* Happy customers line removed as per request */}
        </motion.div>

        {/* Featured Review Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Product Image */}
                <div className="w-32 h-32 md:w-48 md:h-48 relative rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                  <Image
                    src={reviews[currentIndex].image}
                    alt={reviews[currentIndex].product}
                    fill
                    className="object-cover"
                    priority
                    loading="eager"
                  />
                </div>

                {/* Review Content */}
                <div className="flex-1 text-center md:text-left">
                  <Quote className="w-10 h-10 text-pink-300 mb-4 mx-auto md:mx-0" />
                  
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-6 italic">
                    "{reviews[currentIndex].review}"
                  </p>

                  <div className="flex items-center gap-1 justify-center md:justify-start mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < reviews[currentIndex].rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <span className="text-3xl">{reviews[currentIndex].avatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{reviews[currentIndex].name}</span>
                        {reviews[currentIndex].verified && (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            <Verified className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reviews[currentIndex].product} • {reviews[currentIndex].date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-pink-500 w-8"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-pink-300"
              }`}
            />
          ))}
        </div>

        {/* All Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {reviews.slice(0, 3).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                "{review.review}"
              </p>

              <div className="flex items-center gap-2">
                <span className="text-2xl">{review.avatar}</span>
                <div>
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
