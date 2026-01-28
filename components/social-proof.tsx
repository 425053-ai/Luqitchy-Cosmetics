"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { Instagram, Play, Heart, MessageCircle, Send, Bookmark } from "lucide-react"

// Mock UGC data - In production, this would come from Instagram API
const ugcPosts = [
  {
    id: 1,
    image: "/images/black-honey.jpeg",
    username: "beauty_lover_eg",
    likes: 234,
    caption: "Obsessed with my new Black Honey gloss! 💄✨",
    isVideo: false
  },
  {
    id: 2,
    image: "/images/strawberry-milk.jpeg",
    username: "makeup_queen",
    likes: 456,
    caption: "Strawberry Milk is giving EVERYTHING 🍓💕",
    isVideo: true
  },
  {
    id: 3,
    image: "/images/burgundy.jpeg",
    username: "glam_cairo",
    likes: 312,
    caption: "This Burgundy shade is perfect for date nights 💋",
    isVideo: false
  },
  {
    id: 4,
    image: "/images/wine.jpeg",
    username: "skincare_addict",
    likes: 189,
    caption: "Wine shade = instant elegance 🍷✨",
    isVideo: false
  },
  {
    id: 5,
    image: "/images/mocha.jpeg",
    username: "natural_beauty",
    likes: 278,
    caption: "Mocha for everyday glam! So smooth 😍",
    isVideo: true
  },
  {
    id: 6,
    image: "/images/lip-balm.jpeg",
    username: "lipcare_daily",
    likes: 445,
    caption: "My lips have never been softer! 💖",
    isVideo: false
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

export function SocialProof() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-secondary/20 via-background to-secondary/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Instagram Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-full mb-8 shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Instagram className="w-5 h-5" />
            <span className="font-semibold">@luqitchyglossy</span>
          </motion.div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Real People.{" "}
            <span className="bg-gradient-to-r from-accent via-pink-500 to-accent bg-clip-text text-transparent">
              Real Glow.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of beauty lovers sharing their Luqitchy moments. Tag us to be featured!
          </p>
        </motion.div>

        {/* UGC Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {ugcPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className={`relative group cursor-pointer ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl ${
                index === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-square"
              }`}>
                {/* Image */}
                <Image
                  src={post.image}
                  alt={`UGC post by ${post.username}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Video Indicator */}
                {post.isVideo && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-foreground fill-current ml-0.5" />
                  </div>
                )}

                {/* Hover Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === post.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Username */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      {post.username[0].toUpperCase()}
                    </div>
                    <span className="text-white font-medium text-sm">@{post.username}</span>
                  </div>

                  {/* Caption */}
                  <p className="text-white/90 text-sm mb-4 line-clamp-2">{post.caption}</p>

                  {/* Instagram Actions */}
                  <div className="flex items-center gap-4 text-white">
                    <button className="flex items-center gap-1.5 hover:scale-110 transition-transform">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button className="hover:scale-110 transition-transform">
                      <Send className="w-5 h-5" />
                    </button>
                    <button className="ml-auto hover:scale-110 transition-transform">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>

                {/* Permanent Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-0 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://www.instagram.com/luqitchyglossy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Instagram className="w-5 h-5" />
            <span>Follow Us on Instagram</span>
            <span className="ml-1">→</span>
          </motion.a>

          <p className="text-sm text-muted-foreground mt-4">
            Tag <span className="text-accent font-semibold">#LuqitchyGlow</span> to be featured
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "15K+", label: "Followers", icon: "👥" },
            { value: "500+", label: "Reviews", icon: "⭐" },
            { value: "50K+", label: "Posts Tagged", icon: "📸" },
            { value: "4.9", label: "Average Rating", icon: "💖" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
              whileHover={{ y: -5, borderColor: "rgba(236, 72, 153, 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-3xl mb-2 block">{stat.icon}</span>
              <div className="font-serif text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent to-pink-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
