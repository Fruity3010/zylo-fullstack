# Backend Implementation Backlog

**Date Created**: February 27, 2026
**Purpose**: Production-ready backend features for Zylo auto-expiry and anti-ghosting system
**Priority**: HIGH (Core to Ibadan launch strategy)

---

## Overview

This document tracks backend features needed to support the 10-minute auto-expiry errand flow and anti-ghosting system designed specifically for the Ibadan market.

**Problem We're Solving**:
- Competitor allows errands to sit for weeks → stale marketplace
- Erranders counter-offer but ghost when sender accepts → poor UX
- No urgency in system → slow matching times

**Our Solution**:
- 10-minute active window for errands
- Auto-assign on acceptance (no ghosting)
- Tier-based browse access (reward high performers)
- Auto-expire with sender notification

---

## 1. Database Schema Changes

### Priority: 🚨 CRITICAL

### 1.1 Update `errands` Table

```sql
-- Add expiry tracking columns
ALTER TABLE errands ADD COLUMN expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '10 minutes');
ALTER TABLE errands ADD COLUMN reposted_count INTEGER DEFAULT 0;
ALTER TABLE errands ADD COLUMN no_response_notification_sent BOOLEAN DEFAULT false;
ALTER TABLE errands ADD COLUMN auto_expired BOOLEAN DEFAULT false;
ALTER TABLE errands ADD COLUMN extended_once BOOLEAN DEFAULT false;

-- Add index for expiry queries
CREATE INDEX idx_errands_expires_at ON errands(expires_at) WHERE status = 'open';
CREATE INDEX idx_errands_auto_expire ON errands(expires_at, status) WHERE auto_expired = false;
```

**Why**:
- `expires_at`: Track when errand should auto-cancel (default 10 mins from creation)
- `reposted_count`: Track how many times sender increased price/extended
- `no_response_notification_sent`: Prevent duplicate "no responses yet" notifications
- `auto_expired`: Distinguish between manual cancellation and auto-expiry
- `extended_once`: Limit sender to ONE extension (max 20 min total)

---

### 1.2 Create `errand_offers` Table

```sql
CREATE TABLE errand_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relationships
  errand_id UUID NOT NULL REFERENCES errands(id) ON DELETE CASCADE,
  errander_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Offer details
  offer_type TEXT NOT NULL CHECK (offer_type IN ('accept', 'counter')),
  original_workmanship DECIMAL(10,2) NOT NULL,
  counter_workmanship DECIMAL(10,2), -- NULL if offer_type = 'accept'
  message TEXT, -- Optional reason for counter offer

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 minutes'), -- Offer expires in 30 mins
  accepted_at TIMESTAMPTZ,

  -- Ensure one offer per errander per errand
  UNIQUE(errand_id, errander_id)
);

-- Indexes
CREATE INDEX idx_offers_errand ON errand_offers(errand_id, status);
CREATE INDEX idx_offers_errander ON errand_offers(errander_id, status);
CREATE INDEX idx_offers_pending ON errand_offers(status) WHERE status = 'pending';
```

**Why**:
- Track all accept/counter offers from erranders
- `offer_type`: 'accept' = accepts original price, 'counter' = proposes new price
- `expires_at`: Counter offers expire after 30 mins (keeps marketplace fresh)
- Unique constraint: Errander can only make ONE offer per errand

---

### 1.3 Update `users` Table (Tier System)

```sql
-- Add tier tracking (if not already present)
ALTER TABLE users ADD COLUMN tier INTEGER DEFAULT 1 CHECK (tier BETWEEN 1 AND 4);
ALTER TABLE users ADD COLUMN errands_completed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN ghost_count INTEGER DEFAULT 0; -- Track ghosting incidents
ALTER TABLE users ADD COLUMN suspended_until TIMESTAMPTZ; -- Temporary suspensions

-- Index for tier queries
CREATE INDEX idx_users_tier ON users(tier);
```

**Why**:
- `tier`: User's trust level (1 = Starter, 2 = Trusted, 3 = Verified, 4 = Elite)
- `ghost_count`: Track how many times errander ghosted after assignment
- `suspended_until`: Temporary suspension for repeat offenders

---

## 2. API Endpoints

### Priority: 🚨 CRITICAL

### 2.1 Errand Expiry Management

#### `POST /errands/:id/extend`
**Purpose**: Extend errand by 10 more minutes (max 1 extension)

**Auth**: Required (sender only)

**Request Body**:
```json
{
  "reason": "Still waiting for better offers"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Errand extended by 10 minutes",
  "data": {
    "new_expires_at": "2026-02-27T14:30:00Z",
    "extensions_remaining": 0
  }
}
```

**Business Logic**:
- Only allow ONE extension per errand (`extended_once = false`)
- Update `expires_at` to `NOW() + 10 minutes`
- Set `extended_once = true`
- Return error if already extended

---

#### `POST /errands/:id/increase-price`
**Purpose**: Update workmanship and re-broadcast to erranders

**Auth**: Required (sender only)

**Request Body**:
```json
{
  "new_workmanship": 3000,
  "reason": "No responses, increasing price"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Workmanship increased and errand re-broadcasted",
  "data": {
    "old_workmanship": 2000,
    "new_workmanship": 3000,
    "expires_at": "2026-02-27T14:40:00Z",
    "reposted_count": 1
  }
}
```

**Business Logic**:
- Validate `new_workmanship > old_workmanship`
- Update errand workmanship
- Reset `expires_at` to `NOW() + 10 minutes` (fresh timer)
- Increment `reposted_count`
- Re-broadcast to nearby erranders via push notification

---

#### `POST /errands/:id/mark-urgent`
**Purpose**: Add urgent flag, charge ₦500 fee, re-broadcast

**Auth**: Required (sender only)

**Request Body**:
```json
{
  "urgency": "urgent"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Errand marked as urgent and re-broadcasted",
  "data": {
    "urgency_fee": 500,
    "new_total": 13740,
    "expires_at": "2026-02-27T14:40:00Z"
  }
}
```

**Business Logic**:
- Add ₦500 urgency fee to total
- Charge sender's wallet/card
- Set `urgency = 'urgent'`
- Reset `expires_at` to `NOW() + 10 minutes`
- Re-broadcast with urgent badge

---

### 2.2 Offer Management

#### `POST /errands/:id/offers`
**Purpose**: Errander submits accept or counter offer

**Auth**: Required (errander only)

**Request Body** (Accept):
```json
{
  "offer_type": "accept"
}
```

**Request Body** (Counter):
```json
{
  "offer_type": "counter",
  "counter_workmanship": 2500,
  "message": "Heavy traffic at Ring Road"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Offer submitted successfully",
  "data": {
    "offer_id": "uuid",
    "status": "pending",
    "expires_at": "2026-02-27T15:00:00Z"
  }
}
```

**Business Logic**:
- Check if errander already submitted offer (UNIQUE constraint)
- Validate `counter_workmanship` if offer_type = 'counter'
- Create offer record
- Send real-time notification to sender
- Set offer to expire in 30 minutes

---

#### `POST /offers/:id/accept`
**Purpose**: Sender accepts an offer and AUTO-ASSIGNS errander

**Auth**: Required (sender only)

**Request Body**: None

**Response**:
```json
{
  "success": true,
  "message": "Offer accepted. Errander has been assigned.",
  "data": {
    "errand": {
      "id": "uuid",
      "status": "assigned",
      "errander_id": "uuid",
      "assigned_at": "2026-02-27T14:25:00Z"
    },
    "errander": {
      "full_name": "John Okoye",
      "phone": "+234...",
      "tier": 2
    }
  }
}
```

**Business Logic**:
- Validate offer belongs to this errand
- **AUTO-ASSIGN** errander immediately (update `errand.errander_id`)
- Update `errand.status = 'assigned'`
- Update `errand.assigned_at = NOW()`
- Update `offer.status = 'accepted'`
- Expire all other pending offers for this errand
- Send push notification to errander: "You've been assigned! Start now."
- **Start 5-min ghosting timer** (background job checks if errander starts)

---

### 2.3 Browse Errands (Tier 3-4 Only)

#### `GET /errands/browse`
**Purpose**: Browse all open errands (Tier 3-4 exclusive feature)

**Auth**: Required (Tier 3-4 only)

**Query Params**:
- `category` (optional)
- `max_distance` (default: 10km)
- `min_workmanship` (optional)
- `max_workmanship` (optional)
- `urgency` (optional: 'normal' | 'urgent')

**Response**:
```json
{
  "success": true,
  "data": {
    "errands": [
      {
        "id": "uuid",
        "title": "Buy fuel at Shell",
        "category": "fuel_energy",
        "workmanship": 2000,
        "distance_km": 3.2,
        "expires_at": "2026-02-27T14:35:00Z",
        "time_remaining_seconds": 420,
        "urgency": "normal",
        "sender": { "name": "John Doe", "tier": 2, "rating": 4.5 }
      }
    ],
    "total": 12,
    "tier_required": 3,
    "user_tier": 3
  }
}
```

**Business Logic**:
- Check `user.tier >= 3`, otherwise return 403
- Filter errands where `status = 'open'` AND `expires_at > NOW()`
- Calculate `distance_km` from user's location to pickup
- Filter by `max_distance` (default 10km)
- Return with `time_remaining_seconds` for countdown timer
- Order by `created_at DESC` (newest first)

---

## 3. Background Jobs (Cron / Workers)

### Priority: 🚨 CRITICAL

### 3.1 Auto-Expiry Checker

**Frequency**: Every 1 minute

**Purpose**: Auto-cancel errands that expired with no offers

**Logic**:
```typescript
async function checkExpiredErrands() {
  // Find errands that expired in last 1 minute
  const expiredErrands = await supabase
    .from('errands')
    .select('*')
    .eq('status', 'open')
    .eq('auto_expired', false)
    .lte('expires_at', new Date().toISOString())
    .gte('expires_at', new Date(Date.now() - 60000).toISOString()); // Last 1 min

  for (const errand of expiredErrands) {
    // Count offers received
    const { count } = await supabase
      .from('errand_offers')
      .select('*', { count: 'exact', head: true })
      .eq('errand_id', errand.id);

    if (count === 0) {
      // No offers received → Auto-cancel and refund
      await cancelErrand(errand.id, 'auto_expired_no_offers');
      await refundSender(errand.sender_id, errand.total_cost);

      // Send notification to sender
      await sendPushNotification(errand.sender_id, {
        title: 'Errand Expired',
        body: 'No erranders responded. You have been refunded.',
        data: { errand_id: errand.id, type: 'auto_expired' }
      });

      // Update errand
      await supabase
        .from('errands')
        .update({
          status: 'cancelled',
          auto_expired: true
        })
        .eq('id', errand.id);
    }
  }
}
```

---

### 3.2 No-Response Warning (8-Min Mark)

**Frequency**: Every 30 seconds

**Purpose**: Notify sender at 8-min mark if no offers received

**Logic**:
```typescript
async function checkNoResponseErrands() {
  const now = new Date();
  const eightMinsFromNow = new Date(now.getTime() + 2 * 60000); // 2 mins until expiry

  // Find errands that will expire in 2 mins and have no offers
  const aboutToExpire = await supabase
    .from('errands')
    .select('*')
    .eq('status', 'open')
    .eq('no_response_notification_sent', false)
    .lte('expires_at', eightMinsFromNow.toISOString())
    .gte('expires_at', now.toISOString());

  for (const errand of aboutToExpire) {
    const { count } = await supabase
      .from('errand_offers')
      .select('*', { count: 'exact', head: true })
      .eq('errand_id', errand.id);

    if (count === 0) {
      // Send "no responses yet" notification
      await sendPushNotification(errand.sender_id, {
        title: 'No Responses Yet',
        body: 'Your errand expires in 2 minutes. Consider increasing price?',
        data: {
          errand_id: errand.id,
          type: 'no_response_warning',
          suggested_price: errand.workmanship * 1.3
        }
      });

      // Mark notification as sent
      await supabase
        .from('errands')
        .update({ no_response_notification_sent: true })
        .eq('id', errand.id);
    }
  }
}
```

---

### 3.3 Ghosting Penalty Checker

**Frequency**: Every 30 seconds

**Purpose**: Penalize erranders who get assigned but don't start

**Logic**:
```typescript
async function checkGhostingErranders() {
  const fiveMinsAgo = new Date(Date.now() - 5 * 60000);

  // Find errands assigned >5 mins ago still in 'assigned' status
  const ghostedErrands = await supabase
    .from('errands')
    .select('*, errander:users!errander_id(*)')
    .eq('status', 'assigned')
    .lte('assigned_at', fiveMinsAgo.toISOString());

  for (const errand of ghostedErrands) {
    // Increment ghost count
    await supabase
      .from('users')
      .update({
        ghost_count: errand.errander.ghost_count + 1,
        average_rating: Math.max(0, errand.errander.average_rating - 0.1)
      })
      .eq('id', errand.errander_id);

    // Check for suspension
    if (errand.errander.ghost_count + 1 >= 3) {
      // Suspend for 24 hours
      await supabase
        .from('users')
        .update({
          suspended_until: new Date(Date.now() + 24 * 3600000).toISOString()
        })
        .eq('id', errand.errander_id);

      await sendPushNotification(errand.errander_id, {
        title: 'Account Suspended',
        body: 'You have been suspended for 24 hours due to repeated no-shows.',
        data: { type: 'suspension', reason: 'ghosting' }
      });
    }

    // Cancel errand and refund sender
    await cancelErrand(errand.id, 'errander_ghosted');
    await refundSender(errand.sender_id, errand.total_cost);

    // Notify sender
    await sendPushNotification(errand.sender_id, {
      title: 'Errander Did Not Start',
      body: 'Your errand has been cancelled and you have been refunded.',
      data: { errand_id: errand.id, type: 'errander_ghosted' }
    });
  }
}
```

---

## 4. Notification System

### Priority: ⚠️ IMPORTANT

### 4.1 Push Notification Types

```typescript
type NotificationType =
  | 'new_errand'              // Broadcast to nearby erranders
  | 'new_offer'               // Sender receives offer
  | 'offer_accepted'          // Errander's offer accepted → AUTO-ASSIGNED
  | 'errand_assigned'         // Confirmation to both parties
  | 'no_response_warning'     // Sender: "No responses in 8 mins"
  | 'auto_expired'            // Sender: "Errand auto-cancelled, refunded"
  | 'price_increased'         // Broadcast to erranders (sender increased price)
  | 'marked_urgent'           // Broadcast to erranders (now urgent)
  | 'errander_ghosted'        // Sender: "Errander didn't start, refunded"
  | 'suspension'              // Errander: "You've been suspended"
  | 'errand_started'          // Sender: "Errander started your errand"
  | 'errand_completed';       // Both: "Errand completed"
```

---

### 4.2 Tier-Based Broadcasting

```typescript
async function broadcastErrandToErranders(errand) {
  // Get all erranders within 10km
  const nearbyErranders = await supabase
    .from('users')
    .select('*')
    .eq('role', 'errander')
    .eq('is_online', true)
    // ... geolocation filter for 10km radius

  for (const errander of nearbyErranders) {
    // Check if suspended
    if (errander.suspended_until && new Date(errander.suspended_until) > new Date()) {
      continue; // Skip suspended users
    }

    // Send push notification (ALL tiers get this)
    await sendPushNotification(errander.id, {
      title: `New Errand - ${errand.category}`,
      body: `₦${errand.workmanship} • ${distance}km away`,
      priority: errand.urgency === 'urgent' ? 'high' : 'normal',
      data: {
        errand_id: errand.id,
        type: 'new_errand',
        workmanship: errand.workmanship,
        urgency: errand.urgency
      }
    });

    // Tier 3-4 also see it in browse tab automatically (via DB realtime)
  }
}
```

---

## 5. Wallet & Payment Integration

### Priority: ⚠️ IMPORTANT

### 5.1 Escrow Hold on Offer Acceptance

**When**: Sender accepts an offer

**Flow**:
1. Get sender's wallet balance
2. Hold `errand.total_cost` in escrow
3. Assign errander
4. If errander completes → release to errander
5. If errander ghosts → refund sender

**Implementation**:
```typescript
async function holdFundsOnAssignment(errandId, senderId, amount) {
  // Check wallet balance
  const balance = await getWalletBalance(senderId);
  if (balance < amount) {
    throw new Error('Insufficient funds in wallet');
  }

  // Hold funds in escrow
  await supabase
    .from('wallet_transactions')
    .insert({
      user_id: senderId,
      type: 'hold',
      amount: -amount,
      reference: `ESCROW_${errandId}`,
      status: 'held',
      description: `Escrow hold for errand ${errandId}`
    });

  // Update wallet balance
  await supabase
    .from('wallets')
    .update({
      held_balance: supabase.raw('held_balance + ?', [amount]),
      available_balance: supabase.raw('available_balance - ?', [amount])
    })
    .eq('user_id', senderId);
}
```

---

## 6. Testing Checklist

### Critical Path Tests

- [ ] **Errand Creation**: `expires_at` set to 10 mins from creation
- [ ] **No Offers by 8 mins**: Sender receives "no response" notification
- [ ] **No Offers by 10 mins**: Errand auto-cancels, sender refunded
- [ ] **Offer Acceptance**: Errander immediately assigned (status = 'assigned')
- [ ] **Ghosting Detection**: Errander doesn't start in 5 mins → penalty applied
- [ ] **Tier Access**: Tier 1-2 cannot access `/errands/browse`
- [ ] **Tier Access**: Tier 3-4 can browse all open errands
- [ ] **Extension**: Sender can extend once (max 20 min total)
- [ ] **Price Increase**: Workmanship update re-broadcasts errand
- [ ] **Urgent Flag**: Marking urgent charges ₦500 and re-broadcasts

---

## 7. Deployment Priority

### Phase 1: MVP (Week 1)
- Database schema updates
- Basic auto-expiry (no background jobs yet)
- Offer submission and acceptance
- Manual expiry check (admin can trigger)

### Phase 2: Automation (Week 2)
- Background jobs for auto-expiry
- No-response warnings
- Ghosting penalty system

### Phase 3: Advanced (Week 3)
- Tier-based browse access
- Wallet escrow integration
- Urgent marking with fees

---

## 8. Monitoring & Metrics

### KPIs to Track

- **Average Match Time**: Time from posting to assignment
  - Target: < 5 minutes

- **Auto-Expiry Rate**: % of errands that auto-expire
  - Target: < 5% (means pricing is good)

- **Ghosting Rate**: % of assigned errands where errander ghosts
  - Target: < 2%

- **Tier 3-4 Browse Usage**: % of T3-4 users who use browse tab
  - Target: > 80%

- **Price Increase Success**: % of "no response" errands that match after price increase
  - Target: > 60%

---

## 9. Security Considerations

### Rate Limiting
- Sender can only post 5 errands per hour (prevent spam)
- Errander can only counter-offer 20 times per hour

### Fraud Prevention
- Track IP addresses for duplicate accounts
- Flag users who repeatedly auto-cancel errands
- Require KYC before Tier 3 (browse access)

---

## 10. Future Enhancements (Post-Launch)

- [ ] Smart pricing suggestions based on historical data
- [ ] Predictive expiry (AI suggests if errand will match)
- [ ] Automatic price adjustment (platform suggests optimal price)
- [ ] Recurring errands (weekly fuel purchase, etc.)
- [ ] Errand bundling (multiple errands → one trip)

---

**Last Updated**: February 27, 2026
**Status**: BACKLOG (Frontend implemented with dummy data)
**Next Action**: Begin Phase 1 development after frontend validation
