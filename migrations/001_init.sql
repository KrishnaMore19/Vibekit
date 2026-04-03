-- VibeKit Studio - Initial Schema Migration
-- Run this against your PostgreSQL database before deploying

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Page',
  slug TEXT UNIQUE NOT NULL,
  theme TEXT NOT NULL DEFAULT 'minimal',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  content JSONB NOT NULL DEFAULT '{
    "hero": {
      "title": "Welcome to My Page",
      "subtitle": "A beautiful page built with VibeKit Studio",
      "buttonText": "Get Started",
      "buttonUrl": "#contact"
    },
    "features": [
      {"title": "Feature One", "description": "Describe your first amazing feature here."},
      {"title": "Feature Two", "description": "Describe your second amazing feature here."},
      {"title": "Feature Three", "description": "Describe your third amazing feature here."}
    ],
    "gallery": [
      {"url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", "alt": "Gallery image 1"},
      {"url": "https://images.unsplash.com/photo-1615414050946-39b55a7f86ea?w=800&q=80", "alt": "Gallery image 2"},
      {"url": "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&q=80", "alt": "Gallery image 3"}
    ],
    "contact": {
      "title": "Get In Touch",
      "subtitle": "Have a question? We would love to hear from you."
    },
    "sectionOrder": ["hero", "features", "gallery", "contact"]
  }',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pages_user_id ON pages(user_id);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  page_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_page_id ON contact_submissions(page_id);

-- Auto-update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
