-- Create a function to save feedback
CREATE OR REPLACE FUNCTION save_feedback(
    p_portfolio_id UUID,
    p_positive_chips UUID[],
    p_negative_chips UUID[],
    p_comments TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert positive chips
    FOR i IN 1..array_length(p_positive_chips, 1) LOOP
        INSERT INTO portfolio_rating_counts (portfolio_id, feedback_chip_id, count)
        VALUES (p_portfolio_id, p_positive_chips[i], 1)
        ON CONFLICT (portfolio_id, feedback_chip_id)
        DO UPDATE SET count = portfolio_rating_counts.count + 1;
    END LOOP;

    -- Insert negative chips
    FOR i IN 1..array_length(p_negative_chips, 1) LOOP
        INSERT INTO portfolio_rating_counts (portfolio_id, feedback_chip_id, count)
        VALUES (p_portfolio_id, p_negative_chips[i], 1)
        ON CONFLICT (portfolio_id, feedback_chip_id)
        DO UPDATE SET count = portfolio_rating_counts.count + 1;
    END LOOP;

    -- Insert comments if provided
    IF p_comments IS NOT NULL AND p_comments != '' THEN
        INSERT INTO portfolio_comments (portfolio_id, comment)
        VALUES (p_portfolio_id, p_comments);
    END IF;
END;
$$; 