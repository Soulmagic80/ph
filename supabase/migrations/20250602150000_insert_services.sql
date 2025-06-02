-- Delete existing services
DELETE FROM public.services;

-- Insert services with their categories and descriptions
INSERT INTO public.services (name, category, description, is_approved) VALUES
-- Design Services
('Web Design', 'Design Services', 'Creating visually appealing and functional websites that meet client needs and user expectations.', true),
('UI Design', 'Design Services', 'Designing user interfaces that are intuitive, accessible, and visually engaging.', true),
('UX Design', 'Design Services', 'Creating meaningful and relevant user experiences through research, testing, and design.', true),
('Logo Design', 'Design Services', 'Creating unique and memorable brand identities through custom logo design.', true),
('Branding', 'Design Services', 'Developing comprehensive brand identities including visual elements, messaging, and guidelines.', true),
('Graphic Design', 'Design Services', 'Creating visual content to communicate messages and ideas effectively.', true),
('Print Design', 'Design Services', 'Designing materials for physical printing including brochures, business cards, and publications.', true),
('Packaging Design', 'Design Services', 'Creating attractive and functional packaging solutions for products.', true),
('Motion Design', 'Design Services', 'Creating animated graphics and visual effects for digital media.', true),
('3D Design', 'Design Services', 'Creating three-dimensional models and visualizations for various applications.', true),
('Illustration', 'Design Services', 'Creating custom illustrations for various media and purposes.', true),
('Icon Design', 'Design Services', 'Designing clear and recognizable icons for digital interfaces.', true),
('Typography Design', 'Design Services', 'Creating and selecting typefaces and text layouts for optimal readability and aesthetics.', true),
('Social Media Design', 'Design Services', 'Creating engaging visual content for social media platforms.', true),
('Infographic Design', 'Design Services', 'Creating visual representations of information and data.', true),

-- Development Services
('Frontend Development', 'Development Services', 'Building user interfaces and client-side functionality for web applications.', true),
('Backend Development', 'Development Services', 'Creating server-side logic and database structures for web applications.', true),
('Full Stack Development', 'Development Services', 'Developing both frontend and backend components of web applications.', true),
('Mobile App Development', 'Development Services', 'Creating native or cross-platform mobile applications.', true),
('WordPress Development', 'Development Services', 'Building and customizing websites using WordPress CMS.', true),
('E-commerce Development', 'Development Services', 'Creating online stores with shopping cart and payment processing.', true),
('Web Application Development', 'Development Services', 'Building complex web-based applications with advanced functionality.', true),
('API Development', 'Development Services', 'Creating and maintaining application programming interfaces.', true),
('Database Development', 'Development Services', 'Designing and implementing database structures and queries.', true),
('CMS Development', 'Development Services', 'Building and customizing content management systems.', true),

-- Marketing & Content
('Content Strategy', 'Marketing & Content', 'Planning and managing content creation and distribution across platforms.', true),
('Social Media Marketing', 'Marketing & Content', 'Managing and growing social media presence and engagement.', true),
('SEO Optimization', 'Marketing & Content', 'Improving website visibility in search engine results.', true),
('Email Marketing', 'Marketing & Content', 'Creating and managing email campaigns for customer engagement.', true),
('Content Writing', 'Marketing & Content', 'Creating engaging and informative content for various platforms.', true),
('Copywriting', 'Marketing & Content', 'Writing persuasive content for marketing and advertising.', true),
('Technical Writing', 'Marketing & Content', 'Creating clear and concise technical documentation.', true),
('Video Production', 'Marketing & Content', 'Producing professional video content for various purposes.', true),
('Photography', 'Marketing & Content', 'Creating high-quality photographic content for various uses.', true),
('Digital Marketing', 'Marketing & Content', 'Managing online marketing campaigns across multiple channels.', true),

-- Business & Consulting
('Business Strategy', 'Business & Consulting', 'Developing strategic plans for business growth and success.', true),
('Product Strategy', 'Business & Consulting', 'Planning and managing product development and lifecycle.', true),
('UX Research', 'Business & Consulting', 'Conducting research to understand user needs and behaviors.', true),
('User Research', 'Business & Consulting', 'Gathering and analyzing user feedback and behavior data.', true),
('Market Analysis', 'Business & Consulting', 'Analyzing market trends and opportunities.', true),
('Business Consulting', 'Business & Consulting', 'Providing expert advice for business improvement.', true),
('Digital Transformation', 'Business & Consulting', 'Helping businesses adapt to digital technologies.', true),
('Project Management', 'Business & Consulting', 'Managing projects from initiation to completion.', true),
('Technical Consulting', 'Business & Consulting', 'Providing expert technical advice and solutions.', true),
('Process Optimization', 'Business & Consulting', 'Improving business processes for efficiency.', true),

-- Specialized Services
('Accessibility Consulting', 'Specialized Services', 'Ensuring digital products are accessible to all users.', true),
('Voice Design', 'Specialized Services', 'Designing voice user interfaces and experiences.', true),
('AR/VR Development', 'Specialized Services', 'Creating augmented and virtual reality experiences.', true),
('AI/ML Development', 'Specialized Services', 'Developing artificial intelligence and machine learning solutions.', true),
('Blockchain Development', 'Specialized Services', 'Creating blockchain-based applications and solutions.', true),
('Data Visualization', 'Specialized Services', 'Creating visual representations of complex data.', true),
('Cloud Architecture', 'Specialized Services', 'Designing and implementing cloud-based solutions.', true),
('DevOps Consulting', 'Specialized Services', 'Improving development and operations processes.', true),
('System Architecture', 'Specialized Services', 'Designing complex software systems and infrastructure.', true),
('Security Auditing', 'Specialized Services', 'Evaluating and improving system security.', true),

-- Creative Services
('Art Direction', 'Creative Services', 'Leading and managing creative projects and teams.', true),
('Creative Direction', 'Creative Services', 'Overseeing creative strategy and execution.', true),
('Visual Identity Design', 'Creative Services', 'Creating comprehensive visual brand identities.', true),
('Character Design', 'Creative Services', 'Creating unique and memorable characters for various media.', true),
('Animation', 'Creative Services', 'Creating animated content for various purposes.', true),
('Video Editing', 'Creative Services', 'Editing and producing professional video content.', true),
('Sound Design', 'Creative Services', 'Creating and editing audio for various media.', true),
('Music Production', 'Creative Services', 'Producing and arranging music for various purposes.', true),
('Voice Over', 'Creative Services', 'Providing professional voice recording services.', true),
('Storyboarding', 'Creative Services', 'Creating visual storyboards for various media.', true),

-- E-commerce & Retail
('E-commerce Strategy', 'E-commerce & Retail', 'Developing strategies for online retail success.', true),
('Online Store Development', 'E-commerce & Retail', 'Building and customizing e-commerce websites.', true),
('Product Photography', 'E-commerce & Retail', 'Creating professional product images for online stores.', true),
('Product Description Writing', 'E-commerce & Retail', 'Writing compelling product descriptions for online stores.', true),
('Inventory Management', 'E-commerce & Retail', 'Managing product inventory and stock levels.', true),
('Payment Gateway Integration', 'E-commerce & Retail', 'Implementing secure payment processing systems.', true),
('Shopping Cart Development', 'E-commerce & Retail', 'Building and customizing e-commerce shopping carts.', true),
('Order Management', 'E-commerce & Retail', 'Managing customer orders and fulfillment.', true),
('Retail Design', 'E-commerce & Retail', 'Designing physical retail spaces and experiences.', true),
('Product Packaging', 'E-commerce & Retail', 'Designing attractive and functional product packaging.', true),

-- Education & Training
('Technical Training', 'Education & Training', 'Providing training in technical skills and tools.', true),
('Design Workshops', 'Education & Training', 'Conducting workshops on design principles and tools.', true),
('Coding Bootcamps', 'Education & Training', 'Teaching programming skills through intensive courses.', true),
('Online Course Creation', 'Education & Training', 'Creating educational content for online learning.', true),
('Tutorial Creation', 'Education & Training', 'Creating step-by-step guides and tutorials.', true),
('Documentation Writing', 'Education & Training', 'Writing clear and comprehensive documentation.', true),
('Knowledge Base Creation', 'Education & Training', 'Building organized repositories of information.', true),
('Educational Content', 'Education & Training', 'Creating engaging educational materials.', true),
('Training Materials', 'Education & Training', 'Developing materials for training programs.', true),
('Workshop Facilitation', 'Education & Training', 'Leading and managing educational workshops.', true); 