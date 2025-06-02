-- Insert tools with their categories and descriptions
INSERT INTO public.tools (name, category, description, is_approved) VALUES
-- No-Code/Low-Code Tools
('Framer', 'No-Code/Low-Code', 'Professional design and prototyping tool with powerful animation capabilities and code export features.', true),
('Webflow', 'No-Code/Low-Code', 'Visual web development platform that lets you build responsive websites without coding.', true),
('Wix', 'No-Code/Low-Code', 'Website builder with drag-and-drop interface and extensive template library.', true),
('Squarespace', 'No-Code/Low-Code', 'All-in-one platform for building websites, online stores, and portfolios.', true),
('WordPress', 'No-Code/Low-Code', 'Open-source content management system powering over 40% of websites.', true),
('Bubble', 'No-Code/Low-Code', 'Visual programming platform for building web applications without code.', true),
('Airtable', 'No-Code/Low-Code', 'Spreadsheet-database hybrid with powerful automation and integration capabilities.', true),
('Zapier', 'No-Code/Low-Code', 'Automation tool that connects your apps and services to create workflows.', true),
('Make', 'No-Code/Low-Code', 'Advanced automation platform (formerly Integromat) for complex workflows.', true),
('Notion', 'No-Code/Low-Code', 'All-in-one workspace for notes, docs, and project management.', true),

-- Design & Prototyping
('Figma', 'Design & Prototyping', 'Collaborative interface design tool with powerful prototyping features.', true),
('Adobe XD', 'Design & Prototyping', 'Vector-based design tool for web and mobile apps with prototyping capabilities.', true),
('Sketch', 'Design & Prototyping', 'Digital design platform for Mac with powerful vector editing and prototyping.', true),
('Photoshop', 'Design & Prototyping', 'Industry-standard image editing and manipulation software.', true),
('Illustrator', 'Design & Prototyping', 'Vector graphics editor for creating illustrations, logos, and designs.', true),
('InDesign', 'Design & Prototyping', 'Professional layout and page design software for print and digital media.', true),
('Canva', 'Design & Prototyping', 'User-friendly graphic design platform with templates and collaboration.', true),
('Affinity Designer', 'Design & Prototyping', 'Professional vector graphics editor with powerful design tools.', true),
('Procreate', 'Design & Prototyping', 'Digital illustration and painting app for iPad.', true),
('Principle', 'Design & Prototyping', 'Animation and interaction design tool for creating interactive prototypes.', true),

-- Development & IDE
('VS Code', 'Development & IDE', 'Lightweight but powerful source code editor with extensive plugin ecosystem.', true),
('Sublime Text', 'Development & IDE', 'Fast and efficient text editor for code, markup, and prose.', true),
('WebStorm', 'Development & IDE', 'JavaScript IDE with advanced coding assistance and debugging.', true),
('Git', 'Development & IDE', 'Distributed version control system for tracking code changes.', true),
('GitHub', 'Development & IDE', 'Platform for hosting and collaborating on code repositories.', true),
('Node.js', 'Development & IDE', 'JavaScript runtime for building scalable network applications.', true),
('npm', 'Development & IDE', 'Package manager for JavaScript and the world''s largest software registry.', true),

-- Frontend Frameworks & Libraries
('React', 'Frontend Frameworks & Libraries', 'JavaScript library for building user interfaces with component-based architecture.', true),
('Vue', 'Frontend Frameworks & Libraries', 'Progressive JavaScript framework for building user interfaces.', true),
('Angular', 'Frontend Frameworks & Libraries', 'Platform for building mobile and desktop web applications.', true),
('Next.js', 'Frontend Frameworks & Libraries', 'React framework for production with server-side rendering and static site generation.', true),
('TypeScript', 'Frontend Frameworks & Libraries', 'Typed superset of JavaScript that compiles to plain JavaScript.', true),
('Tailwind CSS', 'Frontend Frameworks & Libraries', 'Utility-first CSS framework for rapid UI development.', true),

-- Backend & Databases
('PostgreSQL', 'Backend & Databases', 'Advanced open-source relational database with strong data integrity.', true),
('MongoDB', 'Backend & Databases', 'Document-oriented NoSQL database for modern applications.', true),
('Express', 'Backend & Databases', 'Fast, unopinionated web framework for Node.js.', true),
('Django', 'Backend & Databases', 'High-level Python web framework for rapid development.', true),
('Laravel', 'Backend & Databases', 'PHP web framework with elegant syntax and modern features.', true),

-- Cloud & DevOps
('AWS', 'Cloud & DevOps', 'Comprehensive cloud computing platform with extensive service offerings.', true),
('Docker', 'Cloud & DevOps', 'Platform for developing, shipping, and running applications in containers.', true),
('Kubernetes', 'Cloud & DevOps', 'Container orchestration platform for automating deployment and scaling.', true),
('Vercel', 'Cloud & DevOps', 'Cloud platform for static sites and serverless functions.', true),
('Netlify', 'Cloud & DevOps', 'Platform for automating modern web projects.', true),

-- Testing & QA
('Jest', 'Testing & QA', 'JavaScript testing framework with a focus on simplicity.', true),
('Cypress', 'Testing & QA', 'Modern web testing framework for end-to-end testing.', true),
('Playwright', 'Testing & QA', 'End-to-end testing framework for modern web applications.', true),
('Postman', 'Testing & QA', 'API platform for building and testing APIs.', true),

-- Analytics & Monitoring
('Google Analytics', 'Analytics & Monitoring', 'Web analytics service for tracking and reporting website traffic.', true),
('Hotjar', 'Analytics & Monitoring', 'Behavior analytics and user feedback service.', true),
('Sentry', 'Analytics & Monitoring', 'Error tracking and performance monitoring platform.', true),

-- Animation & Motion
('Lottie', 'Animation & Motion', 'Library for rendering After Effects animations in real-time.', true),
('GSAP', 'Animation & Motion', 'Professional-grade animation library for the web.', true),
('Framer Motion', 'Animation & Motion', 'Production-ready motion library for React.', true),
('Three.js', 'Animation & Motion', 'JavaScript 3D library for creating and displaying 3D graphics.', true),

-- Design Systems & UI Libraries
('Storybook', 'Design Systems & UI Libraries', 'Tool for developing UI components in isolation.', true),
('Chakra UI', 'Design Systems & UI Libraries', 'Simple, modular component library for React applications.', true),
('Material UI', 'Design Systems & UI Libraries', 'React component library implementing Google''s Material Design.', true),
('Radix UI', 'Design Systems & UI Libraries', 'Unstyled, accessible components for building high‑quality design systems.', true),

-- Performance & Optimization
('WebPageTest', 'Performance & Optimization', 'Web performance testing and optimization tool.', true),
('Lighthouse', 'Performance & Optimization', 'Automated tool for improving web page quality.', true),
('Webpack', 'Performance & Optimization', 'Module bundler for JavaScript applications.', true),
('Vite', 'Performance & Optimization', 'Next generation frontend tooling for modern web applications.', true); 