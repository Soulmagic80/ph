-- Add tools to existing portfolios
INSERT INTO public.portfolio_tools (portfolio_id, tool_id)
SELECT 
    p.id as portfolio_id,
    t.id as tool_id
FROM 
    public.portfolios p,
    public.tools t
WHERE 
    -- Creative Agency Website
    (p.id = '71f718c7-9241-471c-9228-afb4d031c60b' AND t.name IN ('Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'VS Code'))
    OR
    -- Data Visualization Dashboard
    (p.id = '91aca578-c77f-41d7-85f7-876a440b32f5' AND t.name IN ('React', 'Node.js', 'MongoDB', 'Docker', 'GitHub'))
    OR
    -- Mobile App UI Design
    (p.id = '254e018d-7680-4073-ac68-e252ab9ac92a' AND t.name IN ('Figma', 'Sketch', 'Principle', 'Lottie', 'Framer'))
    OR
    -- Modern Portfolio Design
    (p.id = 'ad0c7231-5547-4871-86c2-e90745169d60' AND t.name IN ('Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel', 'GitHub'))
    OR
    -- Ecommerce Platform
    (p.id = '275d2748-6d4d-49d2-8c11-4a4126867636' AND t.name IN ('React', 'Node.js', 'MongoDB', 'AWS', 'Docker')); 