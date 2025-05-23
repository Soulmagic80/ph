export interface Portfolio {
  id: string;
  title: string;
  images?: string[];
  tags?: string[];
  upvotes: number;
  rank_all_time?: number;
  rank_best?: number;
  created_at?: string;
  updated_at?: string;
} 