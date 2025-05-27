export interface FeedbackChip {
  id: string;
  text: string;
  type: 'positive' | 'negative';
}

export interface FeedbackComment {
  id: string;
  text: string;
  user_id: string;
  portfolio_id: string;
  created_at: string;
} 