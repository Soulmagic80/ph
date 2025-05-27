-- Drop the old feedback_chips table
DROP TABLE IF EXISTS feedback_chips CASCADE;

-- Recreate feedback_chips table with only necessary columns
CREATE TABLE IF NOT EXISTS feedback_chips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE feedback_chips ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view feedback chips"
    ON feedback_chips FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert feedback chips"
    ON feedback_chips FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update feedback chips"
    ON feedback_chips FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Insert some initial feedback chips
INSERT INTO feedback_chips (name) VALUES
    ('Well structured'),
    ('Creative'),
    ('Professional'),
    ('Responsive layout'),
    ('Good performance'),
    ('Modern design'),
    ('User friendly'),
    ('Innovative'),
    ('Slow loading time'),
    ('Unclear navigation'),
    ('Missing features'),
    ('Poor mobile experience'),
    ('Outdated design'),
    ('Limited functionality')
ON CONFLICT (name) DO NOTHING; 