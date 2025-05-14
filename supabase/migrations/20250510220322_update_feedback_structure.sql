-- Remove unnecessary columns from feedback_chips
ALTER TABLE feedback_chips 
    DROP COLUMN IF EXISTS category,
    DROP COLUMN IF EXISTS color,
    DROP COLUMN IF EXISTS description;

-- Add given_feedbacks counter to profiles
ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS given_feedbacks INTEGER DEFAULT 0;

-- Create a unique constraint to ensure one feedback process per user per portfolio
ALTER TABLE portfolio_feedback
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
    ADD CONSTRAINT unique_user_portfolio_feedback UNIQUE (portfolio_id, user_id);

-- Create a function to check the number of positive/negative chips per feedback process
CREATE OR REPLACE FUNCTION check_feedback_chip_limit()
RETURNS TRIGGER AS $$
DECLARE
    positive_count INTEGER;
    negative_count INTEGER;
BEGIN
    -- Count positive chips for this user and portfolio
    SELECT COUNT(*) INTO positive_count
    FROM portfolio_feedback
    WHERE portfolio_id = NEW.portfolio_id 
    AND user_id = NEW.user_id 
    AND is_positive = true;

    -- Count negative chips for this user and portfolio
    SELECT COUNT(*) INTO negative_count
    FROM portfolio_feedback
    WHERE portfolio_id = NEW.portfolio_id 
    AND user_id = NEW.user_id 
    AND is_positive = false;

    -- Check limits
    IF NEW.is_positive AND positive_count >= 4 THEN
        RAISE EXCEPTION 'Maximum of 4 positive feedback chips reached for this portfolio';
    END IF;

    IF NOT NEW.is_positive AND negative_count >= 2 THEN
        RAISE EXCEPTION 'Maximum of 2 negative feedback chips reached for this portfolio';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce chip limits
DROP TRIGGER IF EXISTS check_feedback_chip_limit_trigger ON portfolio_feedback;
CREATE TRIGGER check_feedback_chip_limit_trigger
    BEFORE INSERT ON portfolio_feedback
    FOR EACH ROW
    EXECUTE FUNCTION check_feedback_chip_limit();

-- Create a function to update the given_feedbacks counter
CREATE OR REPLACE FUNCTION update_given_feedbacks()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update when a new feedback process is started (first chip)
    IF NOT EXISTS (
        SELECT 1 FROM portfolio_feedback 
        WHERE portfolio_id = NEW.portfolio_id 
        AND user_id = NEW.user_id
    ) THEN
        UPDATE profiles
        SET given_feedbacks = given_feedbacks + 1
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update given_feedbacks counter
DROP TRIGGER IF EXISTS update_given_feedbacks_trigger ON portfolio_feedback;
CREATE TRIGGER update_given_feedbacks_trigger
    AFTER INSERT ON portfolio_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_given_feedbacks(); 