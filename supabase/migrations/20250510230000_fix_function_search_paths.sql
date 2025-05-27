-- Fix search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql SET search_path = public;

-- Fix search_path for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        split_part(NEW.email, '@', 1),
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER SET search_path = public;

-- Fix search_path for update_feedback_count function
CREATE OR REPLACE FUNCTION public.update_feedback_count()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO portfolio_feedback_counts (portfolio_id, feedback_chip_id, count)
    VALUES (NEW.portfolio_id, NEW.feedback_chip_id, 1)
    ON CONFLICT (portfolio_id, feedback_chip_id) 
    DO UPDATE SET 
        count = portfolio_feedback_counts.count + 1,
        updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql SET search_path = public;

-- Fix search_path for update_portfolio_title_in_comments function
CREATE OR REPLACE FUNCTION public.update_portfolio_title_in_comments()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE portfolio_comments
    SET portfolio_title = NEW.title
    WHERE portfolio_id = NEW.id;
    RETURN NEW;
END;
$$ language plpgsql SET search_path = public; 