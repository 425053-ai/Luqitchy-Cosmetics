"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send } from "lucide-react"

export function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  
  const whatsappNumber = "201105003495" // Luqitchy Cosmetics
  
  const sendMessage = () => {
    const text = message || "Hi! I'm interested in Luqitchy Cosmetics products 💄"
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank")
    setIsOpen(false)
  }

  const quickMessages = [
    "Hi! I want to order 💄",
    "What products do you have?",
    "Do you deliver to my area?",
    "What's the price list?",
  ]

  return (
    <>
      {/* Floating WhatsApp Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 bottom-4 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(37, 211, 102, 0.4)",
            "0 0 0 20px rgba(37, 211, 102, 0)",
          ]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Online indicator */}
      {!isOpen && (
        <div className="fixed right-4 bottom-16 z-50 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-lg text-xs flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-600 dark:text-gray-300">Online</span>
        </div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed right-4 bottom-20 z-50 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                💄
              </div>
              <div className="text-white">
                <h3 className="font-bold">Luqitchy Cosmetics</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  Usually replies instantly
                </p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-[#ECE5DD] dark:bg-gray-800 min-h-[200px]">
              {/* Bot Message */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 max-w-[80%] shadow-sm mb-3">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  Hi there! 👋💕
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                  Welcome to Luqitchy Cosmetics! How can I help you today?
                </p>
                <span className="text-[10px] text-gray-500 mt-1 block">Just now</span>
              </div>

              {/* Quick Replies */}
              <div className="space-y-2">
                {quickMessages.map((msg, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(msg)}
                    className="block w-full text-left bg-white dark:bg-gray-700 rounded-lg p-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors border border-pink-200 dark:border-pink-800"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-gray-900 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#25D366]"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#20BD5A] transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
