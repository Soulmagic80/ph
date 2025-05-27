-- First, clear the existing tables
TRUNCATE TABLE portfolio_rating_counts CASCADE;
TRUNCATE TABLE portfolio_rating CASCADE;
TRUNCATE TABLE feedback_chips CASCADE;

-- Drop the existing tables
DROP TABLE IF EXISTS portfolio_rating_counts CASCADE;
DROP TABLE IF EXISTS portfolio_rating CASCADE;
DROP TABLE IF EXISTS feedback_chips CASCADE;

-- Create the new feedback_chips table with updated structure
CREATE TABLE feedback_chips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('positive', 'negative')),
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    short_description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the new feedback chips
INSERT INTO feedback_chips (type, category, name, short_description, icon_name) VALUES
-- Positive Feedback Chips
('positive', 'Visual Design', 'Clear Font Choice', 'Fonts are easy to read and match the design well.', 'TextAa'),
('positive', 'Visual Design', 'Appealing Colors', 'Colors are attractive and create a strong look.', 'Palette'),
('positive', 'Usability', 'Simple Navigation', 'Finding projects is easy and feels natural.', 'Compass'),
('positive', 'Usability', 'Organized Layout', 'The layout is clean and makes content easy to follow.', 'GridFour'),
('positive', 'Content', 'Engaging Project Stories', 'Project descriptions are interesting and clear.', 'BookOpen'),
('positive', 'Content', 'Strong Case Studies', 'Case studies show the design process and results well.', 'FileText'),
('positive', 'Performance', 'Fast Page Loading', 'Pages load quickly, making the portfolio smooth to use.', 'Rocket'),
('positive', 'Performance', 'Great Mobile Design', 'The portfolio looks and works great on mobile devices.', 'DeviceMobile'),
('positive', 'Personality', 'Unique Design Style', 'The portfolio has a fresh and original look.', 'Sparkle'),
('positive', 'Professionalism', 'Polished Presentation', 'The portfolio feels professional and well-designed.', 'CheckCircle'),

-- Negative Feedback Chips
('negative', 'Visual Design', 'Font Choice', 'Fonts could be clearer or match the design better.', 'TextAa'),
('negative', 'Visual Design', 'Color Design', 'Colors could be more appealing or better matched.', 'Palette'),
('negative', 'Visual Design', 'Image Quality', 'Images could be sharper or more relevant to projects.', 'Image'),
('negative', 'Usability', 'Navigation', 'Navigation could be simpler or easier to use.', 'Compass'),
('negative', 'Usability', 'Layout Clarity', 'Layout feels busy; a simpler design could help.', 'GridFour'),
('negative', 'Content', 'Project Stories', 'Project descriptions could be more engaging or clear.', 'BookOpen'),
('negative', 'Content', 'Case Study Detail', 'Case studies need more detail or clearer structure.', 'FileText'),
('negative', 'Performance', 'Page Loading', 'Pages load slowly; faster loading could help.', 'Rocket'),
('negative', 'Performance', 'Mobile Design', 'Mobile view could be easier to use or look better.', 'DeviceMobile'),
('negative', 'Professionalism', 'Presentation', 'Portfolio could look more polished or professional.', 'CheckCircle');

-- Create an index on type and category for faster queries
CREATE INDEX idx_feedback_chips_type_category ON feedback_chips(type, category);

-- Recreate the portfolio_rating table
CREATE TABLE portfolio_rating (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    feedback_chip_id UUID NOT NULL REFERENCES feedback_chips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating_type TEXT NOT NULL CHECK (rating_type IN ('positive', 'negative')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(portfolio_id, feedback_chip_id, user_id)
);

-- Recreate the portfolio_rating_counts table
CREATE TABLE portfolio_rating_counts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    feedback_chip_id UUID NOT NULL REFERENCES feedback_chips(id) ON DELETE CASCADE,
    count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(portfolio_id, feedback_chip_id)
); 