-- Create upvotes table
CREATE TABLE upvotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, portfolio_id)
);

-- Enable RLS
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view upvotes"
    ON upvotes FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own upvotes"
    ON upvotes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create function to check if user has upvoted
CREATE OR REPLACE FUNCTION has_user_upvoted(
    p_portfolio_id uuid,
    p_user_id uuid
) RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM upvotes 
        WHERE portfolio_id = p_portfolio_id 
        AND user_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 