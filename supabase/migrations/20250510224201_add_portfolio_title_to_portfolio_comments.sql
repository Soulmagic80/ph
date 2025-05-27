-- Add portfolio_title to portfolio_comments
ALTER TABLE portfolio_comments ADD COLUMN portfolio_title TEXT;

-- Backfill for existing comments
UPDATE portfolio_comments c
SET portfolio_title = p.title
FROM portfolios p
WHERE c.portfolio_id = p.id;

-- Trigger function to keep portfolio_title in sync
CREATE OR REPLACE FUNCTION update_portfolio_title_in_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE portfolio_comments
  SET portfolio_title = NEW.title
  WHERE portfolio_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on portfolios table
DROP TRIGGER IF EXISTS trg_update_portfolio_title_in_comments ON portfolios;
CREATE TRIGGER trg_update_portfolio_title_in_comments
AFTER UPDATE OF title ON portfolios
FOR EACH ROW
EXECUTE FUNCTION update_portfolio_title_in_comments();
