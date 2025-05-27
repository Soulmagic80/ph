-- Add unique constraint for portfolio_rating_counts
ALTER TABLE portfolio_rating_counts
ADD CONSTRAINT portfolio_rating_counts_portfolio_id_feedback_chip_id_key 
UNIQUE (portfolio_id, feedback_chip_id); 