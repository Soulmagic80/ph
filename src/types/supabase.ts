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
      portfolios: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          user_id: string
          is_public: boolean
          rank_all_time: number | null
          rank_best: number | null
          tools: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          user_id: string
          is_public?: boolean
          rank_all_time?: number | null
          rank_best?: number | null
          tools?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          user_id?: string
          is_public?: boolean
          rank_all_time?: number | null
          rank_best?: number | null
          tools?: string[] | null
        }
      }
      portfolio_rank_history: {
        Row: {
          id: string
          portfolio_id: string
          rank: number
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          rank: number
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          rank?: number
          created_at?: string
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