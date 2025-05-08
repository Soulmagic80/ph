-- Add rank_all_time_best column to portfolios table
ALTER TABLE portfolios ADD COLUMN rank_all_time_best INTEGER;
 
-- Initialize rank_all_time_best with current rank_all_time values
UPDATE portfolios SET rank_all_time_best = rank_all_time WHERE rank_all_time IS NOT NULL; 