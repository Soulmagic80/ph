-- Add slug column to portfolios table
ALTER TABLE portfolios ADD COLUMN slug TEXT UNIQUE;

-- Create index for slug
CREATE INDEX idx_portfolios_slug ON portfolios(slug);

-- Update existing records with slugs based on title
UPDATE portfolios
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Make slug column NOT NULL after updating existing records
ALTER TABLE portfolios ALTER COLUMN slug SET NOT NULL;

