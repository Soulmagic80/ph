export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  images: string[] | null; // Array von Bild-Pfaden im Storage, default: ARRAY[]::text[]
  tags: string[] | null; // Tags-Array, default: ARRAY[]::text[]
  style?: string[] | null; // Add style attribute
  upvotes: number | null; // default: 0
  rank_current_month: number | null;
  rank_all_time: number | null;
  rank_all_time_best: number | null;
  slug?: string | null;
  created_at: string;
  updated_at: string;
  url?: string | null;
}

// Neue Typen für die zusätzlichen Tabellen
export interface PortfolioRankHistory {
  id: string;
  portfolio_id: string;
  rank_value: number;
  rank_type: 'current_month' | 'all_time';
  created_at: string;
  updated_at: string;
}

export interface FeedbackChip {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioRatingCount {
  id: string;
  portfolio_id: string;
  feedback_chip_id: string;
  count: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioRating {
  id: string;
  portfolio_id: string;
  feedback_chip_id: string;
  user_id: string;
  is_positive: boolean;
  created_at: string;
  feedback_chip: FeedbackChip;
}

export interface Tool {
  id: string;
  name: string;
  description?: string;
  category: string;
  icon_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioTool {
  id: string;
  portfolio_id: string;
  tool_id: string;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  price_range?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioService {
  id: string;
  portfolio_id: string;
  service_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  portfolio_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string; // default: now()
  updated_at: string; // default: now()
  portfolio_title: string | null;
  user: Profile | null; // Beziehung zu profiles über user_id
  replies: Comment[] | null;
}

// Erweiterte Portfolio-Schnittstelle mit Beziehungen
export interface PortfolioWithRelations extends Portfolio {
  rank_history: PortfolioRankHistory[] | null;
  tools: (PortfolioTool & { tool: Tool })[] | null;
  services: (PortfolioService & { service: Service })[] | null;
  comments: Comment[] | null;
  user: Profile | null; // Beziehung zu profiles über user_id
  portfolio_rating: PortfolioRating[] | null;
  portfolio_rating_counts: (PortfolioRatingCount & {
    feedback_chip: FeedbackChip;
  })[] | null;
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean | null; // default: false
}