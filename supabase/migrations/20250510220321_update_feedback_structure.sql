-- Rename old table for backup
ALTER TABLE IF EXISTS portfolio_feedback_chips RENAME TO portfolio_feedback_chips_old;

-- Create new portfolio_feedback table with is_positive flag
CREATE TABLE IF NOT EXISTS portfolio_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    feedback_chip_id UUID NOT NULL REFERENCES feedback_chips(id) ON DELETE CASCADE,
    is_positive BOOLEAN NOT NULL, -- true for positive feedback, false for negative
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(portfolio_id, feedback_chip_id)
);

-- Enable RLS
ALTER TABLE portfolio_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view portfolio feedback"
    ON portfolio_feedback FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert portfolio feedback"
    ON portfolio_feedback FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update portfolio feedback"
    ON portfolio_feedback FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Insert some sample feedback chips if they don't exist
INSERT INTO feedback_chips (name, category, color) VALUES
    ('Well structured', 'info', '#4F46E5'),
    ('Creative', 'info', '#F59E42'),
    ('Professional', 'info', '#10B981'),
    ('Responsive layout', 'info', '#06B6D4'),
    ('Good performance', 'info', '#F43F5E'),
    ('Modern design', 'info', '#8B5CF6'),
    ('User friendly', 'info', '#EC4899'),
    ('Innovative', 'info', '#14B8A6'),
    ('Slow loading time', 'warning', '#EF4444'),
    ('Unclear navigation', 'warning', '#F97316'),
    ('Missing features', 'warning', '#EC4899'),
    ('Poor mobile experience', 'warning', '#F43F5E'),
    ('Outdated design', 'warning', '#8B5CF6'),
    ('Limited functionality', 'warning', '#14B8A6')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, color = EXCLUDED.color; 