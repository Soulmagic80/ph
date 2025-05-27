-- Drop existing table and trigger if they exist
DROP TRIGGER IF EXISTS portfolio_upvotes_count_trigger ON portfolio_upvotes;
DROP FUNCTION IF EXISTS update_portfolio_upvotes_count();
DROP TABLE IF EXISTS portfolio_upvotes;

-- Create portfolio_upvotes table in public schema
CREATE TABLE public.portfolio_upvotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(portfolio_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_upvotes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all upvotes"
    ON public.portfolio_upvotes
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own upvotes"
    ON public.portfolio_upvotes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own upvotes"
    ON public.portfolio_upvotes
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_portfolio_upvotes_portfolio_id ON public.portfolio_upvotes(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_upvotes_user_id ON public.portfolio_upvotes(user_id);

-- Add trigger to update upvotes count in portfolios table
CREATE OR REPLACE FUNCTION public.update_portfolio_upvotes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.portfolios 
        SET upvotes = upvotes + 1 
        WHERE id = NEW.portfolio_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.portfolios 
        SET upvotes = upvotes - 1 
        WHERE id = OLD.portfolio_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolio_upvotes_count_trigger
AFTER INSERT OR DELETE ON public.portfolio_upvotes
FOR EACH ROW
EXECUTE FUNCTION public.update_portfolio_upvotes_count(); 