-- Zylo Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('sender', 'errander', 'both')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create errands table
CREATE TABLE IF NOT EXISTS errands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  errander_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('fuel_energy', 'courier_delivery', 'office_work', 'custom')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  pickup_location JSONB,
  destination_location JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'cancelled')),
  image_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_errands_sender_id ON errands(sender_id);
CREATE INDEX IF NOT EXISTS idx_errands_errander_id ON errands(errander_id);
CREATE INDEX IF NOT EXISTS idx_errands_status ON errands(status);
CREATE INDEX IF NOT EXISTS idx_errands_category ON errands(category);
CREATE INDEX IF NOT EXISTS idx_errands_created_at ON errands(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_errands_updated_at
  BEFORE UPDATE ON errands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE errands ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Errands table policies
CREATE POLICY "Anyone can view all errands"
  ON errands FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Senders can create errands"
  ON errands FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('sender', 'both')
    )
  );

CREATE POLICY "Senders can update their own errands"
  ON errands FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Senders can delete their own errands"
  ON errands FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

CREATE POLICY "Erranders can apply to errands"
  ON errands FOR UPDATE
  TO authenticated
  USING (
    status = 'open' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('errander', 'both')
    )
  )
  WITH CHECK (
    errander_id = auth.uid() AND
    status = 'assigned'
  );

-- Create view for errand statistics (optional but useful)
CREATE OR REPLACE VIEW errand_stats AS
SELECT
  sender_id,
  COUNT(*) as total_errands,
  COUNT(*) FILTER (WHERE status = 'open') as open_errands,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_errands,
  SUM(budget) FILTER (WHERE status = 'completed') as total_spent
FROM errands
GROUP BY sender_id;

-- Grant access to the view
GRANT SELECT ON errand_stats TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Zylo database schema created successfully!';
END $$;
