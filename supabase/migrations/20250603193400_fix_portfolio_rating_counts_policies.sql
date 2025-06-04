-- Drop existing policies
DROP POLICY IF EXISTS "Users can view rating counts" ON portfolio_rating_counts;
DROP POLICY IF EXISTS "Users can insert rating counts" ON portfolio_rating_counts;
DROP POLICY IF EXISTS "Users can update rating counts" ON portfolio_rating_counts;

-- Enable RLS
ALTER TABLE portfolio_rating_counts ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can view rating counts"
ON portfolio_rating_counts
FOR SELECT
USING (true);

CREATE POLICY "Users can insert rating counts"
ON portfolio_rating_counts
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update rating counts"
ON portfolio_rating_counts
FOR UPDATE
USING (true)
WITH CHECK (true); 