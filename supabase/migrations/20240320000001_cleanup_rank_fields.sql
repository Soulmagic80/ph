-- Drop unnecessary rank columns
ALTER TABLE portfolios 
DROP COLUMN IF EXISTS rank_previous_month,
DROP COLUMN IF EXISTS rank_change,
DROP COLUMN IF EXISTS rank_previous_all_time,
DROP COLUMN IF EXISTS rank_new;

-- Update rank_current_month for portfolios from current month
UPDATE portfolios 
SET rank_current_month = subquery.rank
FROM (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY DATE_TRUNC('month', created_at)
            ORDER BY upvotes DESC
        ) as rank
    FROM portfolios
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
) as subquery
WHERE portfolios.id = subquery.id; 