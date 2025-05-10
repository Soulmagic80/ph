-- Rename tables to use portfolio prefix
ALTER TABLE portfolio_feedback RENAME TO portfolio_rating;
ALTER TABLE comments RENAME TO portfolio_comments;

-- Update foreign key constraints
ALTER TABLE portfolio_rating 
    RENAME CONSTRAINT portfolio_feedback_portfolio_id_fkey TO portfolio_rating_portfolio_id_fkey;
ALTER TABLE portfolio_rating 
    RENAME CONSTRAINT portfolio_feedback_feedback_chip_id_fkey TO portfolio_rating_feedback_chip_id_fkey;

ALTER TABLE portfolio_comments
    RENAME CONSTRAINT comments_portfolio_id_fkey TO portfolio_comments_portfolio_id_fkey;
ALTER TABLE portfolio_comments
    RENAME CONSTRAINT comments_user_id_fkey TO portfolio_comments_user_id_fkey;
ALTER TABLE portfolio_comments
    RENAME CONSTRAINT comments_parent_id_fkey TO portfolio_comments_parent_id_fkey;

-- Update indexes
ALTER INDEX idx_comments_portfolio_id RENAME TO idx_portfolio_comments_portfolio_id;
ALTER INDEX idx_comments_user_id RENAME TO idx_portfolio_comments_user_id;
ALTER INDEX idx_comments_parent_id RENAME TO idx_portfolio_comments_parent_id;

-- Update triggers
ALTER TRIGGER update_comments_updated_at ON portfolio_comments RENAME TO update_portfolio_comments_updated_at;

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can view comments" ON portfolio_comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON portfolio_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON portfolio_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON portfolio_comments;

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
