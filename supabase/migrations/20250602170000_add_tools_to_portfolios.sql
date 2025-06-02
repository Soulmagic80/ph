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
    (p.title = 'Web Design Portfolio' AND t.name IN ('Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'VS Code'))
    OR
    -- Portfolio 2: Development Portfolio
    (p.title = 'Development Portfolio' AND t.name IN ('React', 'Node.js', 'PostgreSQL', 'Docker', 'GitHub'))
    OR
    -- Portfolio 3: UI/UX Design Portfolio
    (p.title = 'UI/UX Design Portfolio' AND t.name IN ('Figma', 'Sketch', 'Principle', 'Lottie', 'Framer'))
    OR
    -- Portfolio 4: Full Stack Portfolio
    (p.title = 'Full Stack Portfolio' AND t.name IN ('Next.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker'))
    OR
    -- Portfolio 5: Creative Design Portfolio
    (p.title = 'Creative Design Portfolio' AND t.name IN ('Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro')); 