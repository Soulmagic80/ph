-- Clean up portfolio_rating policies
DROP POLICY IF EXISTS "Allow anonymous users to read portfolio_rating" ON portfolio_rating;
DROP POLICY IF EXISTS "Allow authenticated users to read portfolio_rating" ON portfolio_rating;

-- Clean up portfolio_rating_counts policies
DROP POLICY IF EXISTS "Allow anonymous users to read portfolio_rating_counts" ON portfolio_rating_counts;
DROP POLICY IF EXISTS "Allow authenticated users to read portfolio_rating_counts" ON portfolio_rating_counts;

-- Clean up portfolio_tools policies
DROP POLICY IF EXISTS "Allow anonymous users to read portfolio_tools" ON portfolio_tools;
DROP POLICY IF EXISTS "Allow authenticated users to read portfolio_tools" ON portfolio_tools;

-- Clean up portfolios policies
DROP POLICY IF EXISTS "Anyone can read portfolios" ON portfolios;
DROP POLICY IF EXISTS "Anyone can view portfolios" ON portfolios;
DROP POLICY IF EXISTS "Allow all operations" ON portfolios;
DROP POLICY IF EXISTS "Users can delete their own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can update their own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Authenticated users can insert portfolios" ON portfolios;

-- Create unified portfolios policies
CREATE POLICY "portfolios_select_policy" ON portfolios FOR SELECT USING (true);

CREATE POLICY "portfolios_insert_policy" ON portfolios 
    FOR INSERT 
    WITH CHECK ((SELECT auth.role()) = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "portfolios_update_policy" ON portfolios 
    FOR UPDATE 
    USING ((SELECT auth.uid()) = user_id OR (SELECT auth.role()) = 'admin')
    WITH CHECK ((SELECT auth.uid()) = user_id OR (SELECT auth.role()) = 'admin');

CREATE POLICY "portfolios_delete_policy" ON portfolios 
    FOR DELETE 
    USING ((SELECT auth.uid()) = user_id OR (SELECT auth.role()) = 'admin');

-- Clean up profiles policies
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;

CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT USING (true);

-- Clean up services policies
DROP POLICY IF EXISTS "Allow anonymous users to read services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to read services" ON services;
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Allow all operations" ON services;

CREATE POLICY "services_select_policy" ON services FOR SELECT USING (true);
CREATE POLICY "services_insert_policy" ON services FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');
CREATE POLICY "services_update_policy" ON services FOR UPDATE USING ((SELECT auth.role()) = 'authenticated');

-- Clean up tools policies
DROP POLICY IF EXISTS "Allow all operations" ON tools;
DROP POLICY IF EXISTS "Anyone can view tools" ON tools;

CREATE POLICY "tools_select_policy" ON tools FOR SELECT USING (true);
CREATE POLICY "tools_insert_policy" ON tools FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');
CREATE POLICY "tools_update_policy" ON tools FOR UPDATE USING ((SELECT auth.role()) = 'authenticated'); 