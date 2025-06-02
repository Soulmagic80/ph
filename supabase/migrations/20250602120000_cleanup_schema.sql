-- Drop test table
DROP TABLE IF EXISTS public.test_table;

-- Drop duplicate triggers
DROP TRIGGER IF EXISTS update_portfolio_title_trigger ON public.portfolios;
DROP TRIGGER IF EXISTS update_updated_at_trigger ON public.portfolios;

-- Consolidate functions
DROP FUNCTION IF EXISTS public.save_feedback;
DROP FUNCTION IF EXISTS public.update_portfolio_title_in_comments;
-- save_portfolio_feedback is the main function to use

-- Create a single updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply the single updated_at trigger to all tables
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.portfolio_comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.portfolio_feedback_status
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.portfolio_rank_history
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.tools
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Drop all old triggers that use update_updated_at_column
DROP TRIGGER IF EXISTS set_portfolios_updated_at ON public.portfolios;
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_portfolio_comments_updated_at ON public.portfolio_comments;
DROP TRIGGER IF EXISTS update_portfolio_feedback_status_updated_at ON public.portfolio_feedback_status;
DROP TRIGGER IF EXISTS update_portfolio_rank_history_updated_at ON public.portfolio_rank_history;
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;
DROP TRIGGER IF EXISTS update_updated_at_trigger ON public.portfolios;

-- And finally drop the old function
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_rating_portfolio_id ON public.portfolio_rating(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_rating_user_id ON public.portfolio_rating(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_comments_portfolio_id ON public.portfolio_comments(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_feedback_process_portfolio_id ON public.portfolio_feedback_process(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_upvotes_portfolio_id ON public.portfolio_upvotes(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_upvotes_user_id ON public.portfolio_upvotes(user_id);

-- Add missing constraints if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portfolio_rating_unique_user_chip') THEN
        ALTER TABLE public.portfolio_rating
            ADD CONSTRAINT portfolio_rating_unique_user_chip
            UNIQUE (portfolio_id, user_id, feedback_chip_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portfolio_upvotes_unique_user') THEN
        ALTER TABLE public.portfolio_upvotes
            ADD CONSTRAINT portfolio_upvotes_unique_user
            UNIQUE (portfolio_id, user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portfolio_rating_feedback_chip_id_fkey') THEN
        ALTER TABLE public.portfolio_rating
            ADD CONSTRAINT portfolio_rating_feedback_chip_id_fkey
            FOREIGN KEY (feedback_chip_id)
            REFERENCES public.feedback_chips(id)
            ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portfolio_services_service_id_fkey') THEN
        ALTER TABLE public.portfolio_services
            ADD CONSTRAINT portfolio_services_service_id_fkey
            FOREIGN KEY (service_id)
            REFERENCES public.services(id)
            ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portfolio_tools_tool_id_fkey') THEN
        ALTER TABLE public.portfolio_tools
            ADD CONSTRAINT portfolio_tools_tool_id_fkey
            FOREIGN KEY (tool_id)
            REFERENCES public.tools(id)
            ON DELETE CASCADE;
    END IF;
END $$; 