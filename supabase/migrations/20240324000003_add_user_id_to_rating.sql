-- Add user_id column to portfolio_rating
ALTER TABLE portfolio_rating
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Remove the incorrect unique constraint
ALTER TABLE portfolio_rating
DROP CONSTRAINT IF EXISTS portfolio_rating_portfolio_id_feedback_chip_id_rating_type_key;

-- Add the correct unique constraint (one vote per user per chip per portfolio)
ALTER TABLE portfolio_rating
ADD CONSTRAINT portfolio_rating_portfolio_id_feedback_chip_id_user_id_key 
UNIQUE (portfolio_id, feedback_chip_id, user_id); 