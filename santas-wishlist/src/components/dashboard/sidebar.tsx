import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CountdownTimer } from "@/components/dashboard/countdown-timer"
import {
  Home,
  Gift,
  Award,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react"
import type { UserProfile } from "@/types"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: UserProfile
  onLogout: () => void
}

export function Sidebar({ className, user, onLogout }: SidebarProps) {
  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      {/* User Profile Section */}
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-christmas-red flex items-center justify-center text-4xl">
                {user.avatar || '🎅'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-christmas-green text-white text-xs px-2 py-1 rounded-full">
                Score: {user.nice_score}
              </div>
            </div>
          </div>
          <h2 className="mb-2 text-center text-lg font-semibold tracking-tight text-christmas-red">
            Welcome, {user.username}!
          </h2>
          
          {/* Countdown Timer */}
          <div className="mt-4 px-2">
            <CountdownTimer variant="sidebar" />
          </div>
        </div>
        <Separator className="bg-christmas-gold/50" />
      </div>

      {/* Navigation */}
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-christmas-red">
              Workshop
            </h2>
            <Button variant="ghost" className="w-full justify-start text-christmas-green hover:text-christmas-red">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-christmas-green hover:text-christmas-red">
              <Gift className="mr-2 h-4 w-4" />
              My Wishes
            </Button>
            <Button variant="ghost" className="w-full justify-start text-christmas-green hover:text-christmas-red">
              <Award className="mr-2 h-4 w-4" />
              Achievements
            </Button>
            <Button variant="ghost" className="w-full justify-start text-christmas-green hover:text-christmas-red">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
          </div>
        </div>
        <Separator className="bg-christmas-gold/50" />
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-christmas-red">
              Settings
            </h2>
            <Button variant="ghost" className="w-full justify-start text-christmas-green hover:text-christmas-red">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-christmas-green hover:text-christmas-red"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Achievement Progress */}
      <div className="px-3 py-2">
        <div className="space-y-1">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-christmas-red">
            Achievements
          </h2>
          <ScrollArea className="h-[100px] px-4">
            <div className="space-y-2">
              {user.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-2 text-sm text-christmas-green"
                >
                  <span>{achievement.icon}</span>
                  <span>{achievement.title}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
} 