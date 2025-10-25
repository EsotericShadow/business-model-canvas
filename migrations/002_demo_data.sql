-- Migration 002: Demo data insertion
-- This migration adds demo data only if no canvases exist

-- Insert demo canvas ONLY if no canvases exist
INSERT INTO business_model_canvas (
  user_id, key_partners, key_activities, value_propositions,
  customer_relationships, customer_segments, key_resources,
  channels, cost_structure, revenue_streams, share_token
) 
SELECT 
  NULL, -- Public demo
  'HostPapa
OpenAI
Vercel
Cursor
My consultant
Accountant / Bookkeeper
Chamber of Commerce
Event venues
Wave',
  'Discovery:
• Understand business
• Paper / online processes
• Bottlenecks
• Assets
• Define scope

Establish clear expectations:
• What are we building?
• Why are we building it?
• Who are we building it for?
• Where are we building it? (Domain, host)',
  'Evergreen Web Solutions exists to move the North forward.

We build real tools — not trends — that help local businesses work smarter, grow faster, and stay independent in a world that''s getting automated, whether we like it or not.

We believe technology should serve people, not replace them.
Our mission is to bridge that gap — bringing small-town grit and modern systems together so the next generation of Northern businesses can compete on a global level without losing what makes them real.

We see a North where every business feels at home in the digital world — confident in their systems, clear on their direction, and proud of what they''ve built.

We help Northern businesses run smarter — from websites, apps, to automation and AI.
Everything we build is meant to save time, cut confusion, and keep your systems working the way they should.',
  'Personalized consultation and long-term partnership model

Continuous support through automation monitoring and optimization

Educational approach — guiding clients through digital maturity

Relationship built on trust, transparency, and measurable progress',
  '🐇 RABBITS - Small/New Businesses
• 1-20 employees, $100K-$500K revenue
• Pain: No web presence, options unclear
• Gain: Clear digital strategy, saves time

🦌 DEER - Growing SMBs
• 20-100 employees, $500K-$5M revenue
• Pain: No digital direction, inefficient processes
• Gain: More productive, efficient, profitable

🐘 ELEPHANTS - Large Organizations
• 100+ employees, $5M+ revenue
• Pain: Pressure to adopt, messy systems
• Gain: Stakeholder peace of mind, 40% more productive',
  'Fixed Costs:
Monthly:
• Vercel
• Cursor
• XAI ChatGPT
• Canva (~$250/month)

Yearly:
• Domain ($25)
• Chamber membership
• Insurance

Other Resources:
• Address
• Business cards
• Filing cabinet
• Desk
• Socials / Website
• Laptop / Desktop
• 30-second pitch
• Vehicle
• Phone
• Insurance
• Google Reviews
• Bank account
• Business license',
  'Facebook / LinkedIn
Print media (newspaper)
Chamber of Commerce
Word of mouth
Community organizations',
  'Fixed Costs (Monthly):
• Vercel, Cursor, Canva: ~$250/month
• XAI chatbot: Monthly subscription
• Domain: Yearly renewal
• Chamber membership: Annual fee
• Insurance: Annual premium

Variable Costs:
• Project expenses: Development time, third-party services
• Event costs: Venue rental, catering, marketing
• Travel: Client meetings, conferences, networking
• Materials: Business cards, marketing materials',
  'Service hourly rate – $95
Consultation rate – $250
Base website – $1,000
Support package – $50/month
Collecting payment: Wave, accounting, crypto/cash',
  'demo-canvas'
WHERE NOT EXISTS (SELECT 1 FROM business_model_canvas WHERE share_token = 'demo-canvas');
