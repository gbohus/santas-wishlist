import { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import type { UserProfile } from "@/types"

interface DashboardLayoutProps {
  children: ReactNode
  user: UserProfile
  onLogout: () => void
}

export function DashboardLayout({ children, user, onLogout }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-green-50 via-green-50/80 to-emerald-50">
      {/* Animated snowflakes background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/snowflakes.svg')] opacity-5 animate-snow bg-repeat"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-80 fixed inset-y-0 left-0">
        <div className="h-full overflow-y-auto bg-white/90 backdrop-blur-md border-r border-gray-100 shadow-lg">
          <Sidebar user={user} onLogout={onLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80">
        <div className="container mx-auto p-8">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald-600/5 rounded-full blur-3xl" />
            
            {/* Content with glass effect */}
            <div className="relative rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-md shadow-lg ring-1 ring-black/5">
              <div className="p-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 