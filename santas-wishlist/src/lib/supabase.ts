import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUpWithEmail = async (email: string, password: string, username: string) => {
  // First, sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) return { error: authError }

  // If signup successful, create their profile
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: authData.user.id,
          username,
          nice_score: 75,
          achievements: []
        }
      ])

    if (profileError) return { error: profileError }
  }

  return { data: authData, error: null }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Wishes helper functions
export const getWishes = async (userId: string) => {
  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const createWish = async (userId: string, wish: {
  title: string
  description: string
  category: string
}) => {
  const { data, error } = await supabase
    .from('wishes')
    .insert([
      {
        user_id: userId,
        title: wish.title,
        description: wish.description,
        category: wish.category,
        status: 'pending'
      }
    ])
    .select()
    .single()
  
  return { data, error }
}

export const updateWish = async (wishId: string, updates: {
  title?: string
  description?: string
  category?: string
  status?: string
}) => {
  const { data, error } = await supabase
    .from('wishes')
    .update(updates)
    .eq('id', wishId)
    .select()
    .single()
  
  return { data, error }
}

export const deleteWish = async (wishId: string) => {
  const { error } = await supabase
    .from('wishes')
    .delete()
    .eq('id', wishId)
  
  return { error }
}

// Profile helper functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: {
  username?: string
  avatar?: string
  nice_score?: number
  achievements?: any[]
}) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  
  return { data, error }
} 