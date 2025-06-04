-- Update save_portfolio_feedback function to handle existing feedback process entries
CREATE OR REPLACE FUNCTION public.save_portfolio_feedback(
    p_portfolio_id uuid,
    p_user_id uuid,
    p_positive_chips uuid[],
    p_negative_chips uuid[],
    p_comment text
) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_chip_id uuid;
    v_is_admin boolean;
BEGIN
    SELECT is_admin INTO v_is_admin FROM profiles WHERE id = p_user_id;

    -- Insert positive chips
    IF p_positive_chips IS NOT NULL THEN
        FOREACH v_chip_id IN ARRAY p_positive_chips LOOP
            -- First insert the rating
            INSERT INTO portfolio_rating (portfolio_id, feedback_chip_id, user_id, rating_type, is_admin_feedback)
            VALUES (p_portfolio_id, v_chip_id, p_user_id, 'positive', v_is_admin);
            
            -- Then update the count using a single atomic operation
            INSERT INTO portfolio_rating_counts (portfolio_id, feedback_chip_id, count)
            VALUES (p_portfolio_id, v_chip_id, 1)
            ON CONFLICT (portfolio_id, feedback_chip_id) 
            DO UPDATE SET count = portfolio_rating_counts.count + 1;
        END LOOP;
    END IF;

    -- Insert negative chips
    IF p_negative_chips IS NOT NULL THEN
        FOREACH v_chip_id IN ARRAY p_negative_chips LOOP
            -- First insert the rating
            INSERT INTO portfolio_rating (portfolio_id, feedback_chip_id, user_id, rating_type, is_admin_feedback)
            VALUES (p_portfolio_id, v_chip_id, p_user_id, 'negative', v_is_admin);
            
            -- Then update the count using a single atomic operation
            INSERT INTO portfolio_rating_counts (portfolio_id, feedback_chip_id, count)
            VALUES (p_portfolio_id, v_chip_id, 1)
            ON CONFLICT (portfolio_id, feedback_chip_id) 
            DO UPDATE SET count = portfolio_rating_counts.count + 1;
        END LOOP;
    END IF;

    -- Insert comment if provided
    IF p_comment IS NOT NULL AND p_comment != '' THEN
        INSERT INTO portfolio_comments (portfolio_id, user_id, content)
        VALUES (p_portfolio_id, p_user_id, p_comment);
    END IF;

    -- Mark feedback process as completed
    IF v_is_admin THEN
        -- For admins, always create a new entry
        INSERT INTO portfolio_feedback_process (id, portfolio_id, user_id, is_admin_feedback)
        VALUES (gen_random_uuid(), p_portfolio_id, p_user_id, true);
    ELSE
        -- For normal users, update existing entry or create new one
        INSERT INTO portfolio_feedback_process (portfolio_id, user_id, is_admin_feedback)
        VALUES (p_portfolio_id, p_user_id, false)
        ON CONFLICT (portfolio_id, user_id) 
        DO UPDATE SET updated_at = NOW();
    END IF;
END;
$$; 