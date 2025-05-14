-- Enable RLS on all tables
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_chips ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_feedback_chips ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON portfolio_services;
DROP POLICY IF EXISTS "Allow all" ON portfolio_services;
DROP POLICY IF EXISTS "Allow all operations" ON portfolio_services;
DROP POLICY IF EXISTS "Enable read access for all users" ON portfolios;
DROP POLICY IF EXISTS "Allow all" ON portfolios;
DROP POLICY IF EXISTS "Allow all operations" ON portfolios;
DROP POLICY IF EXISTS "Enable read access for all users" ON services;
DROP POLICY IF EXISTS "Allow all" ON services;
DROP POLICY IF EXISTS "Allow all operations" ON services;
DROP POLICY IF EXISTS "Enable read access for all users" ON portfolio_tools;
DROP POLICY IF EXISTS "Allow all" ON portfolio_tools;
DROP POLICY IF EXISTS "Allow all operations" ON portfolio_tools;
DROP POLICY IF EXISTS "Enable read access for all users" ON tools;
DROP POLICY IF EXISTS "Allow all" ON tools;
DROP POLICY IF EXISTS "Allow all operations" ON tools;
DROP POLICY IF EXISTS "Enable read access for all users" ON feedback_chips;
DROP POLICY IF EXISTS "Allow all" ON feedback_chips;
DROP POLICY IF EXISTS "Allow all operations" ON feedback_chips;
DROP POLICY IF EXISTS "Enable read access for all users" ON portfolio_feedback_chips;
DROP POLICY IF EXISTS "Allow all" ON portfolio_feedback_chips;
DROP POLICY IF EXISTS "Allow all operations" ON portfolio_feedback_chips;

-- Create ALL policies for each table
CREATE POLICY "Allow all operations" ON portfolios
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations" ON portfolio_services
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations" ON services
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations" ON portfolio_tools
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations" ON tools
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations" ON feedback_chips
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations" ON portfolio_feedback_chips
    FOR ALL
    USING (true)
    WITH CHECK (true); 