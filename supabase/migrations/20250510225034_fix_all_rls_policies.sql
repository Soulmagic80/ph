-- Enable RLS for all tables
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view portfolios" ON portfolios;
DROP POLICY IF EXISTS "Authenticated users can insert portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can update their own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can delete their own portfolios" ON portfolios;

DROP POLICY IF EXISTS "Anyone can view portfolio comments" ON portfolio_comments;
DROP POLICY IF EXISTS "Authenticated users can insert portfolio comments" ON portfolio_comments;
DROP POLICY IF EXISTS "Users can update their own portfolio comments" ON portfolio_comments;
DROP POLICY IF EXISTS "Users can delete their own portfolio comments" ON portfolio_comments;

DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create policies for portfolios
CREATE POLICY "Anyone can view portfolios"
    ON portfolios FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert portfolios"
    ON portfolios FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own portfolios"
    ON portfolios FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios"
    ON portfolios FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for portfolio_comments
CREATE POLICY "Anyone can view portfolio comments"
    ON portfolio_comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert portfolio comments"
    ON portfolio_comments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own portfolio comments"
    ON portfolio_comments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio comments"
    ON portfolio_comments FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for profiles
CREATE POLICY "Anyone can view profiles"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Grant necessary permissions to authenticated users
GRANT SELECT ON portfolios TO authenticated;
GRANT SELECT ON portfolio_comments TO authenticated;
GRANT SELECT ON profiles TO authenticated;

GRANT INSERT ON portfolios TO authenticated;
GRANT INSERT ON portfolio_comments TO authenticated;

GRANT UPDATE ON portfolios TO authenticated;
GRANT UPDATE ON portfolio_comments TO authenticated;
GRANT UPDATE ON profiles TO authenticated;

GRANT DELETE ON portfolios TO authenticated;
GRANT DELETE ON portfolio_comments TO authenticated;
