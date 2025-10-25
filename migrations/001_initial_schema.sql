-- Migration 001: Initial schema creation
-- This migration is safe to run in production

-- Users table (Stack Auth integration)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Canvas table (one per user, current version)
CREATE TABLE IF NOT EXISTS business_model_canvas (
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
CREATE TABLE IF NOT EXISTS canvas_versions (
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

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_canvas_user_id ON business_model_canvas(user_id);
CREATE INDEX IF NOT EXISTS idx_canvas_share_token ON business_model_canvas(share_token);
CREATE INDEX IF NOT EXISTS idx_versions_canvas_id ON canvas_versions(canvas_id);
CREATE INDEX IF NOT EXISTS idx_versions_saved_at ON canvas_versions(saved_at DESC);
