import { CreditCard, ShieldCheck, Sparkles, Heart, Truck, Package, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const policies = [
  {
    icon: CreditCard,
    title: "Deposit Required",
    description:
      "A deposit is required to confirm your order. This ensures we can manage inventory and provide timely delivery of your products.",
    highlight: "Secure your order",
    emoji: "💳",
    gradient: "from-blue-500 to-cyan-500",
    animation: "animate-wiggle",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Orders are delivered within 24-48 hours across Egypt. We ensure your products arrive safely and on time.",
    highlight: "24-48h delivery",
    emoji: "🚚",
    gradient: "from-green-500 to-emerald-500",

                    <policy.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white group-hover:animate-pulse" />
                    <span className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-sm sm:text-base md:text-lg ${policy.animation}`}>{policy.emoji}</span>
                  </div>
                  <CardTitle className="font-serif text-base sm:text-lg text-foreground group-hover:text-accent transition-colors">
                    {policy.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-3 sm:px-4 md:px-6 px-3 sm:px-4 md:px-6">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 md:mb-5 leading-relaxed line-clamp-4">{policy.description}</p>
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-accent/10 text-accent font-semibold px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs border border-accent/20 shadow-sm group-hover:bg-accent/20 transition-colors">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {policy.highlight}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info Banner */}
        <div className="mt-10 sm:mt-12 md:mt-16 max-w-4xl mx-auto animate-slide-up opacity-0 px-2" style={{ animationDelay: "0.7s" }}>
          <div className="premium-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 md:gap-6">
              {/* Need Help, Delivery, Premium Quality removed as per request */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
