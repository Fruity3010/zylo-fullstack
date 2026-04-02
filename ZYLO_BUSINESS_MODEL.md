# Zylo Mobile App - Business Model & Strategy
## Indrive-Style Errand Marketplace for Ibadan

**Date**: February 13, 2026
**Co-Founders Strategy Document**
**Market**: Ibadan, Nigeria (Launch City)
**Model**: Negotiated Errand Marketplace (Like Indrive)

---

## Table of Contents
1. [Business Model Overview](#business-model-overview)
2. [How Zylo Works (User Flow)](#how-zylo-works-user-flow)
3. [Revenue Model](#revenue-model)
4. [Tier-Based System](#tier-based-system)
5. [Competitive Analysis](#competitive-analysis)
6. [Pricing Examples](#pricing-examples)
7. [Technical Requirements](#technical-requirements)
8. [Go-to-Market Strategy](#go-to-market-strategy)
9. [Financial Projections](#financial-projections)

---

## Business Model Overview

### Core Concept
**"Indrive for Errands"** - A negotiation-based marketplace where senders and erranders agree on fair prices for errand tasks.

### Key Principles
1. **Transparent Negotiation** - No hidden fees, both parties see everything
2. **Sender Pays Fees** - Platform fees paid by sender, not errander
3. **Errander Earns Through Negotiation** - Good negotiators earn more
4. **Progressive Trust System** - Complete errands → climb tiers → unlock bigger opportunities

### Why This Model Works
✅ **Fair for Erranders** - They negotiate their own rates (not platform-set)
✅ **Fair for Senders** - They pay what they're willing to pay
✅ **Platform Neutrality** - We don't set prices, users do
✅ **Market-Driven Pricing** - Supply/demand determines rates naturally
✅ **Attractive to Erranders** - No commission taken from their earnings (unlike Uber/Bolt)

---

## How Zylo Works (User Flow)

### Step-by-Step Errand Flow

#### **1. Sender Posts Errand**

**Example: Buy Fuel**

Sender fills form:
```
Category: Fuel & Energy
Task: Buy fuel at filling station

Item Cost: ₦10,000
Workmanship Fee: ₦2,000 (what I'm willing to pay errander)

Pickup Location: Shell Station, Ring Road
Delivery Location: My House, Agodi GRA

Additional Notes: Please buy at Shell only, bring receipt
Urgency: Normal (complete within 2 hours)
```

**What Sender Pays**:
```
Item Cost: ₦10,000
Workmanship Fee: ₦2,000
Platform Daily Fee: ₦400
Service Fee (7% of total): ₦840 (7% of ₦12,000)

Total Sender Pays: ₦13,240
```

Platform displays to sender:
```
"You will pay ₦13,240 total
• Item: ₦10,000
• Errander workmanship: ₦2,000
• Platform fees: ₦1,240"
```

---

#### **2. Erranders See Errand & Can Negotiate**

Errander sees:
```
📍 Ring Road → Agodi GRA (4.2 km)
⛽ Buy fuel worth ₦10,000

Workmanship Offered: ₦2,000
Estimated Time: 1 hour

[Accept ₦2,000] [Counter Offer]
```

**Negotiation Flow (Like Indrive)**:

**Scenario A: Errander Accepts**
- Clicks "Accept ₦2,000"
- Errand assigned immediately
- No negotiation needed

**Scenario B: Errander Counters**
- Clicks "Counter Offer"
- Enters: ₦3,000 (because of traffic/distance)
- Message: "Heavy traffic at Ring Road, need ₦3,000"
- Sender gets notification

**Scenario C: Back-and-Forth**
```
Sender offers: ₦2,000
↓
Errander counters: ₦3,000
↓
Sender counters: ₦2,500 (final offer)
↓
Errander accepts ₦2,500
✅ Errand Assigned
```

**Platform Recalculates for Sender**:
```
Item Cost: ₦10,000
Workmanship Fee: ₦2,500 (negotiated up from ₦2,000)
Platform Daily Fee: ₦400
Service Fee (7%): ₦875

New Total: ₦13,775
```

Sender approves or declines the new price.

---

#### **3. Payment Flow (Based on Tier)**

**If Errander is Tier 1 (Starter)**:
```
1. Sender pays ₦13,775 to Zylo (held in escrow)
2. Errander does NOT receive advance
3. Errander uses own ₦10,000 to buy fuel
4. Errander delivers fuel + receipt
5. Sender verifies in-app
6. Zylo releases:
   - ₦10,000 (item reimbursement) + ₦2,500 (workmanship) = ₦12,500 to errander
7. Zylo keeps ₦1,275 (platform fee + service fee)
```

**If Errander is Tier 3 (Verified)**:
```
1. Sender pays ₦13,775 to Zylo (held in escrow)
2. Zylo immediately advances ₦10,000 to errander (item cost)
3. Errander uses platform's ₦10,000 to buy fuel
4. Errander delivers fuel + receipt
5. Sender verifies
6. Zylo releases ₦2,500 (workmanship fee) to errander
7. Zylo keeps ₦1,275 (fees)
```

**If Errander is Tier 4 (Elite)**:
```
1. Sender pays ₦13,775 to Zylo
2. Zylo advances ₦12,500 immediately (item + workmanship)
3. Errander completes errand
4. Sender verifies
5. Done! (errander already has money)
6. Zylo keeps ₦1,275 (fees)
```

---

#### **4. Completion & Rating**

After delivery:
```
Sender confirms:
✅ Fuel received
✅ Receipt matches
✅ Quality good

Rate Errander: ⭐⭐⭐⭐⭐ (5 stars)
Tip (Optional): ₦500 extra

Errander also rates sender:
⭐⭐⭐⭐⭐ (good communication, clear instructions)
```

---

## Revenue Model

### Platform Revenue Streams

#### **1. Daily Platform Fee (from Erranders)**

**How it Works**:
- Errander pays ₦400 per day they use the app
- Only charged on days they complete at least 1 errand
- Auto-deducted from first errand payout of the day

**Example**:
```
Monday: Errander completes 3 errands
- First errand payout: ₦2,000 workmanship - ₦400 platform fee = ₦1,600
- Second errand: ₦1,500 (full amount, fee already paid)
- Third errand: ₦3,000 (full amount)

Tuesday: No errands = ₦0 fee
Wednesday: 1 errand = ₦400 fee charged again
```

**Tier-Based Discount**:
- **Tier 1 (Starter)**: ₦400/day
- **Tier 2 (Trusted)**: ₦300/day (-25% discount)
- **Tier 3 (Verified)**: ₦200/day (-50% discount)
- **Tier 4 (Elite)**: ₦100/day (-75% discount)

**Why Decreasing Fees?**
- Rewards loyal, high-performing erranders
- Incentive to complete more errands (unlock tiers)
- Top performers bring most revenue anyway

---

#### **2. Service Fee (from Senders) - 7%**

**How it Works**:
- 7% of total errand value (item cost + workmanship)
- Charged to sender on top of their payment
- Transparent (sender sees it before posting)

**Example Calculation**:
```
Item Cost: ₦10,000
Workmanship: ₦2,500
Subtotal: ₦12,500

Service Fee (7%): ₦875
Daily Platform Fee: ₦400 (passed to sender)

Total Sender Pays: ₦13,775

Platform Revenue: ₦1,275 per errand
```

---

### Revenue Model Comparison

**Why Our Model is Better than Competitors**:

| Platform | Who Pays Commission | Rate | Errander Gets |
|----------|---------------------|------|---------------|
| **Zylo** | Sender (7% service fee) | 7% | 100% of workmanship |
| Bolt/Uber | Driver (commission) | 20-25% | 75-80% of fare |
| Jumia Food | Restaurant + Customer | 30%+ | N/A |
| Gokada | Rider (commission) | 20% | 80% of fare |

**Zylo Advantage**: Erranders keep 100% of negotiated workmanship fee! Platform makes money from sender fees, not errander commissions.

---

## Tier-Based System

### Tier Philosophy
**"Complete Errands → Build Trust → Unlock Better Benefits"**

Tiers unlock 3 things:
1. **Lower Daily Platform Fees** - Save money as you grow
2. **Higher Errand Limits** - Access bigger jobs
3. **Advance Payment Access** - Stop using your own money

---

### Tier 1: Starter (New Erranders)

**Requirements**:
- ✅ Phone verification (OTP)
- ✅ Email verification
- ✅ Profile photo
- ✅ Basic info (name, address)

**Benefits**:
- ❌ No advance payment (use own money)
- ✅ Can take errands up to **₦7,000 item cost**
- ✅ Full negotiation rights
- ✅ Standard payout (48 hours after completion)

**Daily Platform Fee**: ₦400

**Badge**: 🔵 Starter

**Typical Errands**:
- Small shopping (₦2k - ₦7k)
- Document pickup
- Bill payments
- Short deliveries

**Goal**: Complete **10 errands** with 4+ star rating → Tier 2

---

### Tier 2: Trusted (Proven Track Record)

**Requirements**:
- ✅ Complete 10 errands (4+ star average)
- ✅ Upload government ID (NIN/Driver's License)
- ✅ Verify home address (utility bill)
- ✅ Emergency contact

**Benefits**:
- ✅ Advance payment up to **₦7,000**
- ✅ Can take errands up to **₦15,000 item cost**
- ✅ Faster payout (24 hours)
- ✅ Priority visibility (shown higher in errander list)
- ✅ "Trusted" badge on profile

**Daily Platform Fee**: ₦300 (-25% discount)

**Badge**: 🟢 Trusted

**Payment Example**:
```
Errand: ₦6,000 shopping + ₦1,800 workmanship

Since ₦6,000 < ₦7,000 limit:
✅ Platform advances ₦6,000 immediately
✅ Errander doesn't use own money
✅ After completion, errander gets ₦1,800 workmanship
```

**Goal**: Complete **50 more errands** (60 total) → Tier 3

---

### Tier 3: Verified (High Trust)

**Requirements**:
- ✅ Complete 60 errands (4.2+ star average)
- ✅ Bank account verification (BVN)
- ✅ Guarantor information
- ✅ Video call verification with Zylo team
- ✅ Background check passed

**Benefits**:
- ✅ Advance payment up to **₦25,000**
- ✅ Can take errands up to **₦50,000 item cost**
- ✅ Same-day payout option
- ✅ Access to corporate errands (businesses)
- ✅ Featured in app (more visibility)
- ✅ "Verified" badge

**Daily Platform Fee**: ₦200 (-50% discount)

**Badge**: 🟡 Verified ✓

**Payment Example**:
```
Errand: ₦20,000 electronics + ₦6,000 workmanship

Since ₦20,000 < ₦25,000 limit:
✅ Platform advances ₦20,000 immediately
✅ Errander goes to store, buys item
✅ After completion, errander gets ₦6,000 workmanship
```

**Goal**: Complete **40 more errands** (100 total) → Tier 4

---

### Tier 4: Elite (Top Performers)

**Requirements**:
- ✅ Complete 100 errands (4.5+ star average)
- ✅ 98% completion rate
- ✅ Zero fraud complaints
- ✅ Advanced verification (police clearance)

**Benefits**:
- ✅ **Unlimited advance payment** (platform fully trusts you)
- ✅ **No limit on errand size** (can take ₦100k+ errands)
- ✅ **Instant payout** (receive payment within 2 hours)
- ✅ **Priority for corporate contracts** (recurring business errands)
- ✅ **Gold "Elite" badge** with star ⭐
- ✅ Featured prominently in app
- ✅ Can set minimum workmanship fee (reject low offers automatically)
- ✅ Access to business insurance (₦1M coverage)

**Daily Platform Fee**: ₦100 (-75% discount)

**Badge**: ⭐ Elite

**Special Perks**:
- Monthly bonus for maintaining elite status
- Referral bonuses (bring new erranders, earn ₦5k per referral)
- Early access to new features
- VIP customer support (dedicated phone line)

---

### Tier Comparison Table

| Feature | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---------|--------|--------|--------|--------|
| **Errands Completed** | 0 | 10+ | 60+ | 100+ |
| **Advance Payment Limit** | ₦0 | ₦7k | ₦25k | Unlimited |
| **Max Errand Size** | ₦7k | ₦15k | ₦50k | Unlimited |
| **Daily Platform Fee** | ₦400 | ₦300 | ₦200 | ₦100 |
| **Payout Time** | 48hrs | 24hrs | Same day | 2hrs |
| **Badge** | 🔵 Starter | 🟢 Trusted | 🟡 Verified | ⭐ Elite |
| **Corporate Errands** | ❌ | ❌ | ✅ | ✅ |
| **Insurance Coverage** | ₦10k | ₦50k | ₦200k | ₦1M |

---

## Competitive Analysis

### Our Competition in Nigeria

#### 1. **Indrive Nigeria (Ride-Hailing)**
**What They Do**: Ride-hailing with negotiation model

**Strengths**:
- Established negotiation platform
- Users understand the model
- Large user base

**Weaknesses**:
- Not focused on errands
- Only transportation/delivery
- Don't do shopping, banking, queues

**Our Advantage**: We apply Indrive's model specifically to errands (bigger market)

---

#### 2. **Naborgo (Artisan + Errands)**
**What They Do**: Home services + some errands

**Weaknesses**:
- Diluted focus (artisans + errands)
- Complex operations
- Trust issues with home services
- Fixed pricing (no negotiation)

**Our Advantage**:
- Errands-only (clearer positioning)
- Negotiation = fair pricing
- Lower operational complexity

---

#### 3. **Tucello, Errandaar, Errand Waka**
**What They Do**: Errand services (Lagos-focused)

**Weaknesses**:
- May not be in Ibadan
- Fixed pricing models
- High commissions from erranders
- Limited transparency

**Our Advantage**:
- Ibadan-first strategy
- Transparent negotiation
- Erranders keep 100% of workmanship
- Sender pays platform fees

---

#### 4. **Informal Errand Boys/Girls**
**What They Do**: Word-of-mouth errand services

**Weaknesses**:
- No tracking
- No insurance
- No accountability
- Cash-only
- Limited reach

**Our Advantage**:
- GPS tracking
- Digital payment
- Rating system
- Insurance coverage
- Wider pool of erranders

---

### Competitive Positioning

**Zylo = "The Fair Errand Marketplace"**

Tagline Options:
1. "Negotiate Fair, Complete with Care"
2. "Your Errand, Your Price, Your Way"
3. "Ibadan's Trusted Errand Runners"
4. "Errands Done Right, Prices Done Fair"

---

## Pricing Examples

### Example 1: Small Shopping Errand (Tier 1 Errander)

**Sender Posts**:
```
Task: Buy groceries at Bodija Market
Item Cost: ₦5,000
Workmanship Offered: ₦1,500
Distance: 3km from my house
```

**Errander Accepts**: ₦1,500 (no negotiation)

**Sender Pays**:
```
Item: ₦5,000
Workmanship: ₦1,500
Platform Fee: ₦400
Service Fee (7% of ₦6,500): ₦455

Total: ₦7,355
```

**Errander Flow** (Tier 1):
1. Uses own ₦5,000 to buy groceries
2. Delivers with receipt
3. Sender verifies
4. Receives ₦5,000 + ₦1,500 - ₦400 (daily fee) = ₦6,100
5. **Net Profit**: ₦1,100 (₦1,500 - ₦400)

**Platform Earns**: ₦855

---

### Example 2: Fuel Errand with Negotiation (Tier 2 Errander)

**Sender Posts**:
```
Task: Buy fuel at filling station
Item Cost: ₦10,000
Workmanship Offered: ₦2,000
Distance: 6km
```

**Errander Counters**: ₦3,000 (far distance + traffic)

**Sender Counters**: ₦2,500 (final offer)

**Errander Accepts**: ₦2,500 ✅

**Sender Pays**:
```
Item: ₦10,000
Workmanship: ₦2,500
Platform Fee: ₦300 (Tier 2 rate)
Service Fee (7% of ₦12,500): ₦875

Total: ₦13,675
```

**Errander Flow** (Tier 2):
1. Platform advances ₦7,000 (Tier 2 limit)
2. Errander adds ₦3,000 from own pocket
3. Buys ₦10,000 fuel
4. Delivers with receipt
5. Receives ₦3,000 (reimbursement) + ₦2,500 (workmanship) - ₦300 (daily fee) = ₦5,200
6. **Net Profit**: ₦2,200 (₦2,500 - ₦300)

**Platform Earns**: ₦1,175

---

### Example 3: Large Electronics Purchase (Tier 3 Errander)

**Sender Posts**:
```
Task: Buy laptop at Slot Ibadan
Item Cost: ₦350,000
Workmanship Offered: ₦15,000
Distance: 5km
Urgent: Yes (need today)
```

**Errander Counters**: ₦20,000 (high value item, urgent, risk)

**Sender Accepts**: ₦20,000

**Sender Pays**:
```
Item: ₦350,000
Workmanship: ₦20,000
Platform Fee: ₦200 (Tier 3 rate)
Service Fee (7% of ₦370,000): ₦25,900

Total: ₦396,100
```

**Errander Flow** (Tier 3):
1. Platform advances ₦25,000 (Tier 3 limit)
2. Errander adds ₦325,000 from own pocket (or bank loan/savings)
3. Buys laptop at Slot with receipt
4. Delivers securely
5. Receives ₦325,000 (reimbursement) + ₦20,000 (workmanship) - ₦200 (daily fee) = ₦344,800
6. **Net Profit**: ₦19,800 (₦20,000 - ₦200)

**Platform Earns**: ₦26,100

---

### Example 4: Corporate Monthly Errands (Tier 4 Elite)

**Corporate Client Posts**:
```
Task: Monthly office supplies shopping
Item Cost: ₦100,000
Workmanship Offered: ₦25,000
Recurring: Every month
```

**Elite Errander**: No negotiation needed (trusted relationship)

**Client Pays**:
```
Item: ₦100,000
Workmanship: ₦25,000
Platform Fee: ₦100 (Tier 4 rate)
Service Fee (7% of ₦125,000): ₦8,750

Total: ₦133,850
```

**Errander Flow** (Tier 4):
1. Platform advances full ₦100,000 (unlimited limit)
2. Errander shops at wholesaler
3. Delivers to office
4. Receives ₦25,000 - ₦100 (daily fee) = ₦24,900
5. **Net Profit**: ₦24,900

**Platform Earns**: ₦8,850

**Monthly**: If errander does this 20 days/month:
- Errander Earns: 20 x ₦24,900 = ₦498,000/month
- Platform Earns: 20 x ₦8,850 = ₦177,000/month from one elite errander!

---

## Technical Requirements

### Features to Build

#### Phase 1: Core Marketplace (Weeks 1-4)

**Must-Have Features**:
1. ✅ User registration (sender + errander)
2. ✅ Post errand (sender flow)
3. ✅ Browse errands (errander flow)
4. ✅ **Negotiation system** (counter-offer back and forth)
5. ✅ Accept errand
6. ✅ GPS tracking during errand
7. ✅ Photo upload (receipt + item proof)
8. ✅ In-app chat (sender ↔ errander)
9. ✅ Payment integration (Paystack escrow)
10. ✅ Rating system (both parties rate each other)

**New Screens Needed**:
```
Frontend (my-app/app/):
├── errands/
│   ├── browse.tsx           # Erranders browse available errands
│   ├── [id].tsx             # Errand details + negotiation interface
│   └── my-errands.tsx       # Track active/completed errands
├── negotiate/
│   └── [id].tsx             # Negotiation chat screen
└── payment/
    └── confirm.tsx          # Payment confirmation before posting
```

---

#### Phase 2: Negotiation Flow (Week 5)

**Negotiation Interface**:

```typescript
// Negotiation Screen Component

<ErrandDetails>
  <ItemCost>₦10,000</ItemCost>
  <WorkmanshipOffer>₦2,000</WorkmanshipOffer>

  {isErrander && (
    <NegotiationButtons>
      <Button onPress={acceptOffer}>Accept ₦2,000</Button>
      <Button onPress={openCounterOffer}>Counter Offer</Button>
    </NegotiationButtons>
  )}

  <NegotiationHistory>
    <Offer from="sender" amount="2000" />
    <Offer from="errander" amount="3000" message="Traffic + distance" />
    <Offer from="sender" amount="2500" message="Final offer" />
    <Offer from="errander" status="accepted" />
  </NegotiationHistory>
</ErrandDetails>
```

**Backend API Needed**:
```
POST /errands/:id/negotiate
{
  "offer_amount": 3000,
  "message": "Traffic + distance",
  "user_type": "errander"
}

Response:
{
  "success": true,
  "negotiation_id": "uuid",
  "current_offer": 3000,
  "awaiting_response_from": "sender"
}
```

---

#### Phase 3: Tier System (Week 6-7)

**Database Schema Changes**:

```sql
-- Add to users table
ALTER TABLE users ADD COLUMN tier INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN errands_completed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN completion_rate DECIMAL(5,2) DEFAULT 100;
ALTER TABLE users ADD COLUMN kyc_documents JSONB;
ALTER TABLE users ADD COLUMN advance_payment_limit DECIMAL(10,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN daily_platform_fee DECIMAL(10,2) DEFAULT 400;

-- Tier progression tracking
CREATE TABLE tier_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  old_tier INTEGER,
  new_tier INTEGER,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily platform fee tracking
CREATE TABLE daily_fees (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE,
  fee_amount DECIMAL(10,2),
  errands_completed INTEGER,
  first_errand_id UUID REFERENCES errands(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

**Tier Calculation Logic**:

```typescript
// backend/src/services/tierService.ts

export async function checkAndUpgradeTier(userId: string) {
  const user = await getUserWithStats(userId);

  const tierRequirements = {
    2: { errands: 10, rating: 4.0, kyc: 'basic' },
    3: { errands: 60, rating: 4.2, kyc: 'full' },
    4: { errands: 100, rating: 4.5, kyc: 'elite', completionRate: 98 }
  };

  let newTier = user.tier;

  for (const [tier, req] of Object.entries(tierRequirements)) {
    if (
      user.errands_completed >= req.errands &&
      user.average_rating >= req.rating &&
      user.completion_rate >= (req.completionRate || 0) &&
      user.kyc_level >= req.kyc
    ) {
      newTier = parseInt(tier);
    }
  }

  if (newTier > user.tier) {
    await upgradeTier(userId, newTier);
    await sendTierUpgradeNotification(userId, newTier);
  }
}
```

---

#### Phase 4: Payment & Escrow System (Week 8)

**Payment Flow Architecture**:

```typescript
// When sender posts errand and errander accepts

1. Sender Payment (Escrow):
   - Calculate total: item + workmanship + fees
   - Charge sender via Paystack
   - Hold funds in Zylo escrow account

2. Advance Payment (Based on Tier):
   if (errander.tier === 1) {
     // No advance
     advance = 0;
   } else if (errander.tier === 2) {
     advance = Math.min(errand.item_cost, 7000);
   } else if (errander.tier === 3) {
     advance = Math.min(errand.item_cost, 25000);
   } else if (errander.tier === 4) {
     advance = errand.item_cost + errand.workmanship;
   }

   if (advance > 0) {
     await paystackTransfer(errander.bank_account, advance);
   }

3. On Completion:
   - Sender verifies delivery
   - Release remaining funds to errander
   - Deduct daily platform fee (if not yet paid today)
   - Keep service fee for platform
```

**Paystack Integration**:

```typescript
// backend/src/services/paymentService.ts

import Paystack from 'paystack';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

export async function chargeErrandToSender(errand, sender) {
  const amount = calculateTotalCost(errand);

  const transaction = await paystack.transaction.initialize({
    email: sender.email,
    amount: amount * 100, // Convert to kobo
    reference: `ZYLO-${errand.id}`,
    metadata: {
      errand_id: errand.id,
      sender_id: sender.id,
      item_cost: errand.item_cost,
      workmanship: errand.workmanship,
      service_fee: errand.service_fee
    }
  });

  return transaction.data.authorization_url; // Redirect sender here
}

export async function sendAdvanceToErrander(errand, errander) {
  const advanceAmount = calculateAdvanceAmount(errander.tier, errand.item_cost);

  if (advanceAmount === 0) return null;

  const transfer = await paystack.transfer.create({
    source: 'balance',
    amount: advanceAmount * 100,
    recipient: errander.recipient_code, // From bank account verification
    reason: `Advance for errand ${errand.id}`,
    reference: `ADV-${errand.id}`
  });

  return transfer;
}
```

---

## Go-to-Market Strategy

### Phase 1: Beta Launch in Ibadan (Month 1-2)

**Target**: 100 active users (40 senders + 60 erranders)

#### Errander Recruitment

**University Campuses** (UI, Lead City, Polytechnic):
- Print 5,000 flyers: "Earn ₦3,000-₦20,000 Daily Running Errands"
- Campus ambassadors (pay ₦30k/month to promote)
- Student union partnership (sponsor events)

**Social Media Ads**:
- Facebook/Instagram ads targeting Ibadan youth (18-35)
- Ad copy: "Turn Your Free Time into Cash - Be a Zylo Errander"
- Video testimonials of beta erranders

**Referral Program**:
- First 50 erranders: ₦2,000 bonus after completing first errand
- Refer 5 erranders: Get upgraded to Tier 2 immediately

---

#### Sender Recruitment

**Busy Professionals**:
- LinkedIn ads targeting Ibadan professionals
- Partner with corporate estates (Ring Road, Bodija GRA)
- Flyers at banks (people hate queues!)

**Small Businesses**:
- Direct outreach to 100 SMEs in Ibadan
- Offer free first 5 errands
- Corporate packages (monthly retainer)

**Estate Partnerships**:
- Partner with 5 residential estates
- Run promotional booths on weekends
- Offer residents first errand free

---

### Phase 2: Full Launch (Month 3-6)

**Target**: 1,500 users (500 senders + 1,000 erranders)

**Marketing Channels**:

1. **Radio Ads** (₦500k/month):
   - Fresh FM (prime time: 7-9am, 5-7pm)
   - Splash FM
   - Script: "Stuck in that banking queue? Send a Zylo errander! Download now."

2. **Billboards** (₦300k/month):
   - Mokola roundabout
   - Challenge
   - Bodija Market entrance

3. **TikTok/Instagram**:
   - Partner with Ibadan influencers (₦50k per post)
   - Run challenges: #ZyloErrandChallenge
   - Show creative errands (funny moments)

4. **Strategic Partnerships**:
   - Fuel stations (promote during scarcity)
   - Supermarkets (flyers at checkout)
   - Banks (promote queue-standing service)

---

### Phase 3: Expansion (Month 7-12)

Expand to:
1. Oyo town (Month 7)
2. Ogbomoso (Month 8)
3. Abeokuta, Ogun State (Month 10)

**Delay Lagos** until Year 2 (need ₦50M+ for Lagos competition)

---

## Financial Projections

### Unit Economics

**Average Errand**:
```
Item Cost: ₦8,000
Workmanship: ₦2,500
Platform Fee: ₦300 (average across tiers)
Service Fee (7% of ₦10,500): ₦735

Total Sender Pays: ₦11,535
Platform Revenue per Errand: ₦1,035
```

---

### Monthly Projections

#### Month 1-2 (Beta)
- **Errands/Month**: 500
- **Revenue**: 500 x ₦1,035 = ₦517,500
- **Costs**:
  - Server/Hosting: ₦30,000
  - Paystack fees (1.5%): ₦77,625
  - Marketing: ₦300,000
  - Operations: ₦100,000
  - **Total**: ₦507,625
- **Net Profit**: ₦9,875 (break-even)

---

#### Month 3-6 (Growth)
- **Errands/Month**: 2,500
- **Revenue**: 2,500 x ₦1,035 = ₦2,587,500
- **Costs**: ₦800,000
- **Net Profit**: ₦1,787,500/month

---

#### Month 7-12 (Scale)
- **Errands/Month**: 6,000
- **Revenue**: 6,000 x ₦1,035 = ₦6,210,000
- **Costs**: ₦1,500,000
- **Net Profit**: ₦4,710,000/month

---

### Year 1 Summary
- **Total Errands**: 35,000
- **Total Revenue**: ₦36.2M
- **Total Costs**: ₦12M
- **Net Profit**: ₦24.2M

---

## Next Steps (Week-by-Week Action Plan)

### Week 1-2: Business Foundation
- [ ] Register business (CAC)
- [ ] Open business bank account
- [ ] Set up Paystack merchant account
- [ ] Design brand (logo, colors, marketing materials)
- [ ] Create social media accounts

### Week 3-6: Build Negotiation System
- [ ] Implement negotiation UI (counter-offer interface)
- [ ] Build negotiation backend (offer/counter API)
- [ ] Test negotiation flow end-to-end
- [ ] Add real-time notifications (new offer received)

### Week 7-8: Build Tier System
- [ ] Implement tier calculation logic
- [ ] Add KYC document upload
- [ ] Build admin panel for KYC verification
- [ ] Integrate BVN verification API (Prembly/Youverify)
- [ ] Test advance payment flow per tier

### Week 9-10: Payment Integration
- [ ] Set up Paystack escrow system
- [ ] Implement advance payment logic
- [ ] Test full payment flow (charge → hold → release)
- [ ] Add daily platform fee deduction

### Week 11-12: Beta Testing
- [ ] Internal testing (10 test users)
- [ ] Fix critical bugs
- [ ] Recruit first 50 erranders
- [ ] Recruit first 30 senders
- [ ] Launch beta in UI campus area

### Week 13-16: Full Launch
- [ ] Scale marketing (radio, billboards)
- [ ] Onboard 1,000 erranders
- [ ] Process 2,000+ errands/month
- [ ] Monitor and optimize

---

## Conclusion

**Zylo = Indrive Model Applied to Errands**

### Competitive Advantages
1. ✅ **Negotiation System** - Fair pricing for both sides
2. ✅ **Sender Pays Fees** - More attractive to erranders
3. ✅ **Tier-Based Trust** - Progressive benefits, lower platform risk
4. ✅ **Errands-Only Focus** - Clearer positioning than Naborgo
5. ✅ **Ibadan-First** - Deep local focus before expansion

### Why This Will Work
- **Market Fit**: Ibadan is underserved, high demand for errand services
- **Fair Model**: Negotiation = market-driven pricing (not platform-controlled)
- **Low Errander Friction**: Keep 100% of workmanship, no commission
- **Progressive Trust**: Start small, earn big (motivates quality work)

### Next Co-Founder Meeting
1. Finalize exact tier requirements (how many errands per tier?)
2. Decide on KYC documents needed per tier
3. Choose BVN verification provider (Prembly vs Youverify vs Dojah)
4. Assign development tasks (who builds what?)
5. Set beta launch date (target 8 weeks from now?)

---

**Let's build Ibadan's most trusted errand marketplace! 🚀**
