import { Gift, Star, Clock, Award, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { WishStatistics, UserProfile } from "@/types"

interface StatsCardsProps {
  stats: WishStatistics
  profile: UserProfile
}

export function StatsCards({ stats, profile }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Wishes",
      value: stats.totalWishes,
      description: "Wishes made this year",
      icon: Gift,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      decoration: "🎁",
      gradient: "from-rose-500/10 to-rose-600/5",
    },
    {
      title: "Nice Score",
      value: profile.niceScore,
      description: "Your current nice score",
      icon: Star,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      decoration: "⭐",
      gradient: "from-amber-500/10 to-amber-600/5",
    },
    {
      title: "Approved",
      value: stats.byStatus.approved || 0,
      description: "Wishes approved by Santa",
      icon: Clock,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      decoration: "🎄",
      gradient: "from-emerald-500/10 to-emerald-600/5",
    },
    {
      title: "Achievements",
      value: profile.stats.achievementsUnlocked,
      description: "Unlocked achievements",
      icon: Award,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      decoration: "🏆",
      gradient: "from-blue-500/10 to-blue-600/5",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card 
          key={card.title} 
          className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          {/* Magical sparkle effect */}
          <div className="absolute -inset-2 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
               style={{ 
                 background: `radial-gradient(circle at top left, ${card.bgColor}, transparent 70%)`,
                 zIndex: -1 
               }} 
          />

          {/* Background decoration */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
            card.gradient,
            "opacity-50 group-hover:opacity-100"
          )} />
          
          {/* Festive decoration */}
          <div className="absolute top-2 right-2 text-xl opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce">
            {card.decoration}
          </div>
          
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground group-hover:text-black transition-colors duration-300">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className={cn(
                  "text-3xl font-bold transition-all duration-300",
                  card.color,
                  "group-hover:scale-110 origin-left"
                )}>
                  {card.value}
                </p>
                <p className="text-sm text-muted-foreground group-hover:text-black transition-colors duration-300">
                  {card.description}
                </p>
              </div>
              <div className={cn(
                "rounded-full p-3 transition-all duration-300",
                card.bgColor,
                "group-hover:scale-110 group-hover:rotate-12",
                "ring-1 ring-black/5 shadow-lg"
              )}>
                <card.icon className={cn("h-6 w-6", card.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 