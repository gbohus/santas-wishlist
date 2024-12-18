import type { Wish, WishStatistics, WishCategory, WishStatus } from '@/types'

export function calculateWishStatistics(wishes: Wish[]): WishStatistics {
  const byCategory = wishes.reduce((acc, wish) => {
    acc[wish.category] = (acc[wish.category] || 0) + 1
    return acc
  }, {} as Record<WishCategory, number>)

  const byStatus = wishes.reduce((acc, wish) => {
    acc[wish.status] = (acc[wish.status] || 0) + 1
    return acc
  }, {} as Record<WishStatus, number>)

  // Get recent activity (last 10 actions)
  const recentActivity = wishes
    .map(wish => [
      { date: wish.createdAt, action: 'created' as const, wishId: wish.id },
      { date: wish.updatedAt, action: 'updated' as const, wishId: wish.id },
      ...(wish.status === 'delivered' ? [{ 
        date: wish.updatedAt, 
        action: 'delivered' as const, 
        wishId: wish.id 
      }] : []),
    ])
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return {
    totalWishes: wishes.length,
    byCategory,
    byStatus,
    recentActivity,
  }
}

export function calculateNiceScore(profile: { stats: { approvedWishes: number; totalWishes: number } }): number {
  const { approvedWishes, totalWishes } = profile.stats
  if (totalWishes === 0) return 75 // Default score
  
  // Base score from approved wishes ratio
  const baseScore = (approvedWishes / totalWishes) * 100
  
  // Add some randomness to make it more fun (-5 to +5)
  const randomFactor = Math.floor(Math.random() * 11) - 5
  
  // Ensure score stays between 0 and 100
  return Math.min(Math.max(Math.round(baseScore + randomFactor), 0), 100)
} 