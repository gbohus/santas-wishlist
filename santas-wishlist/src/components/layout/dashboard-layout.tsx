import { ReactNode, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { UserProfile } from "@/types"

interface DashboardLayoutProps {
  children: ReactNode
  user: UserProfile
  onLogout: () => void
}

export function DashboardLayout({ children, user, onLogout }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-50/80 to-emerald-50">
      {/* Animated snowflakes background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/snowflakes.svg')] opacity-5 animate-snow bg-repeat"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          <div className="font-semibold text-lg bg-gradient-to-r from-rose-500 to-emerald-500 bg-clip-text text-transparent">
            Santa's Workshop
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-20 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full overflow-y-auto bg-white/90 backdrop-blur-md border-r border-gray-100 shadow-lg">
          <div className="pt-safe">
            <Sidebar user={user} onLogout={onLogout} />
          </div>
        </div>
      </aside>

      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 ease-in-out",
        "lg:ml-80"
      )}>
        <div className="container mx-auto p-4 lg:p-8 pt-[calc(1rem+4rem)] lg:pt-8">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald-600/5 rounded-full blur-3xl" />
            
            {/* Content with glass effect */}
            <div className="relative rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-md shadow-lg ring-1 ring-black/5">
              <div className="p-4 lg:p-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 