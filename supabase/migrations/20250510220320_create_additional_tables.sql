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

-- Insert initial tools with more realistic data
INSERT INTO tools (name, description, category, icon_url) VALUES
    ('React', 'A JavaScript library for building user interfaces', 'Frontend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
    ('Next.js', 'React framework for production', 'Frontend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg'),
    ('TypeScript', 'Typed superset of JavaScript', 'Language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'),
    ('Tailwind CSS', 'Utility-first CSS framework', 'Frontend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg'),
    ('Node.js', 'JavaScript runtime for server-side development', 'Backend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'),
    ('PostgreSQL', 'Advanced open source database', 'Database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'),
    ('Docker', 'Container platform', 'DevOps', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'),
    ('Figma', 'Collaborative interface design tool', 'Design', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg'),
    ('Git', 'Distributed version control system', 'DevOps', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'),
    ('AWS', 'Cloud computing platform', 'Cloud', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg')
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    icon_url = EXCLUDED.icon_url;

-- Insert initial services with more realistic data
INSERT INTO services (name, description, category, price_range) VALUES
    ('Web Development', 'Custom website development with modern technologies', 'Development', '$2,000-$10,000'),
    ('UI/UX Design', 'User interface and experience design for web and mobile', 'Design', '$1,500-$5,000'),
    ('Mobile App Development', 'Native and cross-platform mobile application development', 'Development', '$5,000-$20,000'),
    ('E-commerce Solutions', 'Custom e-commerce platform development', 'Development', '$3,000-$15,000'),
    ('Technical Consulting', 'Expert advice on technology stack and architecture', 'Consulting', '$150-$300/hour'),
    ('Performance Optimization', 'Website and application performance improvement', 'Optimization', '$1,000-$5,000'),
    ('SEO Services', 'Search engine optimization and digital marketing', 'Marketing', '$500-$2,000/month'),
    ('Content Creation', 'Professional content writing and strategy', 'Content', '$50-$200/page'),
    ('Cloud Migration', 'Moving applications to cloud infrastructure', 'Cloud', '$5,000-$25,000'),
    ('Maintenance & Support', 'Ongoing technical support and maintenance', 'Support', '$500-$2,000/month')
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    price_range = EXCLUDED.price_range;

-- Insert test data for feedback chips
INSERT INTO feedback_chips (name, count, category, color) VALUES
    ('Well structured', 42, 'info', '#4F46E5'),
    ('Creative', 38, 'info', '#F59E42'),
    ('Professional', 35, 'info', '#10B981'),
    ('Responsive layout', 31, 'info', '#06B6D4'),
    ('Good performance', 28, 'info', '#F43F5E'),
    ('Slow loading time', 15, 'warning', '#EF4444'),
    ('Unclear navigation', 12, 'warning', '#F97316'),
    ('Missing features', 8, 'warning', '#EC4899')
ON CONFLICT (name) DO UPDATE SET count = EXCLUDED.count, category = EXCLUDED.category, color = EXCLUDED.color;

-- Link feedback chips to a portfolio (replace 'YOUR_PORTFOLIO_ID' with an actual portfolio ID)
INSERT INTO portfolio_feedback_chips (portfolio_id, feedback_chip_id)
SELECT 
    'YOUR_PORTFOLIO_ID', -- Replace this with an actual portfolio ID
    id
FROM feedback_chips
WHERE name IN ('Well structured', 'Creative', 'Professional', 'Responsive layout', 'Good performance', 'Slow loading time', 'Unclear navigation', 'Missing features')
ON CONFLICT (portfolio_id, feedback_chip_id) DO NOTHING;

-- Link tools to portfolios (replace 'YOUR_PORTFOLIO_ID' with actual portfolio IDs)
INSERT INTO portfolio_tools (portfolio_id, tool_id)
SELECT 
    p.id,
    t.id
FROM portfolios p
CROSS JOIN tools t
WHERE p.id IN (SELECT id FROM portfolios LIMIT 5)  -- Link to first 5 portfolios
AND t.name IN ('React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js')  -- Link specific tools
ON CONFLICT (portfolio_id, tool_id) DO NOTHING;

-- Link services to portfolios
INSERT INTO portfolio_services (portfolio_id, service_id)
SELECT 
    p.id,
    s.id
FROM portfolios p
CROSS JOIN services s
WHERE p.id IN (SELECT id FROM portfolios LIMIT 5)  -- Link to first 5 portfolios
AND s.name IN ('Web Development', 'UI/UX Design', 'Technical Consulting')  -- Link specific services
ON CONFLICT (portfolio_id, service_id) DO NOTHING;

-- Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    split_part(new.email, '@', 1),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
