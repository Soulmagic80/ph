-- Drop existing tables
DROP TABLE IF EXISTS portfolios CASCADE;

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create portfolios table
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    upvotes INTEGER DEFAULT 0,
    rank_current_month INTEGER,
    rank_all_time INTEGER,
    rank_all_time_best INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for portfolios
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);

-- Create trigger for portfolios updated_at
CREATE TRIGGER set_portfolios_updated_at
    BEFORE UPDATE ON portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for portfolios
CREATE POLICY "Anyone can read portfolios"
    ON portfolios FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert portfolios"
    ON portfolios FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own portfolios"
    ON portfolios FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own portfolios"
    ON portfolios FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Insert dummy data
INSERT INTO portfolios (user_id, title, description, images, tags, upvotes, rank_current_month, rank_all_time, rank_all_time_best)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Modern Portfolio Design', 'A sleek and modern portfolio showcasing my latest web development projects.', ARRAY['https://picsum.photos/800/600', 'https://picsum.photos/800/601', 'https://picsum.photos/800/602', 'https://picsum.photos/800/603'], ARRAY['React', 'Next.js', 'Tailwind CSS'], 42, 1, 5, 3),
    ('00000000-0000-0000-0000-000000000001', 'Creative Agency Website', 'A dynamic website for a creative agency with interactive elements.', ARRAY['https://picsum.photos/800/601', 'https://picsum.photos/800/602', 'https://picsum.photos/800/603', 'https://picsum.photos/800/604'], ARRAY['Vue.js', 'Node.js', 'MongoDB'], 35, 2, 8, 6),
    ('00000000-0000-0000-0000-000000000002', 'E-commerce Platform', 'A full-featured e-commerce platform with modern design and functionality.', ARRAY['https://picsum.photos/800/602', 'https://picsum.photos/800/603', 'https://picsum.photos/800/604', 'https://picsum.photos/800/605'], ARRAY['React', 'Express', 'PostgreSQL'], 28, 3, 12, 9),
    ('00000000-0000-0000-0000-000000000002', 'Mobile App UI Design', 'A beautiful mobile app interface design with smooth animations.', ARRAY['https://picsum.photos/800/603', 'https://picsum.photos/800/604', 'https://picsum.photos/800/605', 'https://picsum.photos/800/606'], ARRAY['Figma', 'Swift', 'Firebase'], 56, 4, 3, 2),
    ('00000000-0000-0000-0000-000000000003', 'Data Visualization Dashboard', 'An interactive dashboard for visualizing complex data sets.', ARRAY['https://picsum.photos/800/604', 'https://picsum.photos/800/605', 'https://picsum.photos/800/606', 'https://picsum.photos/800/607'], ARRAY['D3.js', 'Python', 'Django'], 19, 5, 15, 12);
