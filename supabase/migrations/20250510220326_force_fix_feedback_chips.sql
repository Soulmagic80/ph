-- Force drop the columns
ALTER TABLE feedback_chips 
    DROP COLUMN category,
    DROP COLUMN color,
    DROP COLUMN description,
    DROP COLUMN count; 