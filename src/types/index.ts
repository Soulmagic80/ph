export interface Portfolio {
  id: string;
  title: string;
  description: string;
  images?: string[]; // Array von Bild-Pfaden im Storage
  upvotes: number;
  created_at: string;
  user_id: string;
  tags?: string[]; // Tags-Array
  rank_current_month?: number;
  rank_all_time?: number;
  rank_all_time_best?: number;
  updated_at: string;
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
  description?: string;
  category: 'block' | 'warning' | 'info';
  color: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioRating {
  id: string;
  portfolio_id: string;
  feedback_chip_id: string;
  created_at: string;
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
  parent_id?: string;
  created_at: string;
  updated_at: string;
  portfolio_title?: string;
  user?: {
    username: string | null;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

// Erweiterte Portfolio-Schnittstelle mit Beziehungen
export interface PortfolioWithRelations extends Portfolio {
  rank_history?: PortfolioRankHistory[];
  ratings?: (PortfolioRating & { feedback_chip: FeedbackChip })[];
  tools?: (PortfolioTool & { tool: Tool })[];
  services?: (PortfolioService & { service: Service })[];
  comments?: Comment[];
}