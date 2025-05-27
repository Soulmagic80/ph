-- Temporarily disable triggers
SET session_replication_role = 'replica';

-- Update counts based on actual ratings
UPDATE portfolio_rating_counts prc
SET count = (
    SELECT COUNT(*)
    FROM portfolio_rating pr
    WHERE pr.portfolio_id = prc.portfolio_id
    AND pr.feedback_chip_id = prc.feedback_chip_id
);

-- Re-enable triggers
SET session_replication_role = 'origin'; 