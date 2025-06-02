-- Add tools to the first 5 portfolios
-- Portfolio 1: Web Design & Development Portfolio
INSERT INTO public.portfolio_tools (portfolio_id, tool_id)
SELECT 1, id FROM public.tools 
WHERE name IN (
    'Figma',
    'VS Code',
    'React',
    'Next.js',
    'Tailwind CSS',
    'TypeScript',
    'Git',
    'GitHub',
    'Vercel',
    'PostgreSQL'
);

-- Portfolio 2: UI/UX Design Portfolio
INSERT INTO public.portfolio_tools (portfolio_id, tool_id)
SELECT 2, id FROM public.tools 
WHERE name IN (
    'Figma',
    'Adobe XD',
    'Sketch',
    'Photoshop',
    'Illustrator',
    'Principle',
    'Lottie',
    'Framer',
    'Notion',
    'Miro'
);

-- Portfolio 3: Full Stack Development Portfolio
INSERT INTO public.portfolio_tools (portfolio_id, tool_id)
SELECT 3, id FROM public.tools 
WHERE name IN (
    'VS Code',
    'React',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'Docker',
    'AWS',
    'Git',
    'GitHub',
    'Jest'
);

-- Portfolio 4: Branding & Graphic Design Portfolio
INSERT INTO public.portfolio_tools (portfolio_id, tool_id)
SELECT 4, id FROM public.tools 
WHERE name IN (
    'Illustrator',
    'Photoshop',
    'InDesign',
    'Figma',
    'Canva',
    'Procreate',
    'Affinity Designer',
    'Notion',
    'Adobe XD',
    'Sketch'
);

-- Portfolio 5: E-commerce Development Portfolio
INSERT INTO public.portfolio_tools (portfolio_id, tool_id)
SELECT 5, id FROM public.tools 
WHERE name IN (
    'VS Code',
    'React',
    'Node.js',
    'PostgreSQL',
    'Docker',
    'AWS',
    'Stripe',
    'Git',
    'GitHub',
    'TypeScript'
); 