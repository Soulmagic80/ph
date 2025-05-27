-- Optimize portfolio_rating policies
ALTER POLICY "Only authenticated users can insert portfolio feedback" ON portfolio_rating
USING ((SELECT auth.role()) = 'authenticated');

ALTER POLICY "Only authenticated users can update portfolio feedback" ON portfolio_rating
USING ((SELECT auth.role()) = 'authenticated');

-- Optimize tools policies
ALTER POLICY "Only authenticated users can insert tools" ON tools
USING ((SELECT auth.role()) = 'authenticated');

ALTER POLICY "Only authenticated users can update tools" ON tools
USING ((SELECT auth.role()) = 'authenticated');

-- Optimize services policies
ALTER POLICY "Only authenticated users can insert services" ON services
USING ((SELECT auth.role()) = 'authenticated');

ALTER POLICY "Only authenticated users can update services" ON services
USING ((SELECT auth.role()) = 'authenticated');

-- Optimize portfolios policies
ALTER POLICY "Users can insert their own portfolios or admins can insert any" ON portfolios
USING ((SELECT auth.uid()) = user_id OR (SELECT auth.role()) = 'admin');

ALTER POLICY "Users can update their own portfolios or admins can update any" ON portfolios
USING ((SELECT auth.uid()) = user_id OR (SELECT auth.role()) = 'admin');

ALTER POLICY "Users can delete their own portfolios or admins can delete any" ON portfolios
USING ((SELECT auth.uid()) = user_id OR (SELECT auth.role()) = 'admin');

-- Optimize profiles policies
ALTER POLICY "Users can insert their own profile" ON profiles
USING ((SELECT auth.uid()) = id);

ALTER POLICY "Users can update their own profile" ON profiles
USING ((SELECT auth.uid()) = id);

-- Optimize portfolio_rank_history policies
ALTER POLICY "Only authenticated users can insert portfolio rank history" ON portfolio_rank_history
USING ((SELECT auth.role()) = 'authenticated');

ALTER POLICY "Only authenticated users can update portfolio rank history" ON portfolio_rank_history
USING ((SELECT auth.role()) = 'authenticated');

-- Optimize portfolio_rating_counts policies
ALTER POLICY "Only authenticated users can insert portfolio feedback counts" ON portfolio_rating_counts
USING ((SELECT auth.role()) = 'authenticated');

ALTER POLICY "Only authenticated users can update portfolio feedback counts" ON portfolio_rating_counts
USING ((SELECT auth.role()) = 'authenticated'); 