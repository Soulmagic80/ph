-- Enable RLS on all tables
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_chips ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_feedback_chips ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON portfolio_services;
DROP POLICY IF EXISTS "Allow all" ON portfolio_services;
DROP POLICY IF EXISTS "Enable read access for all users" ON portfolios;
DROP POLICY IF EXISTS "Allow all" ON portfolios;
DROP POLICY IF EXISTS "Enable read access for all users" ON feedback_chips;
DROP POLICY IF EXISTS "Allow all" ON feedback_chips;
DROP POLICY IF EXISTS "Enable read access for all users" ON portfolio_feedback_chips;
DROP POLICY IF EXISTS "Allow all" ON portfolio_feedback_chips;

-- Create policies for read access
CREATE POLICY "Enable read access for all users" ON portfolios
    FOR SELECT
    USING (true);

CREATE POLICY "Enable read access for all users" ON portfolio_services
    FOR SELECT
    USING (true);

CREATE POLICY "Enable read access for all users" ON feedback_chips
    FOR SELECT
    USING (true);

CREATE POLICY "Enable read access for all users" ON portfolio_feedback_chips
    FOR SELECT
    USING (true); 