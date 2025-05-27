-- Debug: Show what we're about to migrate
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

-- Migrate existing feedback processes
INSERT INTO portfolio_feedback_process (portfolio_id, user_id)
SELECT DISTINCT portfolio_id, user_id
FROM portfolio_rating
ON CONFLICT (portfolio_id, user_id) DO NOTHING;

-- Debug: Show what was migrated
SELECT 
    pfp.portfolio_id,
    pfp.user_id,
    p.title as portfolio_title,
    u.email as user_email,
    pfp.created_at
FROM portfolio_feedback_process pfp
JOIN portfolios p ON p.id = pfp.portfolio_id
JOIN auth.users u ON u.id = pfp.user_id; 