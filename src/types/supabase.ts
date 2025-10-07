export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string | null
          id: string
          publish_strategy: string | null
          updated_at: string | null
          weekly_publish_limit: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          publish_strategy?: string | null
          updated_at?: string | null
          weekly_publish_limit?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          publish_strategy?: string | null
          updated_at?: string | null
          weekly_publish_limit?: number | null
        }
        Relationships: []
      }
      comment_votes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          vote_type: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          vote_type: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments_with_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          downvotes: number
          id: string
          parent_id: string | null
          portfolio_id: string
          updated_at: string | null
          upvotes: number
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          downvotes?: number
          id?: string
          parent_id?: string | null
          portfolio_id: string
          updated_at?: string | null
          upvotes?: number
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          downvotes?: number
          id?: string
          parent_id?: string | null
          portfolio_id?: string
          updated_at?: string | null
          upvotes?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments_with_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_chips: {
        Row: {
          category: string
          created_at: string
          icon_name: string
          id: string
          name: string
          short_description: string
          type: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          icon_name: string
          id?: string
          name: string
          short_description: string
          type: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          icon_name?: string
          id?: string
          name?: string
          short_description?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback_status: {
        Row: {
          created_at: string
          id: string
          portfolio_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          portfolio_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          portfolio_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_status_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_status_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_services: {
        Row: {
          created_at: string
          id: string
          portfolio_id: string
          service_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          portfolio_id: string
          service_id: string
        }
        Update: {
          created_at?: string
          id?: string
          portfolio_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_services_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_services_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_tools: {
        Row: {
          created_at: string
          id: string
          portfolio_id: string
          tool_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          portfolio_id: string
          tool_id: string
        }
        Update: {
          created_at?: string
          id?: string
          portfolio_id?: string
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_tools_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_tools_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_tools_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          approved: boolean | null
          created_at: string
          declined_reason: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          images: string[] | null
          is_visible: boolean | null
          manual_publish: boolean | null
          published: boolean | null
          published_at: string | null
          rank_all_time: number | null
          rank_all_time_best: number | null
          rank_current_month: number | null
          slug: string | null
          status: string | null
          style: string[] | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          declined_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_visible?: boolean | null
          manual_publish?: boolean | null
          published?: boolean | null
          published_at?: string | null
          rank_all_time?: number | null
          rank_all_time_best?: number | null
          rank_current_month?: number | null
          slug?: string | null
          status?: string | null
          style?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          declined_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_visible?: boolean | null
          manual_publish?: boolean | null
          published?: boolean | null
          published_at?: string | null
          rank_all_time?: number | null
          rank_all_time_best?: number | null
          rank_current_month?: number | null
          slug?: string | null
          status?: string | null
          style?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          location: string | null
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          location?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          location?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      rank_history: {
        Row: {
          created_at: string
          id: string
          portfolio_id: string
          rank_type: string
          rank_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          portfolio_id: string
          rank_type: string
          rank_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          portfolio_id?: string
          rank_type?: string
          rank_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rank_history_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rank_history_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      rating: {
        Row: {
          created_at: string
          feedback_chip_id: string
          id: string
          is_admin_feedback: boolean
          portfolio_id: string
          rating_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feedback_chip_id: string
          id?: string
          is_admin_feedback?: boolean
          portfolio_id: string
          rating_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feedback_chip_id?: string
          id?: string
          is_admin_feedback?: boolean
          portfolio_id?: string
          rating_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rating_feedback_chip_id_fkey"
            columns: ["feedback_chip_id"]
            isOneToOne: false
            referencedRelation: "feedback_chips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rating_counts: {
        Row: {
          count: number
          created_at: string
          feedback_chip_id: string
          portfolio_id: string
          updated_at: string
        }
        Insert: {
          count?: number
          created_at?: string
          feedback_chip_id: string
          portfolio_id: string
          updated_at?: string
        }
        Update: {
          count?: number
          created_at?: string
          feedback_chip_id?: string
          portfolio_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rating_counts_feedback_chip_id_fkey"
            columns: ["feedback_chip_id"]
            isOneToOne: false
            referencedRelation: "feedback_chips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_counts_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_counts_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_approved: boolean | null
          name: string
          price_range: string | null
          suggested_at: string | null
          suggested_by: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_approved?: boolean | null
          name: string
          price_range?: string | null
          suggested_at?: string | null
          suggested_by?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_approved?: boolean | null
          name?: string
          price_range?: string | null
          suggested_at?: string | null
          suggested_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      styles: {
        Row: {
          category: string | null
          created_at: string | null
          display_name: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          display_name: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      toolkit: {
        Row: {
          affiliate_link: string
          category_id: string
          created_at: string
          description: string
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          affiliate_link: string
          category_id: string
          created_at?: string
          description: string
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          affiliate_link?: string
          category_id?: string
          created_at?: string
          description?: string
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "toolkit_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "toolkit_category"
            referencedColumns: ["id"]
          },
        ]
      }
      toolkit_category: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          order_index: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_index?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          is_approved: boolean | null
          name: string
          suggested_at: string | null
          suggested_by: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_approved?: boolean | null
          name: string
          suggested_at?: string | null
          suggested_by?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_approved?: boolean | null
          name?: string
          suggested_at?: string | null
          suggested_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      upvotes: {
        Row: {
          created_at: string
          id: string
          portfolio_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          portfolio_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          portfolio_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "upvotes_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upvotes_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upvotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback_count: {
        Row: {
          count: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_services: {
        Row: {
          created_at: string
          id: string
          service_category: string | null
          service_id: string
          service_name: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          service_category?: string | null
          service_id: string
          service_name?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          service_category?: string | null
          service_id?: string
          service_name?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_services_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tools: {
        Row: {
          created_at: string
          id: string
          tool_category: string | null
          tool_id: string
          tool_name: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          tool_category?: string | null
          tool_id: string
          tool_name?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          tool_category?: string | null
          tool_id?: string
          tool_name?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tools_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tools_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      comments_with_users: {
        Row: {
          avatar_url: string | null
          content: string | null
          created_at: string | null
          downvotes: number | null
          full_name: string | null
          id: string | null
          is_admin: boolean | null
          parent_id: string | null
          portfolio_id: string | null
          portfolio_title: string | null
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments_with_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_rankings: {
        Row: {
          approved: boolean | null
          avatar_url: string | null
          created_at: string | null
          current_rank: number | null
          deleted_at: string | null
          description: string | null
          full_name: string | null
          id: string | null
          images: string[] | null
          is_visible: boolean | null
          published: boolean | null
          status: string | null
          style: string[] | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          upvote_count: number | null
          user_id: string | null
          username: string | null
          website_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_rating_summary: {
        Row: {
          category: string | null
          count: number | null
          icon_name: string | null
          name: string | null
          portfolio_id: string | null
          rank_in_type: number | null
          short_description: string | null
          type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rating_counts_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_counts_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_upvote_counts: {
        Row: {
          portfolio_id: string | null
          upvote_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "upvotes_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upvotes_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_add_upvote: {
        Args: { p_portfolio_id: string; p_user_id: string }
        Returns: undefined
      }
      delete_user_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_portfolio_rankings: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          current_rank: number
          description: string
          id: string
          title: string
          upvote_count: number
          user_id: string
        }[]
      }
      get_portfolio_rating_summary: {
        Args: { p_portfolio_id: string }
        Returns: {
          negative_ratings: number
          portfolio_id: string
          positive_ratings: number
          total_ratings: number
        }[]
      }
      get_portfolio_upvote_count: {
        Args: { p_portfolio_id: string }
        Returns: number
      }
      has_user_rated_portfolio: {
        Args: { p_portfolio_id: string; p_user_id: string }
        Returns: boolean
      }
      increment_portfolio_upvotes: {
        Args: { p_portfolio_id: string }
        Returns: undefined
      }
      refresh_portfolio_rankings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_portfolio_rankings_manual: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_portfolio_upvote_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      save_portfolio_feedback: {
        Args: {
          p_comment: string
          p_negative_chips: string[]
          p_portfolio_id: string
          p_positive_chips: string[]
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
