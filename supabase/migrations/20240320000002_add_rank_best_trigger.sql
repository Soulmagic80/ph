-- Function to update rank_all_time_best
CREATE OR REPLACE FUNCTION update_rank_all_time_best()
RETURNS TRIGGER AS $$
BEGIN
    -- If rank_all_time_best is NULL or higher (worse) than current rank, update it
    IF NEW.rank_all_time_best IS NULL OR NEW.rank_all_time < NEW.rank_all_time_best THEN
        NEW.rank_all_time_best := NEW.rank_all_time;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_rank_all_time_best_trigger ON portfolios;
CREATE TRIGGER update_rank_all_time_best_trigger
    BEFORE INSERT OR UPDATE OF rank_all_time
    ON portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_rank_all_time_best();

-- Fix any existing incorrect data
UPDATE portfolios
SET rank_all_time_best = rank_all_time
WHERE rank_all_time_best IS NULL 
   OR rank_all_time < rank_all_time_best; 