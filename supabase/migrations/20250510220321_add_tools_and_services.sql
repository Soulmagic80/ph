-- Insert initial tools with more realistic data
INSERT INTO tools (name, description, category, icon_url) VALUES
    ('React', 'A JavaScript library for building user interfaces', 'Frontend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
    ('Next.js', 'React framework for production', 'Frontend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg'),
    ('TypeScript', 'Typed superset of JavaScript', 'Language', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'),
    ('Tailwind CSS', 'Utility-first CSS framework', 'Frontend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg'),
    ('Node.js', 'JavaScript runtime for server-side development', 'Backend', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'),
    ('PostgreSQL', 'Advanced open source database', 'Database', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'),
    ('Docker', 'Container platform', 'DevOps', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'),
    ('Figma', 'Collaborative interface design tool', 'Design', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg'),
    ('Git', 'Distributed version control system', 'DevOps', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'),
    ('AWS', 'Cloud computing platform', 'Cloud', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg')
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    icon_url = EXCLUDED.icon_url;

-- Insert initial services with more realistic data
INSERT INTO services (name, description, category) VALUES
    ('Web Development', 'Custom website development with modern technologies', 'Development'),
    ('UI/UX Design', 'User interface and experience design for web and mobile', 'Design'),
    ('Mobile App Development', 'Native and cross-platform mobile application development', 'Development'),
    ('E-commerce Solutions', 'Custom e-commerce platform development', 'Development'),
    ('Technical Consulting', 'Expert advice on technology stack and architecture', 'Consulting'),
    ('Performance Optimization', 'Website and application performance improvement', 'Optimization'),
    ('SEO Services', 'Search engine optimization and digital marketing', 'Marketing'),
    ('Content Creation', 'Professional content writing and strategy', 'Content'),
    ('Cloud Migration', 'Moving applications to cloud infrastructure', 'Cloud'),
    ('Maintenance & Support', 'Ongoing technical support and maintenance', 'Support')
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    category = EXCLUDED.category;

-- Link tools to portfolios
INSERT INTO portfolio_tools (portfolio_id, tool_id)
SELECT 
    p.id,
    t.id
FROM portfolios p
CROSS JOIN tools t
WHERE p.id IN (SELECT id FROM portfolios LIMIT 5)  -- Link to first 5 portfolios
AND t.name IN ('React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js')  -- Link specific tools
ON CONFLICT (portfolio_id, tool_id) DO NOTHING;

-- Link services to portfolios
INSERT INTO portfolio_services (portfolio_id, service_id)
SELECT 
    p.id,
    s.id
FROM portfolios p
CROSS JOIN services s
WHERE p.id IN (SELECT id FROM portfolios LIMIT 5)  -- Link to first 5 portfolios
AND s.name IN ('Web Development', 'UI/UX Design', 'Technical Consulting')  -- Link specific services
ON CONFLICT (portfolio_id, service_id) DO NOTHING; 