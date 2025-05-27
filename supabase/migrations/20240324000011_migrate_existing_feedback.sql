-- Migrate existing feedback processes
INSERT INTO portfolio_feedback_process (portfolio_id, user_id)
SELECT DISTINCT portfolio_id, user_id
FROM portfolio_rating
ON CONFLICT (portfolio_id, user_id) DO NOTHING; 