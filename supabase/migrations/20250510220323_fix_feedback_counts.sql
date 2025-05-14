-- Remove global count from feedback_chips
ALTER TABLE feedback_chips 
    DROP COLUMN IF EXISTS count;

-- Create a new table for portfolio-specific chip counts
CREATE TABLE IF NOT EXISTS portfolio_feedback_counts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    feedback_chip_id UUID NOT NULL REFERENCES feedback_chips(id) ON DELETE CASCADE,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(portfolio_id, feedback_chip_id)
);

-- Create a function to update the count when feedback is added
CREATE OR REPLACE FUNCTION update_feedback_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update the count
    INSERT INTO portfolio_feedback_counts (portfolio_id, feedback_chip_id, count)
    VALUES (NEW.portfolio_id, NEW.feedback_chip_id, 1)
    ON CONFLICT (portfolio_id, feedback_chip_id) 
    DO UPDATE SET 
        count = portfolio_feedback_counts.count + 1,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update count
DROP TRIGGER IF EXISTS update_feedback_count_trigger ON portfolio_feedback;
CREATE TRIGGER update_feedback_count_trigger
    AFTER INSERT ON portfolio_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_feedback_count();

-- Enable RLS
ALTER TABLE portfolio_feedback_counts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view portfolio feedback counts"
    ON portfolio_feedback_counts FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert portfolio feedback counts"
    ON portfolio_feedback_counts FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update portfolio feedback counts"
    ON portfolio_feedback_counts FOR UPDATE
    USING (auth.role() = 'authenticated'); 