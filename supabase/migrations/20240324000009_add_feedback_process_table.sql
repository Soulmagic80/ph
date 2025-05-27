-- Create table to track completed feedback processes
CREATE TABLE portfolio_feedback_process (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(portfolio_id, user_id)
);

-- Enable RLS
ALTER TABLE portfolio_feedback_process ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view feedback processes"
    ON portfolio_feedback_process FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own feedback processes"
    ON portfolio_feedback_process FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create function to check if user has completed feedback
CREATE OR REPLACE FUNCTION has_user_rated_portfolio(
    p_portfolio_id uuid,
    p_user_id uuid
) RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM portfolio_feedback_process 
        WHERE portfolio_id = p_portfolio_id 
        AND user_id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 