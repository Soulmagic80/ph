-- Create feedback_chips table if it doesn't exist
CREATE TABLE IF NOT EXISTS feedback_chips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add count column to feedback_chips if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'feedback_chips' AND column_name = 'count') THEN
        ALTER TABLE feedback_chips ADD COLUMN count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create portfolio_feedback_chips junction table
CREATE TABLE IF NOT EXISTS portfolio_feedback_chips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    feedback_chip_id UUID NOT NULL REFERENCES feedback_chips(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(portfolio_id, feedback_chip_id)
);

-- Add some sample feedback chips
INSERT INTO feedback_chips (name, count, category, color) VALUES
    ('Well structured', 42, 'info', '#4F46E5'),
    ('Creative', 38, 'info', '#F59E42'),
    ('Professional', 35, 'info', '#10B981'),
    ('Responsive layout', 31, 'info', '#06B6D4'),
    ('Good performance', 28, 'info', '#F43F5E')
ON CONFLICT (name) DO UPDATE SET count = EXCLUDED.count, category = EXCLUDED.category, color = EXCLUDED.color;

-- Add RLS policies
ALTER TABLE feedback_chips ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_feedback_chips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON feedback_chips
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON portfolio_feedback_chips
    FOR SELECT USING (true); 