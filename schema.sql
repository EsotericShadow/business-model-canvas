-- Users table (Stack Auth integration)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Canvas table (one per user, current version)
CREATE TABLE business_model_canvas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  key_partners TEXT,
  key_activities TEXT,
  value_propositions TEXT,
  customer_relationships TEXT,
  customer_segments TEXT,
  key_resources TEXT,
  channels TEXT,
  cost_structure TEXT,
  revenue_streams TEXT,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Version history table
CREATE TABLE canvas_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id UUID REFERENCES business_model_canvas(id) ON DELETE CASCADE,
  key_partners TEXT,
  key_activities TEXT,
  value_propositions TEXT,
  customer_relationships TEXT,
  customer_segments TEXT,
  key_resources TEXT,
  channels TEXT,
  cost_structure TEXT,
  revenue_streams TEXT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_canvas_user_id ON business_model_canvas(user_id);
CREATE INDEX idx_canvas_share_token ON business_model_canvas(share_token);
CREATE INDEX idx_versions_canvas_id ON canvas_versions(canvas_id);
CREATE INDEX idx_versions_saved_at ON canvas_versions(saved_at DESC);

-- Base template (demo canvas)
INSERT INTO business_model_canvas (
  user_id, key_partners, key_activities, value_propositions,
  customer_relationships, customer_segments, key_resources,
  channels, cost_structure, revenue_streams, share_token
) VALUES (
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
);