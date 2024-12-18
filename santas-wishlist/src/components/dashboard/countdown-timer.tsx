import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  variant?: 'default' | 'compact' | 'sidebar'
}

export function CountdownTimer({ variant = 'default' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const currentYear = now.getFullYear()
      const christmasDate = new Date(currentYear, 11, 25)
      
      if (now > christmasDate) {
        christmasDate.setFullYear(currentYear + 1)
      }

      const difference = christmasDate.getTime() - now.getTime()
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds }
  ]

  if (variant === 'sidebar') {
    return (
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-christmas-gold/20 p-3">
        <div className="text-center text-sm text-christmas-green font-medium mb-2">
          Time Until Christmas! 🎄
        </div>
        <div className="flex items-center justify-center space-x-2">
          {timeUnits.map(({ label, value }, index) => (
            <div key={label} className="text-center">
              <div className="bg-white/70 rounded-lg px-2 py-1">
                <span className={cn(
                  "text-lg font-bold tabular-nums",
                  value <= 5 ? "text-christmas-red animate-pulse" : "text-christmas-green"
                )}>
                  {value.toString().padStart(2, '0')}
                </span>
                <span className="text-xs text-christmas-green/60 ml-1">
                  {label.charAt(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden h-full">
        <div className="relative h-full">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-christmas-red/5 via-christmas-gold/5 to-christmas-green/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-christmas-red/10 rounded-full blur-3xl" />
          
          <CardContent className="relative h-full p-4">
            <div className="h-full flex flex-col justify-center">
              <h3 className="text-sm font-medium text-christmas-green mb-2">
                Christmas Countdown
              </h3>
              
              <div className="flex items-center space-x-3">
                {timeUnits.map(({ label, value }, index) => (
                  <div key={label} className="flex items-center">
                    <div className="text-center">
                      <span className={cn(
                        "text-xl font-bold tabular-nums",
                        value <= 5 
                          ? "text-christmas-red animate-pulse" 
                          : "text-christmas-green"
                      )}>
                        {value.toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs text-christmas-green/60 ml-1">
                        {label.charAt(0)}
                      </span>
                    </div>
                    {index < timeUnits.length - 1 && (
                      <span className="text-christmas-gold mx-1">:</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-christmas-red/5 via-christmas-gold/5 to-christmas-green/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-christmas-red/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-christmas-green/10 rounded-full blur-3xl" />
        
        <CardContent className="relative p-8">
          {/* Title with gradient text */}
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
            Christmas Countdown 🎄
          </h2>

          <div className="grid grid-cols-4 gap-4">
            {timeUnits.map(({ label, value }) => (
              <div key={label} className="relative group">
                {/* Card background with hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-christmas-red/10 to-christmas-green/10 rounded-xl transform group-hover:scale-105 transition-transform duration-300" />
                
                {/* Time display */}
                <div className="relative p-4 text-center">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-lg shadow-inner" />
                    <div className="relative py-4">
                      <span className={cn(
                        "text-4xl font-bold tabular-nums tracking-tight",
                        value <= 5 
                          ? "text-christmas-red animate-pulse" 
                          : "bg-gradient-to-br from-christmas-red to-christmas-green bg-clip-text text-transparent"
                      )}>
                        {value.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <div className="relative">
                    <span className="text-sm font-medium text-christmas-green/80 uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Festive message */}
          <p className="text-center mt-6 text-christmas-green/70 font-medium">
            {timeLeft.days === 0 ? "🎅 It's Christmas Day! 🎄" : "Get ready for the magic! ✨"}
          </p>
        </CardContent>
      </div>
    </Card>
  )
} 