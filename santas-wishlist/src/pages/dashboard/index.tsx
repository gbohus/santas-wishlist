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
import type { Wish, WishCategory, WishStatus } from "@/types"

export default function DashboardPage() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<WishCategory | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<WishStatus | 'all'>('all')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const session = await supabase.auth.getSession()
      console.log('Session:', session)
      
      if (!session.data.session?.user) {
        console.log('No session found')
        return
      }

      // Load user profile
      const { data: profile, error: profileError } = await getUserProfile(session.data.session.user.id)
      console.log('Profile:', profile, 'Error:', profileError)
      
      if (profileError) {
        console.error('Profile error:', profileError)
        return
      }

      if (profile) {
        setUser(profile)
      } else {
        // If no profile exists, create one
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([
            {
              user_id: session.data.session.user.id,
              username: session.data.session.user.email?.split('@')[0] || 'Elf',
              nice_score: 75,
              achievements: [],
              avatar: null
            }
          ])
          .select()
          .single()

        console.log('New Profile:', newProfile, 'Create Error:', createError)
        
        if (createError) {
          console.error('Failed to create profile:', createError)
          return
        }
        
        if (newProfile) {
          setUser(newProfile)
        }
      }

      // Load wishes
      const { data: wishesData, error: wishesError } = await getWishes(session.data.session.user.id)
      console.log('Wishes:', wishesData, 'Error:', wishesError)
      
      if (wishesError) {
        console.error('Wishes error:', wishesError)
        return
      }

      if (wishesData) {
        setWishes(wishesData)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishSubmit = async (newWish: { title: string; description: string; category: WishCategory }) => {
    try {
      const session = await supabase.auth.getSession()
      if (!session.data.session?.user) return

      const { data: wish, error } = await createWish(session.data.session.user.id, newWish)
      if (error) throw error

      if (wish) {
        setWishes(prev => [wish, ...prev])
        triggerConfetti()
        
        // Check achievements
        if (user) {
          checkAchievements(wishes, user)
        }
      }
    } catch (error) {
      console.error('Failed to add wish:', error)
    }
  }

  const handleWishUpdate = async (id: string, updates: Partial<Wish>) => {
    try {
      const { data: updatedWish, error } = await updateWish(id, updates)
      if (error) throw error

      if (updatedWish) {
        setWishes(prev => prev.map(w => w.id === id ? updatedWish : w))
      }
    } catch (error) {
      console.error('Failed to update wish:', error)
    }
  }

  const handleWishDelete = async (id: string) => {
    try {
      const { error } = await deleteWish(id)
      if (error) throw error

      setWishes(prev => prev.filter(w => w.id !== id))
    } catch (error) {
      console.error('Failed to delete wish:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // Filter wishes
  const filteredWishes = wishes.filter(wish => {
    const matchesCategory = selectedCategory === 'all' || wish.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || wish.status === selectedStatus
    return matchesCategory && matchesStatus
  })

  // Calculate statistics
  const stats = calculateWishStatistics(wishes)

  // Add loading state UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-bounce">🎅</div>
          <p className="text-christmas-green">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  // Add error state if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">😢</div>
          <p className="text-christmas-red">Oops! Something went wrong loading your profile.</p>
          <button 
            onClick={loadUserData} 
            className="text-christmas-green hover:text-christmas-red"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-6 sm:space-y-8">
        {/* Main Heading */}
        <div className="text-center relative">
          {/* Decorative snowflakes */}
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
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-32 sm:w-40 h-32 sm:h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
          
          {/* Content */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 ring-1 ring-black/5 group">
            {/* Festive corner decorations */}
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
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent flex items-center gap-2">
              My Christmas Wishes
              <span className="text-xl sm:text-2xl">📝</span>
            </h2>
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