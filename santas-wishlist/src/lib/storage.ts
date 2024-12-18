import type { Wish, UserProfile, Achievement } from '@/types'

const STORAGE_KEYS = {
  WISHES: 'santa_wishes',
  USER_PROFILE: 'santa_user_profile',
  ACHIEVEMENTS: 'santa_achievements',
} as const

// Default achievements
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_wish',
    title: 'First Wish',
    description: 'Made your first wish to Santa!',
    icon: '🎁',
  },
  {
    id: 'wish_master',
    title: 'Wish Master',
    description: 'Made 5 wishes to Santa!',
    icon: '⭐',
  },
  {
    id: 'good_child',
    title: 'Very Good Child',
    description: 'Maintained a nice score above 80!',
    icon: '😇',
  },
  {
    id: 'holiday_spirit',
    title: 'Holiday Spirit',
    description: 'Logged in 5 days in a row!',
    icon: '🎄',
  },
]

// Default user profile
const DEFAULT_USER_PROFILE: UserProfile = {
  id: '1',
  username: '',
  niceScore: 75,
  achievements: [],
  preferences: {
    theme: 'light',
    notifications: true,
    language: 'en',
  },
  stats: {
    totalWishes: 0,
    approvedWishes: 0,
    deliveredWishes: 0,
    achievementsUnlocked: 0,
  },
}

class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue
    try {
      return JSON.parse(item)
    } catch {
      return defaultValue
    }
  }

  private setItem(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  // Wishes
  getWishes(): Wish[] {
    return this.getItem<Wish[]>(STORAGE_KEYS.WISHES, [])
  }

  setWishes(wishes: Wish[]): void {
    this.setItem(STORAGE_KEYS.WISHES, wishes)
  }

  // User Profile
  getUserProfile(): UserProfile {
    return this.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER_PROFILE)
  }

  setUserProfile(profile: UserProfile): void {
    this.setItem(STORAGE_KEYS.USER_PROFILE, profile)
  }

  updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile()
    const updated = { ...current, ...updates }
    this.setUserProfile(updated)
    return updated
  }

  // Achievements
  getAchievements(): Achievement[] {
    return this.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS)
  }

  unlockAchievement(id: string): Achievement[] {
    const achievements = this.getAchievements()
    const achievement = achievements.find(a => a.id === id)
    if (achievement && !achievement.unlockedAt) {
      achievement.unlockedAt = new Date().toISOString()
      this.setItem(STORAGE_KEYS.ACHIEVEMENTS, achievements)
      
      // Update user profile stats
      const profile = this.getUserProfile()
      profile.stats.achievementsUnlocked += 1
      this.setUserProfile(profile)
    }
    return achievements
  }

  // Initialize storage with default values
  initialize(username: string): void {
    if (!this.getUserProfile().username) {
      this.setUserProfile({ ...DEFAULT_USER_PROFILE, username })
      this.setItem(STORAGE_KEYS.ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS)
      this.setWishes([])
    }
  }

  // Clear all data
  clear(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  }
}

export const storage = new StorageService() 