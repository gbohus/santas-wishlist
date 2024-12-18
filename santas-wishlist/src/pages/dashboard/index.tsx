import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WishForm } from "@/components/features/wish-form"
import { WishList } from "@/components/features/wish-list"
import { WishFilters } from "@/components/features/wish-filters"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { storage } from "@/lib/storage"
import { calculateWishStatistics } from "@/lib/statistics"
import { checkAchievements } from "@/lib/achievements"
import { triggerConfetti } from "@/lib/confetti"
import type { Wish, WishCategory, WishStatus } from "@/types"

export default function DashboardPage() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<WishCategory | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<WishStatus | 'all'>('all')
  const [user, setUser] = useState(storage.getUserProfile())

  useEffect(() => {
    loadWishes()
  }, [])

  const loadWishes = async () => {
    try {
      const data = storage.getWishes()
      setWishes(data)
      
      // Check achievements
      const achievements = checkAchievements(data, user)
      if (achievements.length > user.achievements.length) {
        setUser(storage.getUserProfile()) // Refresh user data
      }
    } catch (error) {
      console.error('Failed to load wishes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishSubmit = async (newWish: { title: string; description: string; category: WishCategory }) => {
    try {
      const wish: Wish = {
        id: (wishes.length + 1).toString(),
        ...newWish,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      const updatedWishes = [wish, ...wishes]
      storage.setWishes(updatedWishes)
      setWishes(updatedWishes)
      
      // Check achievements and trigger confetti
      checkAchievements(updatedWishes, user)
      triggerConfetti()
      
      // Refresh user data
      setUser(storage.getUserProfile())
    } catch (error) {
      console.error('Failed to add wish:', error)
    }
  }

  const handleWishUpdate = async (id: string, updates: Partial<Wish>) => {
    try {
      const updatedWishes = wishes.map(w => 
        w.id === id 
          ? { ...w, ...updates, updatedAt: new Date().toISOString() }
          : w
      )
      storage.setWishes(updatedWishes)
      setWishes(updatedWishes)
      
      // Check achievements
      checkAchievements(updatedWishes, user)
      setUser(storage.getUserProfile())
    } catch (error) {
      console.error('Failed to update wish:', error)
    }
  }

  const handleWishDelete = async (id: string) => {
    try {
      const updatedWishes = wishes.filter(w => w.id !== id)
      storage.setWishes(updatedWishes)
      setWishes(updatedWishes)
    } catch (error) {
      console.error('Failed to delete wish:', error)
    }
  }

  const handleLogout = () => {
    storage.clear()
    window.location.reload()
  }

  // Filter wishes
  const filteredWishes = wishes.filter(wish => {
    const matchesCategory = selectedCategory === 'all' || wish.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || wish.status === selectedStatus
    return matchesCategory && matchesStatus
  })

  // Calculate statistics
  const stats = calculateWishStatistics(wishes)

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-8">
        {/* Main Heading */}
        <div className="text-center relative">
          {/* Decorative snowflakes */}
          <div className="absolute -top-4 -left-8 text-2xl animate-bounce-slow">❄️</div>
          <div className="absolute -top-6 -right-8 text-3xl animate-bounce-slower">❄️</div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Santa's Dashboard
          </h1>
          <div className="h-1 w-32 mx-auto mt-2 rounded-full bg-gradient-to-r from-rose-500 via-emerald-500 to-blue-500" />
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} profile={user} />

        {/* Make a Wish Section */}
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
          
          {/* Content */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-all duration-300 ring-1 ring-black/5 group">
            {/* Festive corner decorations */}
            <div className="absolute -top-2 -left-2 text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 rotate-12">🎄</div>
            <div className="absolute -bottom-2 -right-2 text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 -rotate-12">🎅</div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-rose-500 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2">
                Write Your Wish to Santa! 
                <span className="animate-bounce">🎁</span>
              </h2>
              <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                Tell Santa what you'd like for Christmas!
              </p>
            </div>
            
            <WishForm onSubmit={handleWishSubmit} />
          </div>
        </div>

        {/* My Wishes Section */}
        <div className="space-y-6">
          {/* Section Title and Filters */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent flex items-center gap-2">
              My Christmas Wishes
              <span className="text-2xl">📝</span>
            </h2>
            <div className="flex items-center gap-4">
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
          <div className="grid gap-4">
            <WishList
              wishes={filteredWishes}
              onUpdate={handleWishUpdate}
              onDelete={handleWishDelete}
              isLoading={isLoading}
              variant="card"
            />
          </div>
        </div>

        {/* Inspirational Footer */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-emerald-50 to-blue-50 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative px-6 py-4 text-center">
            <p className="text-gray-600 font-medium group-hover:scale-105 transition-transform duration-300">
              "Believe in the magic of Christmas, for those who believe receive the most wonderful gifts! 
              <span className="inline-block animate-bounce-slow ml-2">🌟</span>"
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 