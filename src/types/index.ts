export interface Portfolio {
  id: string;
  title: string;
  description: string;
  images?: string[]; // Array von Bild-Pfaden im Storage
  upvotes: number;
  created_at: string;
  user_id: string;
  tags?: string[]; // Tags-Array
  services?: string[]; // Services-Array
  tools?: string[]; // Tools-Array
  rank_all_time?: number; // All Time Rang
  rank_new?: number | null; // New This Month Rang (null für ältere Portfolios)
}