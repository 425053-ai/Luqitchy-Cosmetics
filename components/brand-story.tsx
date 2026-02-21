            {/* Main Image Container removed as per request */}
                                stroke="url(#story-gradient)"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <defs>
                                <linearGradient id="story-gradient" x1="0" y1="0" x2="200" y2="0">
                                  <stop stopColor="#ec4899" />
                                  <stop offset="0.5" stopColor="#d946ef" />
                                  <stop offset="1" stopColor="#ec4899" />
                                </linearGradient>
                              </defs>
                            </motion.svg>
                          </span>
                        </h2>
                        {/* Story Paragraphs */}
                                />
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                          >
                            We craft each product with <span className="text-accent font-semibold">passion and precision</span>, using only the finest ingredients that nourish your skin while delivering stunning, long-lasting color.
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                                stroke="url(#story-gradient)"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                  <defs>
                    <linearGradient id="story-gradient" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#ec4899" />
                      <stop offset="0.5" stopColor="#d946ef" />
                      <stop offset="1" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
            </h2>

            {/* Story Paragraphs */}
                    />
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                We craft each product with <span className="text-accent font-semibold">passion and precision</span>, using only the finest ingredients that nourish your skin while delivering stunning, long-lasting color.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                    stroke="url(#story-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}

            {/* Founder Signature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-10 pt-8 border-t border-border/50"
            >
              {/* Founder info removed as per request */}
            </motion.div>
          </motion.div>

          {/* Right: Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
                <path
                    d="M0 4C50 4 50 7 100 7C150 7 150 1 200 1"
                    stroke="url(#story-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              />
              
              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/images/black-honey.jpeg"
                    alt="Luqitchy Black Honey"
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                <motion.div
                  className="relative h-64 md:h-80 rounded-2xl overflow-hidden mt-8 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/images/strawberry-milk.jpeg"
                    alt="Luqitchy Strawberry Milk"
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

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
