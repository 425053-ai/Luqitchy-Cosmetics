"use client"

import { useState } from "react"
import { X, ChevronRight, ChevronLeft, Sparkles, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Question {
  id: number
  question: string
  emoji: string
  options: {
    text: string
    value: string
    emoji: string
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "What's your skin undertone?",
    emoji: "🎨",
    options: [
      { text: "Warm (yellow, golden, peachy)", value: "warm", emoji: "☀️" },
      { text: "Cool (pink, red, bluish)", value: "cool", emoji: "❄️" },
      { text: "Neutral (mix of both)", value: "neutral", emoji: "⚖️" },
      { text: "Not sure", value: "unsure", emoji: "🤔" },
    ],
  },
  {
    id: 2,
    question: "What look do you usually prefer?",
    emoji: "💄",
    options: [
      { text: "Natural, everyday look", value: "natural", emoji: "🌸" },
      { text: "Bold, statement lips", value: "bold", emoji: "💋" },
      { text: "Classic, elegant style", value: "classic", emoji: "✨" },
      { text: "Trendy, experimental", value: "trendy", emoji: "🎭" },
    ],
  },
  {
    id: 3,
    question: "What's your lip concern?",
    emoji: "👄",
    options: [
      { text: "Dry, chapped lips", value: "dry", emoji: "💧" },
      { text: "Uneven lip color", value: "uneven", emoji: "🎨" },
      { text: "Want more volume/plump", value: "plump", emoji: "💋" },
      { text: "No concerns, just want color", value: "color", emoji: "🌈" },
    ],
  },
  {
    id: 4,
    question: "How often do you reapply lip products?",
    emoji: "⏰",
    options: [
      { text: "Frequently (every 1-2 hours)", value: "frequent", emoji: "🔄" },
      { text: "Occasionally (3-4 hours)", value: "occasional", emoji: "⏱️" },
      { text: "Rarely (long-lasting preferred)", value: "rare", emoji: "💪" },
      { text: "Depends on the occasion", value: "varies", emoji: "🎯" },
    ],
  },
]

interface ProductRecommendation {
  id: string
  name: string
  image: string
  reason: string
  match: number
}

const getRecommendations = (answers: Record<number, string>): ProductRecommendation[] => {
  const recommendations: ProductRecommendation[] = []
  
  // Logic for lip gloss recommendations based on answers
  const undertone = answers[1]
  const style = answers[2]
  const concern = answers[3]
  
  // Warm undertones
  if (undertone === "warm") {
    recommendations.push({
      id: "mocha",
      name: "Mocha",
      image: "/images/mocha.jpeg",
      reason: "Perfect warm brown that complements your golden undertones",
      match: 95,
    })
    recommendations.push({
      id: "black-honey",
      name: "Black Honey",
      image: "/images/black-honey.jpeg",
      reason: "Universally flattering with warm berry tones",
      match: 90,
    })
  }
  
  // Cool undertones
  if (undertone === "cool") {
    recommendations.push({
      id: "burgundy",
      name: "Burgundy",
      image: "/images/burgundy.jpeg",
      reason: "Deep berry shade that enhances cool undertones beautifully",
      match: 95,
    })
    recommendations.push({
      id: "wine",
      name: "Wine",
      image: "/images/wine.jpeg",
      reason: "Rich, sophisticated shade for cool-toned beauties",
      match: 92,
    })
  }
  
  // Neutral undertones or unsure - all shades work!
  if (undertone === "neutral" || undertone === "unsure") {
    recommendations.push({
      id: "strawberry-milk",
      name: "Strawberry Milk",
      image: "/images/strawberry-milk.jpeg",
      reason: "Soft pink that flatters all undertones",
      match: 93,
    })
    recommendations.push({
      id: "black-honey",
      name: "Black Honey",
      image: "/images/black-honey.jpeg",
      reason: "The ultimate universal shade",
      match: 95,
    })
  }
  
  // Bold style preference
  if (style === "bold") {
    const boldShade = {
      id: "wine",
      name: "Wine",
      image: "/images/wine.jpeg",
      reason: "Make a statement with this bold, gorgeous shade",
      match: 94,
    }
    if (!recommendations.find(r => r.id === boldShade.id)) {
      recommendations.push(boldShade)
    }
  }
  
  // Natural style preference
  if (style === "natural") {
    const naturalShade = {
      id: "strawberry-milk",
      name: "Strawberry Milk",
      image: "/images/strawberry-milk.jpeg",
      reason: "Effortless, natural-looking pink",
      match: 96,
    }
    if (!recommendations.find(r => r.id === naturalShade.id)) {
      recommendations.push(naturalShade)
    }
  }
  
  // Dry lips concern - always recommend lip balm
  if (concern === "dry") {
    recommendations.unshift({
      id: "lip-balm",
      name: "Nourishing Lip Balm",
      image: "/images/lip-balm.jpeg",
      reason: "Essential for hydrating and healing dry lips",
      match: 100,
    })
  }
  
  // Return top 3 unique recommendations
  const uniqueRecs = recommendations.filter((rec, index, self) => 
    index === self.findIndex(r => r.id === rec.id)
  )
  
  return uniqueRecs.slice(0, 3)
}

export function SkinTypeQuiz() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value })
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  const closeQuiz = () => {
    setIsOpen(false)
    setTimeout(resetQuiz, 300)
  }

  const recommendations = showResults ? getRecommendations(answers) : []

  return (
    <>
      {/* Quiz Trigger Button - Responsive */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-accent via-pink-500 to-accent bg-[length:200%_100%] hover:bg-[position:100%_0] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-500 shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:scale-105 text-sm sm:text-base"
      >
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-sparkle" />
        <span className="hidden xs:inline">Find Your Perfect Shade</span>
        <span className="xs:hidden">Shade Finder</span>
        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Quiz Modal - Fully Responsive */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] bg-card rounded-2xl sm:rounded-3xl border border-border shadow-2xl overflow-hidden animate-scale-in flex flex-col">
            {/* Header - Responsive */}
            <div className="relative bg-gradient-to-r from-accent via-pink-500 to-accent text-white p-4 sm:p-6 text-center flex-shrink-0">
              <button
                onClick={closeQuiz}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close quiz"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">💄</div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold pr-8 sm:pr-0">
                {showResults ? "Your Perfect Match!" : "Shade Finder Quiz"}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5 sm:mt-1">
                {showResults 
                  ? "Based on your answers, we recommend:"
                  : `Question ${currentQuestion + 1} of ${questions.length}`
                }
              </p>
            </div>

            {/* Content - Scrollable on mobile */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {!showResults ? (
                <>
                  {/* Progress Bar */}
                  <div className="mb-4 sm:mb-6">
                    <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-500"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="text-center mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl mb-2 sm:mb-3 block">{questions[currentQuestion].emoji}</span>
                    <h3 className="text-lg sm:text-xl font-semibold px-2">{questions[currentQuestion].question}</h3>
                  </div>

                  {/* Options - Responsive Grid */}
                  <div className="space-y-2 sm:space-y-3">
                    {questions[currentQuestion].options.map((option, optIndex) => (
                      <button
                        key={`${questions[currentQuestion].id}-${optIndex}`}
                        onClick={() => handleAnswer(option.value)}
                        className={`w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all hover:border-accent hover:bg-accent/5 group ${
                          answers[questions[currentQuestion].id] === option.value 
                            ? "border-accent bg-accent/10" 
                            : "border-border"
                        }`}
                      >
                        <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform flex-shrink-0">{option.emoji}</span>
                        <span className="flex-1 text-left font-medium text-sm sm:text-base">{option.text}</span>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </button>
                    ))}
                  </div>

                  {/* Navigation */}
                  {currentQuestion > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="mt-3 sm:mt-4 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Previous question
                    </button>
                  )}
                </>
              ) : (
                <>
                  {/* Results - Responsive */}
                  <div className="space-y-3 sm:space-y-4">
                    {recommendations.map((product, index) => (
                      <Link
                        key={product.id}
                        href={`/order/${product.id}`}
                        onClick={closeQuiz}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border hover:border-accent hover:bg-accent/5 transition-all group"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          {index === 0 && (
                            <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-accent rounded-full flex items-center justify-center">
                              <span className="text-[10px] sm:text-xs">👑</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <h4 className="font-bold text-sm sm:text-base group-hover:text-accent transition-colors">{product.name}</h4>
                            <span className="text-[10px] sm:text-xs bg-green-500/10 text-green-600 px-1.5 sm:px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                              {product.match}% Match
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-0.5">{product.reason}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 hidden sm:block" />
                      </Link>
                    ))}
                  </div>

                  {/* Actions - Responsive */}
                  <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <Button
                      onClick={resetQuiz}
                      variant="outline"
                      className="flex-1 rounded-xl text-sm sm:text-base h-10 sm:h-11"
                    >
                      Retake Quiz
                    </Button>
                    <Button
                      onClick={closeQuiz}
                      className="flex-1 rounded-xl bg-accent hover:bg-accent/90 text-sm sm:text-base h-10 sm:h-11"
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Done
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
