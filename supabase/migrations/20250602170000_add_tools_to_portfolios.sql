-- Add tools to existing portfolios
INSERT INTO public.portfolio_tools (portfolio_id, tool_id)
SELECT 
    p.id as portfolio_id,
    t.id as tool_id
FROM 
    public.portfolios p,
    public.tools t
WHERE 
    -- Portfolio 1: Web Design Portfolio
    (p.id = 1 AND t.name IN ('Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'VS Code'))
    OR
    -- Portfolio 2: Development Portfolio
    (p.id = 2 AND t.name IN ('React', 'Node.js', 'PostgreSQL', 'Docker', 'GitHub'))
    OR
    -- Portfolio 3: UI/UX Design Portfolio
    (p.id = 3 AND t.name IN ('Figma', 'Sketch', 'Principle', 'Lottie', 'Framer'))
    OR
    -- Portfolio 4: Full Stack Portfolio
    (p.id = 4 AND t.name IN ('Next.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker'))
    OR
    -- Portfolio 5: Creative Design Portfolio
    (p.id = 5 AND t.name IN ('Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro')); 