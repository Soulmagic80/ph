-- Create portfolio_rank_history table
CREATE TABLE IF NOT EXISTS portfolio_rank_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    rank_value INTEGER NOT NULL,
    rank_type TEXT NOT NULL CHECK (rank_type IN ('current_month', 'all_time')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create feedback_chips table
CREATE TABLE IF NOT EXISTS feedback_chips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('block', 'warning', 'info')),
    color TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_feedback table (junction table)
CREATE TABLE IF NOT EXISTS portfolio_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    feedback_chip_id UUID NOT NULL REFERENCES feedback_chips(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(portfolio_id, feedback_chip_id)
);

-- Create tools table
CREATE TABLE IF NOT EXISTS tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_tools table (junction table)
CREATE TABLE IF NOT EXISTS portfolio_tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(portfolio_id, tool_id)
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    price_range TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_services table (junction table)
CREATE TABLE IF NOT EXISTS portfolio_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(portfolio_id, service_id)
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_portfolio_rank_history_updated_at
    BEFORE UPDATE ON portfolio_rank_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_chips_updated_at
    BEFORE UPDATE ON feedback_chips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE portfolio_rank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_chips ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- portfolio_rank_history policies
CREATE POLICY "Anyone can view portfolio rank history"
    ON portfolio_rank_history FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert portfolio rank history"
    ON portfolio_rank_history FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update portfolio rank history"
    ON portfolio_rank_history FOR UPDATE
    USING (auth.role() = 'authenticated');

-- feedback_chips policies
CREATE POLICY "Anyone can view feedback chips"
    ON feedback_chips FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert feedback chips"
    ON feedback_chips FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update feedback chips"
    ON feedback_chips FOR UPDATE
    USING (auth.role() = 'authenticated');

-- portfolio_feedback policies
CREATE POLICY "Anyone can view portfolio feedback"
    ON portfolio_feedback FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert portfolio feedback"
    ON portfolio_feedback FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update portfolio feedback"
    ON portfolio_feedback FOR UPDATE
    USING (auth.role() = 'authenticated');

-- tools policies
CREATE POLICY "Anyone can view tools"
    ON tools FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert tools"
    ON tools FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update tools"
    ON tools FOR UPDATE
    USING (auth.role() = 'authenticated');

-- portfolio_tools policies
CREATE POLICY "Anyone can view portfolio tools"
    ON portfolio_tools FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert portfolio tools"
    ON portfolio_tools FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update portfolio tools"
    ON portfolio_tools FOR UPDATE
    USING (auth.role() = 'authenticated');

-- services policies
CREATE POLICY "Anyone can view services"
    ON services FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert services"
    ON services FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update services"
    ON services FOR UPDATE
    USING (auth.role() = 'authenticated');

-- portfolio_services policies
CREATE POLICY "Anyone can view portfolio services"
    ON portfolio_services FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert portfolio services"
    ON portfolio_services FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update portfolio services"
    ON portfolio_services FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Insert some initial feedback chips
INSERT INTO feedback_chips (name, description, category, color) VALUES
    ('Block', 'Critical issue that needs immediate attention', 'block', 'bg-rose-500'),
    ('Warning', 'Potential issue that should be reviewed', 'warning', 'bg-orange-500'),
    ('Info', 'General information about the portfolio', 'info', 'bg-blue-500');

-- Insert some initial tools
INSERT INTO tools (name, description, category, icon_url) VALUES
    ('React', 'A JavaScript library for building user interfaces', 'Frontend', 'https://example.com/react.svg'),
    ('Node.js', 'JavaScript runtime built on Chrome''s V8 JavaScript engine', 'Backend', 'https://example.com/nodejs.svg'),
    ('PostgreSQL', 'Advanced open source database', 'Database', 'https://example.com/postgresql.svg');

-- Insert some initial services
INSERT INTO services (name, description, category, price_range) VALUES
    ('Web Development', 'Custom website development services', 'Development', '$1000-$5000'),
    ('UI/UX Design', 'User interface and experience design', 'Design', '$500-$3000'),
    ('Consulting', 'Technical consulting and architecture', 'Consulting', '$150-$300/hour');
