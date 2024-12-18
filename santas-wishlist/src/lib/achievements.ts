import type { Achievement, UserProfile, Wish } from '@/types'
import { storage } from './storage'

export function checkAchievements(wishes: Wish[], profile: UserProfile): Achievement[] {
  const achievements = storage.getAchievements()
  const unlockedAchievements: string[] = []

  // Check First Wish
  if (wishes.length > 0 && !achievements.find(a => a.id === 'first_wish')?.unlockedAt) {
    unlockedAchievements.push('first_wish')
  }

  // Check Wish Master
  if (wishes.length >= 5 && !achievements.find(a => a.id === 'wish_master')?.unlockedAt) {
    unlockedAchievements.push('wish_master')
  }

  // Check Good Child
  if (profile.nice_score >= 80 && !achievements.find(a => a.id === 'good_child')?.unlockedAt) {
    unlockedAchievements.push('good_child')
  }

  // Check Holiday Spirit (simplified version - just check if they have recent activity)
  const hasRecentActivity = wishes.some(wish => {
    const wishDate = new Date(wish.updatedAt)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - wishDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff <= 5
  })

  if (hasRecentActivity && !achievements.find(a => a.id === 'holiday_spirit')?.unlockedAt) {
    unlockedAchievements.push('holiday_spirit')
  }

  // Unlock new achievements
  unlockedAchievements.forEach(id => {
    storage.unlockAchievement(id)
  })

  return storage.getAchievements()
}

export function getUnlockedAchievements(): Achievement[] {
  return storage.getAchievements().filter(a => a.unlockedAt)
}

export function getLockedAchievements(): Achievement[] {
  return storage.getAchievements().filter(a => !a.unlockedAt)
}

export function getAchievementProgress(wishes: Wish[], profile: UserProfile): Record<string, number> {
  const progress: Record<string, number> = {}

  // First Wish Progress
  progress['first_wish'] = wishes.length > 0 ? 100 : 0

  // Wish Master Progress
  progress['wish_master'] = Math.min((wishes.length / 5) * 100, 100)

  // Good Child Progress
  progress['good_child'] = Math.min((profile.nice_score / 80) * 100, 100)

  // Holiday Spirit Progress (simplified)
  const recentWishes = wishes.filter(wish => {
    const wishDate = new Date(wish.updatedAt)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - wishDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff <= 5
  }).length

  progress['holiday_spirit'] = Math.min((recentWishes / 5) * 100, 100)

  return progress
} 