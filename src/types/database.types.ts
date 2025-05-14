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
          user_id: string
          title: string
          description: string | null
          images: string[] | null
          tags: string[] | null
          upvotes: number
          rank_current_month: number | null
          rank_all_time: number | null
          rank_all_time_best: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          images?: string[] | null
          tags?: string[] | null
          upvotes?: number
          rank_current_month?: number | null
          rank_all_time?: number | null
          rank_all_time_best?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          images?: string[] | null
          tags?: string[] | null
          upvotes?: number
          rank_current_month?: number | null
          rank_all_time?: number | null
          rank_all_time_best?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_rank_history: {
        Row: {
          id: string
          portfolio_id: string
          rank_value: number
          rank_type: 'current_month' | 'all_time'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          rank_value: number
          rank_type: 'current_month' | 'all_time'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          rank_value?: number
          rank_type?: 'current_month' | 'all_time'
          created_at?: string
          updated_at?: string
        }
      }
      feedback_chips: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_rating: {
        Row: {
          id: string
          portfolio_id: string
          feedback_chip_id: string
          user_id: string
          is_positive: boolean
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          feedback_chip_id: string
          user_id: string
          is_positive: boolean
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          feedback_chip_id?: string
          user_id?: string
          is_positive?: boolean
          created_at?: string
        }
      }
      portfolio_rating_counts: {
        Row: {
          id: string
          portfolio_id: string
          feedback_chip_id: string
          count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          feedback_chip_id: string
          count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          feedback_chip_id?: string
          count?: number
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_comments: {
        Row: {
          id: string
          portfolio_id: string
          user_id: string
          content: string
          parent_id: string | null
          created_at: string
          updated_at: string
          portfolio_title: string | null
        }
        Insert: {
          id?: string
          portfolio_id: string
          user_id: string
          content: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
          portfolio_title?: string | null
        }
        Update: {
          id?: string
          portfolio_id?: string
          user_id?: string
          content?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
          portfolio_title?: string | null
        }
      }
      tools: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          icon_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          icon_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          icon_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_tools: {
        Row: {
          id: string
          portfolio_id: string
          tool_id: string
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          tool_id: string
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          tool_id?: string
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          price_range: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          price_range?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          price_range?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_services: {
        Row: {
          id: string
          portfolio_id: string
          service_id: string
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          service_id: string
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          service_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
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