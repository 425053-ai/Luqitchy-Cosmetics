"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Instagram, Heart, MessageCircle, ExternalLink } from "lucide-react"

const instagramPosts = [
  {
    id: 1,
    image: "/images/black-honey.jpeg",
    likes: 234,
    comments: 18,
  },
  {
    id: 2,
    image: "/images/burgundy.jpeg",
    likes: 189,
    comments: 24,
  },
  {
    id: 3,
    image: "/images/wine.jpeg",
    likes: 312,
    comments: 31,
  },
  {
    id: 4,
    image: "/images/mocha.jpeg",
    likes: 267,
    comments: 22,
  },
  {
    id: 5,
    image: "/images/strawberry-milk.jpeg",
    likes: 445,
    comments: 56,
  },
  {
    id: 6,
    image: "/images/lip-balm.jpeg",
    likes: 178,
    comments: 15,
  },
]

export function InstagramFeed() {
  const instagramUrl = "https://www.instagram.com/luqitchyco.eg?igsh=a2V3eGJkdjAxeHUw&utm_source=qr"

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-pink-50/30 dark:via-pink-950/10 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">📸</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-10 animate-float" style={{ animationDelay: "1s" }}>✨</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-6 py-2 rounded-full mb-4">
            <Instagram className="w-5 h-5" />
            <span className="font-semibold">@luqitchycosmetics</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              Follow Us on Instagram
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our beauty community! Share your looks with #LuqitchyGlow ✨
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
            >
              <Image
                src={post.image}
                alt="Instagram post"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-6 text-white">
                  <div className="flex items-center gap-2">
                    <Heart className="w-6 h-6 fill-white" />
                    <span className="font-semibold">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 fill-white" />
                    <span className="font-semibold">{post.comments}</span>
                  </div>
                </div>
              </div>

              {/* Instagram Icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Instagram className="w-6 h-6 text-white" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Follow Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-105"
          >
            <Instagram className="w-5 h-5" />
            Follow @luqitchycosmetics
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
