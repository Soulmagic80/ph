-- Add rating_type column to portfolio_rating
ALTER TABLE portfolio_rating 
ADD COLUMN rating_type TEXT NOT NULL CHECK (rating_type IN ('positive', 'negative'));

-- Update unique constraint to include rating_type
ALTER TABLE portfolio_rating 
DROP CONSTRAINT portfolio_rating_portfolio_id_feedback_chip_id_key;

ALTER TABLE portfolio_rating 
ADD CONSTRAINT portfolio_rating_portfolio_id_feedback_chip_id_rating_type_key 
UNIQUE (portfolio_id, feedback_chip_id, rating_type); 