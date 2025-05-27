-- Debug: Show all feedback processes
SELECT 
    pfp.portfolio_id,
    pfp.user_id,
    p.title as portfolio_title,
    u.email as user_email,
    pfp.created_at
FROM portfolio_feedback_process pfp
JOIN portfolios p ON p.id = pfp.portfolio_id
JOIN auth.users u ON u.id = pfp.user_id;

-- Debug: Show all ratings
SELECT 
    pr.portfolio_id,
    pr.user_id,
    p.title as portfolio_title,
    u.email as user_email,
    COUNT(*) as rating_count
FROM portfolio_rating pr
JOIN portfolios p ON p.id = pr.portfolio_id
JOIN auth.users u ON u.id = pr.user_id
GROUP BY pr.portfolio_id, pr.user_id, p.title, u.email; 