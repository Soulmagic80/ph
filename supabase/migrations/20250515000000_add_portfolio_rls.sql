-- Enable RLS on portfolios table
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create policy for updating upvotes
CREATE POLICY "Enable upvotes for authenticated users"
ON portfolios
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for reading portfolios
CREATE POLICY "Enable read access for all users"
ON portfolios
FOR SELECT
USING (true);

-- Create policy for inserting portfolios
CREATE POLICY "Enable insert for authenticated users"
ON portfolios
FOR INSERT
WITH CHECK (auth.role() = 'authenticated'); 