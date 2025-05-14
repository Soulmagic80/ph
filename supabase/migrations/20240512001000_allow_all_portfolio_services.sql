ALTER TABLE portfolio_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON portfolio_services;
DROP POLICY IF EXISTS "Allow all" ON portfolio_services;

CREATE POLICY "Allow all" ON portfolio_services
    FOR ALL
    USING (true); 