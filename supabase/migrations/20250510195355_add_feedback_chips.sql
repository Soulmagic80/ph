-- Create positive feedback chips table
CREATE TABLE IF NOT EXISTS positive_feedback_chips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    chip TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(portfolio_id, chip)
);

-- Create negative feedback chips table
CREATE TABLE IF NOT EXISTS negative_feedback_chips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    chip TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(portfolio_id, chip)
);

-- Add triggers for updated_at
CREATE TRIGGER set_updated_at_positive_chips
    BEFORE UPDATE ON positive_feedback_chips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_negative_chips
    BEFORE UPDATE ON negative_feedback_chips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 