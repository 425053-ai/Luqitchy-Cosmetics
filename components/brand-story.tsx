"use client"
              {/* Removed image grid and floating emojis section as requested */}
          {/* Left: Story Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-8"
            >
              <span className="text-accent text-sm font-medium tracking-widest uppercase">Our Story</span>
              <span className="animate-pulse">💖</span>
            </motion.div>

            {/* Heading */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
              Beauty That{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-accent via-pink-500 to-accent bg-clip-text text-transparent">
                  Empowers
                </span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.path
                    d="M0 4C50 4 50 7 100 7C150 7 150 1 200 1"
                    stroke="url(#story-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="story-gradient" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#ec4899" />
                      <stop offset="0.5" stopColor="#d946ef" />
                      <stop offset="1" stopColor="#ec4899" />
                    </linearGradient>
                  {/* Right: Visual Elements removed as requested */}

                <motion.div
                  className="relative h-64 md:h-80 rounded-2xl overflow-hidden -mt-8 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/images/burgundy.jpeg"
                    alt="Luqitchy Burgundy"
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                <motion.div
                  className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/images/mocha.jpeg"
                    alt="Luqitchy Mocha"
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              </div>
            </div>

            {/* Floating Emojis */}
            <motion.span
              className="absolute -top-4 -left-4 text-4xl"
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ✨
            </motion.span>
            <motion.span
              className="absolute -bottom-4 -right-4 text-4xl"
              animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              💖
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
