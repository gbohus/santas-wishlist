// Types
export interface Wish {
  id: string
  title: string
  description: string
  status: 'pending' | 'approved' | 'delivered'
  createdAt: string
}

export interface User {
  id: string
  username: string
  avatar?: string
}

// Mock data
let wishes: Wish[] = [
  {
    id: '1',
    title: 'New Bicycle',
    description: 'A shiny red bicycle with a bell and a basket!',
    status: 'approved',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Art Set',
    description: 'A complete art set with paints, brushes, and a canvas.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
]

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API functions
export const api = {
  // Auth
  login: async (username: string, password: string): Promise<User> => {
    await delay(500) // Simulate API call
    if (username && password) {
      return { id: '1', username }
    }
    throw new Error('Invalid credentials')
  },

  // Wishes
  getWishes: async (): Promise<Wish[]> => {
    await delay(500)
    return [...wishes]
  },

  addWish: async (wish: Omit<Wish, 'id' | 'status' | 'createdAt'>): Promise<Wish> => {
    await delay(500)
    const newWish: Wish = {
      id: (wishes.length + 1).toString(),
      ...wish,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    wishes = [newWish, ...wishes]
    return newWish
  },

  updateWish: async (id: string, updates: Partial<Wish>): Promise<Wish> => {
    await delay(500)
    const index = wishes.findIndex(w => w.id === id)
    if (index === -1) throw new Error('Wish not found')
    
    const updatedWish = { ...wishes[index], ...updates }
    wishes = wishes.map(w => w.id === id ? updatedWish : w)
    return updatedWish
  },

  deleteWish: async (id: string): Promise<void> => {
    await delay(500)
    wishes = wishes.filter(w => w.id !== id)
  },
} 