export type WishCategory = 'toys' | 'books' | 'electronics' | 'clothes' | 'other'

export type WishStatus = 'pending' | 'approved' | 'delivered'

export interface Wish {
  id: string
  title: string
  description: string
  category: WishCategory
  status: WishStatus
  createdAt: string
  updatedAt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

export interface UserProfile {
  id: string
  user_id: string
  username: string
  avatar?: string | null
  nice_score: number
  achievements: Achievement[]
  created_at: string
  updated_at: string
}

export interface WishStatistics {
  totalWishes: number
  byCategory: Record<WishCategory, number>
  byStatus: Record<WishStatus, number>
  recentActivity: {
    date: string
    action: 'created' | 'updated' | 'delivered'
    wishId: string
  }[]
} 