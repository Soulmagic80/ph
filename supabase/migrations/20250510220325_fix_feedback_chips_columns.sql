-- Drop the problematic columns
ALTER TABLE feedback_chips 
    DROP COLUMN IF EXISTS category,
    DROP COLUMN IF EXISTS color,
    DROP COLUMN IF EXISTS description,
    DROP COLUMN IF EXISTS count;

-- Make sure we have the correct columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'feedback_chips' AND column_name = 'name') THEN
        ALTER TABLE feedback_chips ADD COLUMN name TEXT NOT NULL UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'feedback_chips' AND column_name = 'created_at') THEN
        ALTER TABLE feedback_chips ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'feedback_chips' AND column_name = 'updated_at') THEN
        ALTER TABLE feedback_chips ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$; 