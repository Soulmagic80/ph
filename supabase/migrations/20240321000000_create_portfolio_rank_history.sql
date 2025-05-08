-- Create portfolio_rank_history table
CREATE TABLE portfolio_rank_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    rank_all_time INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_portfolio_rank_history_portfolio_id ON portfolio_rank_history(portfolio_id);
CREATE INDEX idx_portfolio_rank_history_created_at ON portfolio_rank_history(created_at);

-- Add trigger to automatically insert rank history when rank_all_time changes
CREATE OR REPLACE FUNCTION insert_rank_history()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.rank_all_time IS DISTINCT FROM OLD.rank_all_time THEN
        INSERT INTO portfolio_rank_history (portfolio_id, rank_all_time)
        VALUES (NEW.id, NEW.rank_all_time);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolio_rank_history_trigger
AFTER UPDATE OF rank_all_time ON portfolios
FOR EACH ROW
EXECUTE FUNCTION insert_rank_history();

-- Initialize history with current ranks
INSERT INTO portfolio_rank_history (portfolio_id, rank_all_time)
SELECT id, rank_all_time FROM portfolios WHERE rank_all_time IS NOT NULL; 