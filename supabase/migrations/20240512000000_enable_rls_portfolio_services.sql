ALTER TABLE portfolio_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON portfolio_services
    FOR SELECT
    USING (true); 