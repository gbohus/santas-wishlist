import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WishForm } from "@/components/features/wish-form"
import { WishList } from "@/components/features/wish-list"
import { WishFilters } from "@/components/features/wish-filters"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { calculateWishStatistics } from "@/lib/statistics"
import { checkAchievements } from "@/lib/achievements"
import { triggerConfetti } from "@/lib/confetti"
import { supabase, createWish, getWishes, updateWish, deleteWish, getUserProfile } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Timeline } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Wish, WishCategory, WishStatus } from "@/types"

export default function DashboardPage() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<WishCategory | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<WishStatus | 'all'>('all')
  const [user, setUser] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'card' | 'timeline'>('card')

  // ... rest of your existing state and functions ...

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6 sm:space-y-8">
        {/* Main Heading */}
        <div className="text-center relative">
          <div className="absolute -top-4 -left-4 sm:-left-8 text-xl sm:text-2xl animate-bounce-slow hidden sm:block">❄️</div>
          <div className="absolute -top-6 -right-4 sm:-right-8 text-2xl sm:text-3xl animate-bounce-slower hidden sm:block">❄️</div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-500 via-green-500 to-red-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Santa's Dashboard
          </h1>
          <div className="h-1 w-24 sm:w-32 mx-auto mt-2 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-red-500 animate-gradient bg-[length:200%_auto]" />
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} profile={user} />

        {/* Make a Wish Section */}
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-32 sm:w-40 h-32 sm:h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
          
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 ring-1 ring-black/5 group">
            <div className="absolute -top-2 -left-2 text-xl sm:text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 rotate-12">🎄</div>
            <div className="absolute -bottom-2 -right-2 text-xl sm:text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 -rotate-12">🎅</div>
            
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-rose-500 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2">
                Write Your Wish to Santa! 
                <span className="animate-bounce">🎁</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                Tell Santa what you'd like for Christmas!
              </p>
            </div>
            
            <WishForm onSubmit={handleWishSubmit} />
          </div>
        </div>

        {/* My Wishes Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Section Title and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent flex items-center gap-2">
                My Christmas Wishes
                <span className="text-xl sm:text-2xl">📝</span>
              </h2>
              <div className="flex items-center gap-2 border rounded-lg p-1 bg-white/50">
                <Button
                  variant={viewMode === 'card' ? 'christmas' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="gap-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
                <Button
                  variant={viewMode === 'timeline' ? 'christmas' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                  className="gap-2"
                >
                  <Timeline className="h-4 w-4" />
                  <span className="hidden sm:inline">Timeline</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
              <WishFilters
                selectedCategory={selectedCategory}
                selectedStatus={selectedStatus}
                onCategoryChange={setSelectedCategory}
                onStatusChange={setSelectedStatus}
                variant="compact"
              />
            </div>
          </div>

          {/* Wish List */}
          <div className={cn(
            "grid gap-4",
            viewMode === 'timeline' && "max-w-3xl mx-auto"
          )}>
            <WishList
              wishes={filteredWishes}
              onUpdate={handleWishUpdate}
              onDelete={handleWishDelete}
              isLoading={isLoading}
              variant={viewMode}
            />
          </div>
        </div>

        {/* Inspirational Footer */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-emerald-50 to-blue-50 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative px-4 sm:px-6 py-4 text-center">
            <p className="text-sm sm:text-base text-gray-600 font-medium group-hover:scale-105 transition-transform duration-300">
              "Believe in the magic of Christmas, for those who believe receive the most wonderful gifts! 
              <span className="inline-block animate-bounce-slow ml-2">🌟</span>"
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 