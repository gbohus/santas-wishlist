import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WishList } from "@/components/features/wish-list"
import { WishForm } from "@/components/features/wish-form"
import { StatsCards } from "@/components/features/stats-cards"
import { CountdownTimer } from "@/components/features/countdown-timer"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import type { Wish } from "@/types"

type ViewMode = 'default' | 'card' | 'timeline'

export default function Dashboard() {
  const navigate = useNavigate()
  const [wishes, setWishes] = useState<Wish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          navigate('/login')
          return
        }
        setUser(user)

        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setProfile(profile)

        // Fetch wishes
        const { data: wishes, error } = await supabase
          .from('wishes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setWishes(wishes || [])
      } catch (error) {
        console.error('Error:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [navigate])

  const handleCreateWish = async (wishData: Partial<Wish>) => {
    try {
      const { data: wish, error } = await supabase
        .from('wishes')
        .insert([
          {
            ...wishData,
            user_id: user?.id,
            status: 'pending'
          }
        ])
        .select()
        .single()

      if (error) throw error

      setWishes(prev => [wish, ...prev])
      toast.success('Your wish has been sent to Santa! 🎅')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to create wish')
    }
  }

  const handleUpdateWish = async (wishId: string, updates: Partial<Wish>) => {
    try {
      const { data: updatedWish, error } = await supabase
        .from('wishes')
        .update(updates)
        .eq('id', wishId)
        .select()
        .single()

      if (error) throw error

      setWishes(prev =>
        prev.map(wish => (wish.id === wishId ? updatedWish : wish))
      )
      toast.success('Wish updated successfully! ✨')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to update wish')
    }
  }

  const handleDeleteWish = async (wishId: string) => {
    try {
      const { error } = await supabase
        .from('wishes')
        .delete()
        .eq('id', wishId)

      if (error) throw error

      setWishes(prev => prev.filter(wish => wish.id !== wishId))
      toast.success('Wish removed successfully')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to delete wish')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-christmas-bg p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold text-christmas-red">
            Santa's Dashboard
          </h1>
          <Button
            variant="ghost"
            onClick={async () => {
              await supabase.auth.signOut()
              navigate('/login')
            }}
          >
            Sign Out
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <StatsCards
              wishes={wishes}
              profile={profile}
            />

            {/* Wish Form */}
            <WishForm onSubmit={handleCreateWish} />

            {/* View Toggle and Wish List */}
            <div className="space-y-4">
              <Tabs
                value={viewMode}
                onValueChange={(value) => setViewMode(value as ViewMode)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card">Card View</TabsTrigger>
                  <TabsTrigger value="default">List View</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
              </Tabs>

              <WishList
                wishes={wishes}
                onDelete={handleDeleteWish}
                onUpdate={handleUpdateWish}
                variant={viewMode}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CountdownTimer />
          </div>
        </div>
      </div>
    </div>
  )
} 