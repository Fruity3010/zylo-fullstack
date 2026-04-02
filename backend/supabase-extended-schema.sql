-- Zylo Extended Database Schema - Offers, Ratings, Payments, Wallet
-- Run this SQL in your Supabase SQL Editor after running supabase-schema.sql

-- ============================================
-- PART 1: ERRAND OFFERS (NEGOTIATION SYSTEM)
-- ============================================

-- Create errand_offers table for counter-offers
CREATE TABLE IF NOT EXISTS errand_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  errand_id UUID NOT NULL REFERENCES errands(id) ON DELETE CASCADE,
  errander_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offered_price DECIMAL(10, 2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,

  -- Prevent duplicate offers from same errander on same errand
  UNIQUE(errand_id, errander_id)
);

-- Indexes for offers
CREATE INDEX IF NOT EXISTS idx_offers_errand_id ON errand_offers(errand_id);
CREATE INDEX IF NOT EXISTS idx_offers_errander_id ON errand_offers(errander_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON errand_offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON errand_offers(created_at DESC);

-- Updated_at trigger for offers
CREATE TRIGGER update_errand_offers_updated_at
  BEFORE UPDATE ON errand_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PART 2: RATINGS & REVIEWS SYSTEM
-- ============================================

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  errand_id UUID NOT NULL REFERENCES errands(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate ratings for same errand
  UNIQUE(errand_id, rater_id)
);

-- Indexes for ratings
CREATE INDEX IF NOT EXISTS idx_ratings_errand_id ON ratings(errand_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rated_user_id ON ratings(rated_user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at DESC);

-- ============================================
-- PART 3: WALLET & PAYMENT SYSTEM
-- ============================================

-- Create wallets table with full ledger tracking
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  available_balance DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (available_balance >= 0),
  held_balance DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (held_balance >= 0),
  total_earned DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_spent DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table for complete audit trail
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'hold', 'release', 'refund', 'fee', 'earning')),
  amount DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  reference TEXT,
  errand_id UUID REFERENCES errands(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payouts table for withdrawal requests
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  paystack_reference TEXT,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for wallet system
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_errand_id ON transactions(errand_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payouts_user_id ON payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);

-- Updated_at triggers
CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at
  BEFORE UPDATE ON payouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PART 4: DAILY FEES TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS daily_fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  errand_id UUID NOT NULL REFERENCES errands(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  fee_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- One fee entry per errand per day
  UNIQUE(errand_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_fees_errand_id ON daily_fees(errand_id);
CREATE INDEX IF NOT EXISTS idx_daily_fees_date ON daily_fees(date DESC);

-- ============================================
-- PART 5: EXTEND USERS TABLE FOR TIER SYSTEM
-- ============================================

-- Add tier-related columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS completed_errands INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'unverified' CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_documents JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bvn TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nin TEXT;

-- Create tier_history table
CREATE TABLE IF NOT EXISTS tier_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  previous_tier TEXT NOT NULL,
  new_tier TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tier_history_user_id ON tier_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tier_history_created_at ON tier_history(created_at DESC);

-- ============================================
-- PART 6: ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on new tables
ALTER TABLE errand_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier_history ENABLE ROW LEVEL SECURITY;

-- Errand Offers Policies
CREATE POLICY "Users can view offers on their errands"
  ON errand_offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM errands
      WHERE errands.id = errand_offers.errand_id
      AND (errands.sender_id = auth.uid() OR errand_offers.errander_id = auth.uid())
    )
  );

CREATE POLICY "Erranders can create offers"
  ON errand_offers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = errander_id);

CREATE POLICY "Erranders can update their own pending offers"
  ON errand_offers FOR UPDATE
  TO authenticated
  USING (auth.uid() = errander_id AND status = 'pending')
  WITH CHECK (auth.uid() = errander_id);

CREATE POLICY "Senders can accept/reject offers"
  ON errand_offers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM errands
      WHERE errands.id = errand_offers.errand_id
      AND errands.sender_id = auth.uid()
    )
  );

-- Ratings Policies
CREATE POLICY "Users can view all ratings"
  ON ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create ratings for completed errands"
  ON ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = rater_id AND
    EXISTS (
      SELECT 1 FROM errands
      WHERE errands.id = errand_id
      AND errands.status = 'completed'
      AND (errands.sender_id = auth.uid() OR errands.errander_id = auth.uid())
    )
  );

-- Wallet Policies
CREATE POLICY "Users can view their own wallet"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can update wallets"
  ON wallets FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Transaction Policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Payout Policies
CREATE POLICY "Users can view their own payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create payout requests"
  ON payouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Daily Fees Policies
CREATE POLICY "Users can view fees for their errands"
  ON daily_fees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM errands
      WHERE errands.id = daily_fees.errand_id
      AND (errands.sender_id = auth.uid() OR errands.errander_id = auth.uid())
    )
  );

-- Tier History Policies
CREATE POLICY "Users can view their own tier history"
  ON tier_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- PART 7: FUNCTIONS & TRIGGERS
-- ============================================

-- Function to auto-create wallet when user signs up
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create wallet on user creation
DROP TRIGGER IF EXISTS on_user_created_create_wallet ON users;
CREATE TRIGGER on_user_created_create_wallet
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallet();

-- Function to update user rating average
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating DECIMAL(3, 2);
BEGIN
  SELECT ROUND(AVG(rating)::NUMERIC, 2) INTO avg_rating
  FROM ratings
  WHERE rated_user_id = NEW.rated_user_id;

  UPDATE users
  SET average_rating = COALESCE(avg_rating, 0)
  WHERE id = NEW.rated_user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating on new rating
DROP TRIGGER IF EXISTS on_rating_created_update_avg ON ratings;
CREATE TRIGGER on_rating_created_update_avg
  AFTER INSERT ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating();

-- Function to update completed errands count
CREATE OR REPLACE FUNCTION update_completed_errands_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update sender's count
    UPDATE users
    SET completed_errands = completed_errands + 1
    WHERE id = NEW.sender_id;

    -- Update errander's count if assigned
    IF NEW.errander_id IS NOT NULL THEN
      UPDATE users
      SET completed_errands = completed_errands + 1
      WHERE id = NEW.errander_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update completed errands
DROP TRIGGER IF EXISTS on_errand_completed_update_count ON errands;
CREATE TRIGGER on_errand_completed_update_count
  AFTER UPDATE ON errands
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_completed_errands_count();

-- Function for tier promotion automation
CREATE OR REPLACE FUNCTION check_tier_promotion()
RETURNS TRIGGER AS $$
DECLARE
  current_tier TEXT;
  new_tier TEXT;
BEGIN
  SELECT tier INTO current_tier FROM users WHERE id = NEW.id;
  new_tier := current_tier;

  -- Check for Gold promotion (50+ errands, 4.5+ rating)
  IF current_tier = 'silver' AND NEW.completed_errands >= 50 AND NEW.average_rating >= 4.5 THEN
    new_tier := 'gold';
  -- Check for Silver promotion (10+ errands, 4.0+ rating)
  ELSIF current_tier = 'bronze' AND NEW.completed_errands >= 10 AND NEW.average_rating >= 4.0 THEN
    new_tier := 'silver';
  END IF;

  -- If promotion occurred, update tier and log it
  IF new_tier != current_tier THEN
    UPDATE users SET tier = new_tier WHERE id = NEW.id;

    INSERT INTO tier_history (user_id, previous_tier, new_tier, reason)
    VALUES (
      NEW.id,
      current_tier,
      new_tier,
      format('Auto-promoted: %s errands completed, %s avg rating', NEW.completed_errands, NEW.average_rating)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for tier promotion
DROP TRIGGER IF EXISTS on_user_stats_updated_check_promotion ON users;
CREATE TRIGGER on_user_stats_updated_check_promotion
  AFTER UPDATE ON users
  FOR EACH ROW
  WHEN (OLD.completed_errands IS DISTINCT FROM NEW.completed_errands OR OLD.average_rating IS DISTINCT FROM NEW.average_rating)
  EXECUTE FUNCTION check_tier_promotion();

-- Function to withdraw offer when errand is assigned
CREATE OR REPLACE FUNCTION withdraw_pending_offers()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'assigned' AND OLD.status = 'open' THEN
    UPDATE errand_offers
    SET status = 'withdrawn', updated_at = NOW()
    WHERE errand_id = NEW.id AND status = 'pending';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-withdraw offers when errand is assigned
DROP TRIGGER IF EXISTS on_errand_assigned_withdraw_offers ON errands;
CREATE TRIGGER on_errand_assigned_withdraw_offers
  AFTER UPDATE ON errands
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION withdraw_pending_offers();

-- ============================================
-- PART 8: UTILITY VIEWS
-- ============================================

-- View for user statistics with wallet info
CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id,
  u.email,
  u.full_name,
  u.tier,
  u.kyc_status,
  u.completed_errands,
  u.average_rating,
  w.available_balance,
  w.held_balance,
  w.total_earned,
  w.total_spent,
  COUNT(DISTINCT r.id) as total_ratings_received
FROM users u
LEFT JOIN wallets w ON w.user_id = u.id
LEFT JOIN ratings r ON r.rated_user_id = u.id
GROUP BY u.id, w.id;

GRANT SELECT ON user_stats TO authenticated;

-- View for errand offers with user details
CREATE OR REPLACE VIEW errand_offers_detailed AS
SELECT
  eo.*,
  u.full_name as errander_name,
  u.average_rating as errander_rating,
  u.tier as errander_tier,
  e.title as errand_title,
  e.budget as original_budget
FROM errand_offers eo
JOIN users u ON u.id = eo.errander_id
JOIN errands e ON e.id = eo.errand_id;

GRANT SELECT ON errand_offers_detailed TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Zylo extended schema created successfully! Added: offers, ratings, wallets, transactions, payouts, daily_fees, tier_history';
END $$;
