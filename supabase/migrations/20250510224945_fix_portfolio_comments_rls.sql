-- Enable RLS
ALTER TABLE portfolio_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view portfolio comments" ON portfolio_comments;
DROP POLICY IF EXISTS "Authenticated users can insert portfolio comments" ON portfolio_comments;
DROP POLICY IF EXISTS "Users can update their own portfolio comments" ON portfolio_comments;
DROP POLICY IF EXISTS "Users can delete their own portfolio comments" ON portfolio_comments;

-- Create new policies
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

-- Also ensure profiles table is accessible
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Anyone can view profiles"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
