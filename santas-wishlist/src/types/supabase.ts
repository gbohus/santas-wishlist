export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      wishes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string
          category: string
          status: 'pending' | 'approved' | 'delivered'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description: string
          category: string
          status?: 'pending' | 'approved' | 'delivered'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          status?: 'pending' | 'approved' | 'delivered'
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          username: string
          avatar: string | null
          nice_score: number
          achievements: Json[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          username: string
          avatar?: string | null
          nice_score?: number
          achievements?: Json[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          username?: string
          avatar?: string | null
          nice_score?: number
          achievements?: Json[]
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 