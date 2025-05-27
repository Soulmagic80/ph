-- Update function to check both tables
CREATE OR REPLACE FUNCTION has_user_rated_portfolio(
  p_portfolio_id uuid,
  p_user_id uuid
) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM portfolio_feedback 
    WHERE portfolio_id = p_portfolio_id 
    AND user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 