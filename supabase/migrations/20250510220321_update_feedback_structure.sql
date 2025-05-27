-- Create function to save feedback
CREATE OR REPLACE FUNCTION save_feedback(
    p_portfolio_id UUID,
    p_positive_chips TEXT[],
    p_negative_chips TEXT[],
    p_comments TEXT
) RETURNS void AS $$
BEGIN
    -- Update positive chips counts
    IF p_positive_chips IS NOT NULL AND array_length(p_positive_chips, 1) > 0 THEN
        UPDATE positive_feedback_chips
        SET count = count + 1
        WHERE portfolio_id = p_portfolio_id
        AND chip IN (SELECT unnest(p_positive_chips));
    END IF;

    -- Update negative chips counts
    IF p_negative_chips IS NOT NULL AND array_length(p_negative_chips, 1) > 0 THEN
        UPDATE negative_feedback_chips
        SET count = count + 1
        WHERE portfolio_id = p_portfolio_id
        AND chip IN (SELECT unnest(p_negative_chips));
    END IF;
END;
$$ LANGUAGE plpgsql; 