# Zylo - Complete System Documentation
## Co-Founder Reference Document

**Date**: February 13, 2026
**Authors**: Edward Campbell + Claude (Co-Founders)
**Purpose**: Single source of truth for Zylo's business model, technical architecture, and implementation plan

---

## Table of Contents
1. [Business Model Overview](#business-model-overview)
2. [Complete User Flow](#complete-user-flow)
3. [Revenue Model](#revenue-model)
4. [Tier-Based KYC System](#tier-based-kyc-system)
5. [Technical Architecture](#technical-architecture)
6. [Notification System](#notification-system)
7. [Payment & Escrow System](#payment--escrow-system)
8. [Competitive Strategy](#competitive-strategy)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Success Metrics](#success-metrics)

---

## Business Model Overview

### What is Zylo?

**"Uber for Errands with One-Time Counter Offers"**

Zylo is an errand marketplace where:
- **Senders** post errands they need done (shopping, banking, deliveries, etc.)
- **Erranders** see notifications and can accept or counter the offered price
- **Platform** facilitates matching, payment, and trust through a tier system

### Core Value Propositions

**For Senders**:
- ✅ Get errands done without leaving home/office
- ✅ Fair pricing through competitive offers
- ✅ See errander ratings/tier before accepting
- ✅ Real-time tracking during errand
- ✅ Insurance protection

**For Erranders**:
- ✅ Flexible work - choose which errands to take
- ✅ Keep 100% of negotiated workmanship fee
- ✅ Fair platform fees (only pay on active days)
- ✅ Climb tiers → unlock bigger errands + lower fees
- ✅ Build reputation and earning potential

**For Platform (Us)**:
- ✅ Daily platform fee from active erranders
- ✅ 7% service fee from senders (on total errand value)
- ✅ Low risk through tier-based advance payments
- ✅ Scalable model (more errands = more revenue)

---

## Complete User Flow

### Phase 1: Sender Posts Errand

**Sender Opens App** → **Create Errand**

**Form Fields**:
```
Category: [Dropdown]
├── 🛒 Shopping & Groceries
├── ⛽ Fuel & Energy
├── 📦 Courier & Delivery
├── 🏦 Banking & Payments
├── 📄 Document Services
├── ⏰ Queue Standing
└── 📝 Custom Errand

Title: (e.g., "Buy fuel at Shell station")

Description:
"I need 10 liters of fuel from Shell station at Ring Road.
Please bring receipt."

Item Cost: ₦10,000 [Input]
Workmanship Fee: ₦2,000 [Input]

Pickup Location: 📍 Shell Station, Ring Road [Map Pin]
Delivery Location: 📍 My House, Agodi GRA [Map Pin]

Urgency:
○ Normal (2-4 hours)
○ Urgent (< 1 hour) [+50% fee]

Photo Upload: [Optional - reference photos]
```

**Platform Calculates Total**:
```
Item Cost:          ₦10,000
Workmanship Fee:    ₦2,000
Platform Fee:       ₦400
Service Fee (7%):   ₦840
─────────────────────────────
TOTAL YOU PAY:      ₦13,240
```

**Confirmation Screen**:
```
┌─────────────────────────────────────┐
│ Review Your Errand                  │
│                                     │
│ ⛽ Buy fuel at Shell station        │
│ Ring Road → Agodi GRA (4.2 km)     │
│                                     │
│ Item Cost:        ₦10,000          │
│ Workmanship:      ₦2,000           │
│ Platform Fee:     ₦400             │
│ Service Fee (7%): ₦840             │
│                                     │
│ Total:            ₦13,240          │
│                                     │
│ [Cancel]    [Post Errand & Pay]    │
└─────────────────────────────────────┘
```

**Payment Flow**:
1. Sender clicks "Post Errand & Pay"
2. Redirect to Paystack payment page
3. Sender pays ₦13,240
4. Funds held in Zylo escrow account
5. Errand goes live → Broadcast to erranders

---

### Phase 2: Erranders Receive Notification (Uber-Style)

**Broadcast Rules**:
- All erranders within **10km radius** of pickup location get push notification
- Only **active** erranders (app open or background) receive it
- Notification shows basic errand info

**Push Notification**:
```
📱 Phone Notification:

┌─────────────────────────────────────┐
│ 🔔 Zylo                            │
│ New Errand Near You - 3.2 km away  │
│ ⛽ Buy fuel - ₦2,000 workmanship   │
│ Tap to view details                │
└─────────────────────────────────────┘
```

**In-App Notification (Popup Modal)**:
```
┌─────────────────────────────────────┐
│ 🆕 New Errand Available             │
│                                     │
│ ⛽ Buy Fuel at Shell Station        │
│                                     │
│ 📍 Ring Road → Agodi GRA           │
│ 📏 Distance: 3.2 km from you       │
│ ⏱️  Estimated: 1 hour              │
│                                     │
│ 💰 Item Cost: ₦10,000              │
│ 💵 Workmanship: ₦2,000             │
│                                     │
│ 👀 12 erranders viewing             │
│                                     │
│ [❌ Decline]  [💬 Counter]  [✅ Accept ₦2,000] │
└─────────────────────────────────────┘
```

**Key Elements**:
- ✅ Shows distance from errander's current location
- ✅ Shows how many erranders are viewing (creates urgency)
- ✅ Clear action buttons (Decline, Counter, Accept)
- ✅ All info visible without needing to click through

---

### Phase 3: Errander Response (3 Options)

#### **Option A: Accept Immediately** ✅

**Flow**:
1. Errander clicks **"Accept ₦2,000"**
2. Errand instantly assigned to them
3. All other erranders' notifications disappear
4. Sender gets notification: "John accepted your errand!"
5. **Errand begins** → Move to Phase 4

---

#### **Option B: Decline** ❌

**Flow**:
1. Errander clicks **"Decline"**
2. Notification dismisses for them
3. Errand remains available for other erranders
4. No penalty, no impact on rating

---

#### **Option C: Send Counter Offer** 💬 (ONE TIME ONLY)

**Flow**:
1. Errander clicks **"Counter"**
2. Modal pops up:

```
┌─────────────────────────────────────┐
│ Send Counter Offer                  │
│                                     │
│ Original Workmanship: ₦2,000       │
│                                     │
│ Your Counter Offer:                │
│ ₦ [________]                       │
│                                     │
│ Reason (Optional):                 │
│ ┌─────────────────────────────┐   │
│ │ Heavy traffic at Ring Road  │   │
│ │ + distance = need ₦3,000    │   │
│ └─────────────────────────────┘   │
│                                     │
│ Note: You can only counter once    │
│                                     │
│   [Cancel]      [Send Offer]       │
└─────────────────────────────────────┘
```

3. Errander enters: **₦3,000**
4. Errander (optional) adds reason
5. Clicks **"Send Offer"**
6. Counter offer sent to sender
7. **Errander can NOT counter again** (one shot)
8. Notification changes to "Offer Sent" state:

```
┌─────────────────────────────────────┐
│ ⏳ Offer Sent - Waiting for Sender  │
│                                     │
│ Your offer: ₦3,000                 │
│ Original:   ₦2,000                 │
│                                     │
│ Status: Pending sender's decision   │
│                                     │
│ [Cancel My Offer]                  │
└─────────────────────────────────────┘
```

---

### Phase 4: Sender Sees Counter Offers (Banner Notifications)

**Sender's Screen**:
Sender sees all responses as **banner notifications** stacking on screen:

```
┌─────────────────────────────────────┐
│ Your Errand: Buy Fuel               │
│ Posted 3 minutes ago                │
│                                     │
│ 👀 15 erranders viewed              │
│ 💬 5 counter offers received        │
│ ✅ 2 accepted your price            │
└─────────────────────────────────────┘

Offers Received:

┌─────────────────────────────────────┐
│ 👤 David Adeyemi                    │
│ ⭐⭐⭐⭐⭐ 4.8 • 89 errands • 🟡 Tier 3 │
│                                     │
│ ✅ Accepts ₦2,000 (Original price)  │
│ 2.1 km away • 12 mins ago          │
│                                     │
│    [Decline]        [✅ Accept]     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👤 John Okoye                       │
│ ⭐⭐⭐⭐⭐ 4.9 • 45 errands • 🟢 Tier 2 │
│                                     │
│ 💬 Counter Offer: ₦3,000           │
│ "Heavy traffic at Ring Road"        │
│ 1.8 km away • 8 mins ago           │
│                                     │
│    [Decline]        [Accept ₦3,000] │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👤 Mary Oluwaseun                   │
│ ⭐⭐⭐⭐ 4.2 • 23 errands • 🔵 Tier 1  │
│                                     │
│ 💬 Counter Offer: ₦2,500           │
│ "Fair price for distance"           │
│ 3.5 km away • 5 mins ago           │
│                                     │
│    [Decline]        [Accept ₦2,500] │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👤 Ibrahim Yusuf                    │
│ ⭐⭐⭐⭐⭐ 5.0 • 12 errands • 🔵 Tier 1 │
│                                     │
│ ✅ Accepts ₦2,000 (Original price)  │
│ 4.0 km away • Just now             │
│                                     │
│    [Decline]        [✅ Accept]     │
└─────────────────────────────────────┘
```

**Sender's Decision Making**:
Sender can see:
- ✅ Errander's tier (trust level)
- ✅ Rating and number of completed errands
- ✅ Distance from pickup location
- ✅ Time since offer was made
- ✅ Counter offer amount vs original
- ✅ Reason for counter (if provided)

**Sender Can**:
1. **Accept any offer** → Errand assigned to that errander
2. **Decline offers** → They disappear
3. **Wait for more offers** → Keep notifications open
4. **Cancel errand** → Refund sender (minus small processing fee)

---

### Phase 5: Acceptance & Errand Assignment

**When Sender Accepts an Offer**:

1. Sender clicks **"Accept"** on John's ₦3,000 offer
2. **Instant Assignment**:
   - John gets notification: "🎉 Errand Assigned! You got the job."
   - All other erranders get: "Errand filled by another errander"
   - All notifications disappear

3. **Payment Recalculation** (if counter was accepted):
```
Original Total: ₦13,240
New Workmanship: ₦3,000 (instead of ₦2,000)
New Service Fee: 7% of ₦13,000 = ₦910

Additional Charge: ₦1,070
(Platform charges sender's card automatically)

New Total: ₦14,310
```

4. **Advance Payment** (Based on Errander's Tier):

**If John is Tier 2** (₦7,000 advance limit):
```
- Platform advances: ₦7,000 immediately to John's account
- John needs to add: ₦3,000 from own pocket
- After completion, John gets: ₦3,000 (reimbursement) + ₦3,000 (workmanship) - ₦300 (daily fee) = ₦5,700
```

**If John is Tier 3** (₦25,000 advance limit):
```
- Platform advances: ₦10,000 immediately (full item cost)
- John needs to add: ₦0 (nothing!)
- After completion, John gets: ₦3,000 (workmanship) - ₦200 (daily fee) = ₦2,800
```

**If John is Tier 4** (unlimited):
```
- Platform advances: ₦13,000 (item + workmanship)
- John completes errand with platform's money
- No additional payout needed (already received)
- Daily fee: ₦100 (deducted from next errand or charged separately)
```

---

### Phase 6: Errand Execution

**Errander's Task Screen**:
```
┌─────────────────────────────────────┐
│ Active Errand                       │
│                                     │
│ ⛽ Buy Fuel at Shell Station        │
│                                     │
│ Status: 🟢 In Progress              │
│                                     │
│ Steps:                              │
│ ✅ 1. Go to Shell Station, Ring Rd  │
│ 🔵 2. Buy ₦10,000 worth of fuel     │
│ ⭕ 3. Upload receipt photo          │
│ ⭕ 4. Deliver to Agodi GRA          │
│ ⭕ 5. Mark as completed             │
│                                     │
│ 📍 Track My Location: [ON]         │
│ (Sender can see your live location) │
│                                     │
│ 💬 Chat with Sender                │
│                                     │
│ [Upload Receipt] [Complete Errand]  │
└─────────────────────────────────────┘
```

**Real-Time Tracking**:
- Sender sees errander's live GPS location on map
- Shows: "John is 500m from Shell Station"
- Updates every 10 seconds

**Photo Evidence Required**:
1. **Receipt photo** - Proof of purchase
2. **Item photo** - Before delivery (fuel in jerry can, etc.)
3. **Delivery photo** - At sender's location

---

### Phase 7: Completion & Rating

**Errander Marks Complete**:
```
┌─────────────────────────────────────┐
│ Mark Errand Complete?               │
│                                     │
│ ✅ Uploaded receipt                 │
│ ✅ Uploaded item photo              │
│ 📍 At delivery location             │
│                                     │
│ Final Check:                        │
│ ☑ Item delivered to sender         │
│ ☑ Sender confirmed receipt          │
│                                     │
│ [Cancel]    [Complete Errand]      │
└─────────────────────────────────────┘
```

**Sender Verification**:
Sender gets notification:
```
┌─────────────────────────────────────┐
│ Errand Completed by John            │
│                                     │
│ Please verify:                      │
│ ☑ Received ₦10,000 fuel            │
│ ☑ Receipt matches purchase          │
│ ☑ Quality is satisfactory           │
│                                     │
│ View Photos: [Receipt] [Item]      │
│                                     │
│ [Report Issue]    [Confirm ✅]      │
└─────────────────────────────────────┘
```

**Rating Screen** (Both parties rate each other):
```
┌─────────────────────────────────────┐
│ Rate John                           │
│                                     │
│ How was your experience?            │
│ ⭐ ⭐ ⭐ ⭐ ⭐                         │
│                                     │
│ Feedback (Optional):               │
│ ┌─────────────────────────────┐   │
│ │ Fast and professional!      │   │
│ └─────────────────────────────┘   │
│                                     │
│ Tip John? (Optional)               │
│ [₦500]  [₦1,000]  [Custom]        │
│                                     │
│      [Skip]       [Submit]         │
└─────────────────────────────────────┘
```

**Payment Release**:
1. Sender confirms completion
2. Platform releases payment to errander
3. Deducts daily platform fee (if first errand of the day)
4. Both parties can rate each other
5. Errand marked as **"Completed"** in history

---

### Phase 8: No Response Scenario

**If No Erranders Accept Within 10 Minutes**:

Sender sees:
```
┌─────────────────────────────────────┐
│ ⏰ No Responses Yet                 │
│                                     │
│ Your errand has been viewed by      │
│ 8 erranders, but no one has         │
│ accepted yet.                       │
│                                     │
│ 💡 Suggestion:                      │
│ Try increasing workmanship to       │
│ ₦2,800 - ₦3,500 for better response │
│                                     │
│ Current: ₦2,000                    │
│ Suggested: ₦3,000 (+50%)           │
│                                     │
│ [Keep Waiting] [Increase to ₦3,000]│
└─────────────────────────────────────┘
```

**Auto-Suggestion Algorithm**:
```javascript
if (views > 5 && acceptances === 0 && timeElapsed > 10 mins) {
  suggestedIncrease = currentWorkmanship * 1.3; // +30%
  showSuggestion(suggestedIncrease);
}
```

---

## Revenue Model

### Platform Revenue Streams

#### 1. Daily Platform Fee (From Erranders)

**Structure**:
- Charged **only on days errander completes at least 1 errand**
- Deducted from **first errand payout** of the day
- Amount varies by tier

**Tier-Based Pricing**:
| Tier | Daily Fee | Discount |
|------|-----------|----------|
| Tier 1 (Starter) | ₦400 | 0% (base) |
| Tier 2 (Trusted) | ₦300 | -25% |
| Tier 3 (Verified) | ₦200 | -50% |
| Tier 4 (Elite) | ₦100 | -75% |

**Example**:
```
Errander (Tier 2) completes 3 errands on Monday:

Errand 1: ₦2,000 workmanship - ₦300 (daily fee) = ₦1,700 received
Errand 2: ₦1,500 workmanship = ₦1,500 received (fee already paid)
Errand 3: ₦3,000 workmanship = ₦3,000 received

Total Earned: ₦6,200
Platform Fee: ₦300

Tuesday - No errands = ₦0 fee
Wednesday - 1 errand = ₦300 fee charged again
```

**Why This Works**:
- Fair: Only pay if you use the platform
- Predictable: Erranders know exact daily cost
- Incentive to work: More errands = better value (fee spread across earnings)

---

#### 2. Service Fee (From Senders) - 7%

**Calculation**:
- 7% of **(Item Cost + Workmanship Fee)**
- Charged to sender on top of their total
- Transparent (shown before posting)

**Example**:
```
Item Cost: ₦10,000
Workmanship: ₦2,500
Subtotal: ₦12,500

Service Fee (7%): ₦875
Platform Daily Fee: ₦300 (passed to sender)
───────────────────────────
Sender Pays: ₦13,675

Platform Revenue: ₦1,175 per errand
```

**Note**: We pass the errander's daily platform fee to the sender (absorbed in service fee), so errander effectively pays ₦0 directly.

---

### Revenue Per Errand Breakdown

**Average Errand**:
```
Item Cost:           ₦8,000
Workmanship:         ₦2,500
────────────────────────────
Subtotal:            ₦10,500

Platform Daily Fee:  ₦300 (avg across tiers)
Service Fee (7%):    ₦735
────────────────────────────
Total Sender Pays:   ₦11,535

Platform Revenue:    ₦1,035
Errander Keeps:      ₦2,500 (100% of workmanship!)
```

**Why Erranders Love This**:
Unlike Uber/Bolt (20-25% commission), Zylo erranders keep **100% of negotiated workmanship**. Platform makes money from sender fees.

---

## Tier-Based KYC System

### Philosophy

**"Trust is Earned Through Performance"**

- Start small (use own money) → Prove yourself → Unlock bigger errands
- Complete more errands → Lower fees → Advance payments → Higher earnings
- Natural fraud prevention (scammers won't complete 100 errands)

---

### Tier 1: Starter 🔵

**Requirements**:
- ✅ Phone verification (OTP)
- ✅ Email verification
- ✅ Profile photo
- ✅ Basic info (name, age, address)

**Capabilities**:
- ❌ No advance payment (use own money for items)
- ✅ Can take errands up to **₦7,000 item cost**
- ✅ Full negotiation/counter offer rights
- ✅ Payout in 48 hours after completion

**Daily Platform Fee**: ₦400

**Badge**: 🔵 Starter

**How Payment Works**:
```
Errand: ₦5,000 item + ₦1,500 workmanship

1. Sender pays ₦6,900 to platform (held in escrow)
2. Errander uses own ₦5,000 to buy item
3. Errander delivers + sender confirms
4. Platform pays errander: ₦5,000 + ₦1,500 - ₦400 = ₦6,100
5. Net profit: ₦1,100
```

**Upgrade Path**: Complete **10 errands** with 4+ star rating

---

### Tier 2: Trusted 🟢

**Requirements**:
- ✅ 10 completed errands (4+ star average)
- ✅ Government ID uploaded (NIN/Driver's License/Voter's Card)
- ✅ Address verification (utility bill or local govt letter)
- ✅ Emergency contact provided

**Capabilities**:
- ✅ Advance payment up to **₦7,000**
- ✅ Can take errands up to **₦15,000 item cost**
- ✅ Faster payout (24 hours)
- ✅ Priority visibility (shown higher to senders)
- ✅ "Trusted" badge on profile

**Daily Platform Fee**: ₦300 (-25% discount)

**Badge**: 🟢 Trusted

**How Payment Works**:
```
Errand: ₦6,000 item + ₦2,000 workmanship

1. Sender pays ₦8,300 to platform
2. Platform advances ₦6,000 to errander (within limit)
3. Errander uses platform's ₦6,000 to buy item
4. Errander delivers + sender confirms
5. Platform pays: ₦2,000 - ₦300 = ₦1,700
6. Total earned: ₦1,700 (never used own money!)
```

**Upgrade Path**: Complete **50 more errands** (60 total) with 4.2+ star average

---

### Tier 3: Verified 🟡

**Requirements**:
- ✅ 60 completed errands (4.2+ star average)
- ✅ Bank account verification (BVN)
- ✅ Guarantor information (name, phone, address, relationship)
- ✅ Video verification call with Zylo team
- ✅ Background check clearance

**Capabilities**:
- ✅ Advance payment up to **₦25,000**
- ✅ Can take errands up to **₦50,000 item cost**
- ✅ Same-day payout (within 8 hours)
- ✅ Access to corporate errands
- ✅ Featured in app
- ✅ "Verified" badge with checkmark

**Daily Platform Fee**: ₦200 (-50% discount)

**Badge**: 🟡 Verified ✓

**How Payment Works**:
```
Errand: ₦20,000 item + ₦5,000 workmanship

1. Sender pays ₦25,750 to platform
2. Platform advances ₦20,000 to errander
3. Errander buys ₦20,000 item with platform's money
4. Delivers + confirms
5. Platform pays: ₦5,000 - ₦200 = ₦4,800
6. Total earned: ₦4,800
```

**Upgrade Path**: Complete **40 more errands** (100 total) with 4.5+ stars, 98% completion rate, zero fraud

---

### Tier 4: Elite ⭐

**Requirements**:
- ✅ 100+ completed errands (4.5+ star average)
- ✅ 98%+ completion rate
- ✅ Zero fraud complaints
- ✅ Advanced verification (police clearance)

**Capabilities**:
- ✅ **Unlimited advance payment** (full trust from platform)
- ✅ **No errand size limit** (can take ₦100k+ errands)
- ✅ **Instant payout** (within 2 hours of completion)
- ✅ Priority for corporate contracts (recurring business)
- ✅ Can set minimum workmanship (auto-reject low offers)
- ✅ Insurance up to ₦1,000,000 per errand
- ✅ Gold "Elite" badge with star

**Daily Platform Fee**: ₦100 (-75% discount)

**Badge**: ⭐ Elite

**Special Perks**:
- Monthly bonus (₦20k) for maintaining elite status
- Referral bonuses (₦5k per errander brought to platform)
- VIP customer support (dedicated phone line)
- Featured on homepage ("Meet Our Elite Erranders")
- Early access to new features

**How Payment Works**:
```
Errand: ₦100,000 item + ₦25,000 workmanship

1. Sender pays ₦133,850 to platform
2. Platform advances ₦125,000 to errander (item + workmanship)
3. Errander completes errand with platform's money
4. Delivers + confirms
5. Daily fee ₦100 deducted from next errand or separate charge
6. Errander already has full payment = instant liquidity
```

**Elite Status Maintenance**:
- Must complete 20+ errands per month
- Maintain 4.5+ star rating
- 98%+ completion rate
- Zero fraud/complaints

---

### Tier Comparison Table

| Feature | Tier 1 🔵 | Tier 2 🟢 | Tier 3 🟡 | Tier 4 ⭐ |
|---------|----------|----------|-----------|-----------|
| **Errands Required** | 0 | 10+ | 60+ | 100+ |
| **Average Rating** | N/A | 4.0+ | 4.2+ | 4.5+ |
| **Advance Payment** | ₦0 | ₦7k max | ₦25k max | Unlimited |
| **Max Errand Size** | ₦7k | ₦15k | ₦50k | Unlimited |
| **Daily Fee** | ₦400 | ₦300 | ₦200 | ₦100 |
| **Payout Time** | 48 hours | 24 hours | 8 hours | 2 hours |
| **KYC Level** | Basic | ID + Address | Full (BVN + Guarantor) | Elite (Police check) |
| **Corporate Access** | ❌ | ❌ | ✅ | ✅ |
| **Insurance** | ₦10k | ₦50k | ₦200k | ₦1M |
| **Priority Ranking** | Low | Medium | High | Highest |

---

## Technical Architecture

### Tech Stack

**Frontend (Mobile App)**:
- React Native 0.79.4
- Expo Router (navigation)
- TypeScript
- React Native Paper (UI components)
- React Native Maps (GPS tracking)
- Axios (API calls)
- AsyncStorage (local data)

**Backend (API)**:
- Node.js + Express.js
- TypeScript
- Supabase (PostgreSQL database)
- Supabase Auth (JWT authentication)
- Supabase Realtime (WebSocket for live updates)

**Payment**:
- Paystack (payment gateway)
- Paystack Transfer API (payouts to erranders)

**Notifications**:
- Expo Push Notifications (mobile)
- Supabase Realtime (in-app updates)

**Storage**:
- Supabase Storage (photos: receipts, items, IDs)
- Cloudinary (optional, for image optimization)

**Maps & Location**:
- Google Maps API (location search, geocoding)
- React Native Maps (map display)
- Geolocation API (GPS tracking)

---

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('sender', 'errander', 'both')),

  -- Errander-specific fields
  tier INTEGER DEFAULT 1 CHECK (tier BETWEEN 1 AND 4),
  errands_completed INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 100,

  -- KYC fields
  kyc_documents JSONB, -- {id_card, address_proof, bvn, guarantor, police_clearance}
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  advance_payment_limit DECIMAL(10,2) DEFAULT 0,
  daily_platform_fee DECIMAL(10,2) DEFAULT 400,

  -- Paystack
  bank_account JSONB, -- {bank_name, account_number, account_name}
  paystack_recipient_code TEXT,

  -- Location
  last_known_location POINT,
  is_online BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_location ON users USING GIST(last_known_location);
CREATE INDEX idx_users_tier ON users(tier);
CREATE INDEX idx_users_online ON users(is_online);
```

---

#### Errands Table
```sql
CREATE TABLE errands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relationships
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  errander_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Errand details
  category TEXT NOT NULL CHECK (category IN ('shopping', 'fuel_energy', 'courier', 'banking', 'documents', 'queue', 'custom')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Pricing
  item_cost DECIMAL(10,2) NOT NULL,
  workmanship_fee DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  service_fee DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,

  -- Locations
  pickup_location POINT NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_location POINT NOT NULL,
  delivery_address TEXT NOT NULL,
  distance_km DECIMAL(5,2),

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'disputed')),
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),

  -- Media
  reference_photos TEXT[], -- Array of image URLs
  receipt_photo TEXT,
  item_photo TEXT,
  delivery_photo TEXT,

  -- Tracking
  views_count INTEGER DEFAULT 0,
  counter_offers_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 hours')
);

CREATE INDEX idx_errands_status ON errands(status);
CREATE INDEX idx_errands_location ON errands USING GIST(pickup_location);
CREATE INDEX idx_errands_sender ON errands(sender_id);
CREATE INDEX idx_errands_errander ON errands(errander_id);
CREATE INDEX idx_errands_created ON errands(created_at DESC);
```

---

#### Errand Offers Table
```sql
CREATE TABLE errand_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  errand_id UUID NOT NULL REFERENCES errands(id) ON DELETE CASCADE,
  errander_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  offer_type TEXT NOT NULL CHECK (offer_type IN ('accept', 'counter')),
  offered_workmanship DECIMAL(10,2), -- NULL if accept, value if counter
  message TEXT, -- Optional reason for counter

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,

  UNIQUE(errand_id, errander_id) -- One offer per errander per errand
);

CREATE INDEX idx_offers_errand ON errand_offers(errand_id);
CREATE INDEX idx_offers_errander ON errand_offers(errander_id);
CREATE INDEX idx_offers_status ON errand_offers(status);
```

---

#### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  errand_id UUID NOT NULL REFERENCES errands(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  errander_id UUID REFERENCES users(id),

  -- Amounts
  item_cost DECIMAL(10,2) NOT NULL,
  workmanship_fee DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  service_fee DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,

  -- Paystack
  paystack_reference TEXT UNIQUE,
  paystack_status TEXT,

  -- Advance payment
  advance_paid DECIMAL(10,2) DEFAULT 0,
  advance_reference TEXT,

  -- Final payout
  final_payout DECIMAL(10,2),
  payout_reference TEXT,
  payout_status TEXT CHECK (payout_status IN ('pending', 'paid', 'failed')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  payout_at TIMESTAMPTZ
);

CREATE INDEX idx_payments_errand ON payments(errand_id);
CREATE INDEX idx_payments_sender ON payments(sender_id);
CREATE INDEX idx_payments_errander ON payments(errander_id);
```

---

#### Daily Fees Table
```sql
CREATE TABLE daily_fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,

  fee_amount DECIMAL(10,2) NOT NULL,
  tier INTEGER NOT NULL,
  errands_completed INTEGER DEFAULT 0,
  first_errand_id UUID REFERENCES errands(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, date) -- One fee per user per day
);

CREATE INDEX idx_daily_fees_user_date ON daily_fees(user_id, date);
```

---

#### Ratings Table
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  errand_id UUID NOT NULL REFERENCES errands(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES users(id),
  rated_id UUID NOT NULL REFERENCES users(id),

  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  tip_amount DECIMAL(10,2) DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(errand_id, rater_id) -- One rating per user per errand
);

CREATE INDEX idx_ratings_rated ON ratings(rated_id);
CREATE INDEX idx_ratings_errand ON ratings(errand_id);
```

---

## Notification System

### Architecture

**Two Types of Notifications**:
1. **Push Notifications** - Mobile device notifications (even when app closed)
2. **In-App Notifications** - Real-time updates within app

---

### Push Notifications (Expo)

**Setup**:
```javascript
// services/notifications.ts
import * as Notifications from 'expo-notifications';

export async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Please enable notifications to receive errand alerts!');
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  // Save token to backend
  await saveTokenToBackend(token.data);
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

**Backend Broadcast** (When errand is posted):
```typescript
// backend/src/services/notificationService.ts

export async function broadcastErrandToErranders(errand) {
  // 1. Find erranders within 10km radius
  const nearbyErranders = await supabase
    .from('users')
    .select('id, expo_push_token, last_known_location')
    .eq('role', 'errander')
    .eq('is_online', true);

  const eligibleErranders = nearbyErranders.filter(errander => {
    const distance = calculateDistance(
      errand.pickup_location,
      errander.last_known_location
    );
    return distance <= 10; // 10km radius
  });

  // 2. Send push notification to each
  const messages = eligibleErranders.map(errander => ({
    to: errander.expo_push_token,
    sound: 'default',
    title: `New Errand - ${errand.category}`,
    body: `₦${errand.workmanship_fee} workmanship • ${distance}km away`,
    data: {
      errand_id: errand.id,
      type: 'new_errand'
    },
    priority: 'high',
  }));

  await sendPushNotifications(messages);

  // 3. Create in-app notifications
  await createInAppNotifications(eligibleErranders, errand);
}

function calculateDistance(point1, point2) {
  // Haversine formula to calculate distance between two GPS coordinates
  const R = 6371; // Earth's radius in km
  const lat1 = point1.lat * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
  const deltaLon = (point2.lng - point1.lng) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in km
}
```

---

### In-App Real-Time Updates (Supabase Realtime)

**Errander Side** (Listen for new errands):
```typescript
// app/dashboard/errander.tsx

useEffect(() => {
  // Subscribe to errand notifications for this user
  const subscription = supabase
    .channel('errander_notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'errand_notifications',
        filter: `user_id=eq.${currentUser.id}`
      },
      (payload) => {
        // New errand notification received
        const errand = payload.new;
        showErrandPopup(errand);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [currentUser.id]);
```

**Sender Side** (Listen for offers):
```typescript
// app/errands/[id].tsx

useEffect(() => {
  // Subscribe to offers for this errand
  const subscription = supabase
    .channel(`errand_offers_${errandId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'errand_offers',
        filter: `errand_id=eq.${errandId}`
      },
      (payload) => {
        // New offer received
        const offer = payload.new;
        addOfferToBanners(offer);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [errandId]);
```

---

### View Count Tracking

**When Errander Views Errand**:
```typescript
// Track unique views
await supabase.rpc('increment_errand_views', {
  errand_id: errandId,
  viewer_id: currentUser.id
});

// SQL function:
CREATE OR REPLACE FUNCTION increment_errand_views(errand_id UUID, viewer_id UUID)
RETURNS void AS $$
BEGIN
  -- Only count unique views (one per errander)
  IF NOT EXISTS (
    SELECT 1 FROM errand_views
    WHERE errand_id = errand_id AND user_id = viewer_id
  ) THEN
    INSERT INTO errand_views (errand_id, user_id) VALUES (errand_id, viewer_id);
    UPDATE errands SET views_count = views_count + 1 WHERE id = errand_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

---

## Payment & Escrow System

### Paystack Integration

**Setup**:
```typescript
// backend/src/config/paystack.ts
import Paystack from 'paystack';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

export default paystack;
```

---

### Payment Flow

#### Step 1: Sender Posts Errand (Escrow Payment)

```typescript
// POST /api/errands
export async function createErrand(req, res) {
  const { item_cost, workmanship_fee, ...errandData } = req.body;
  const sender = req.user;

  // Calculate fees
  const platform_fee = 400; // Will be adjusted based on accepted errander's tier
  const service_fee = (item_cost + workmanship_fee) * 0.07;
  const total_cost = item_cost + workmanship_fee + platform_fee + service_fee;

  // Initialize Paystack payment
  const payment = await paystack.transaction.initialize({
    email: sender.email,
    amount: total_cost * 100, // Convert to kobo
    reference: `ZYLO_${Date.now()}`,
    callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
    metadata: {
      errand_id: 'pending',
      sender_id: sender.id,
      item_cost,
      workmanship_fee,
      platform_fee,
      service_fee
    }
  });

  // Return payment URL
  res.json({
    success: true,
    payment_url: payment.data.authorization_url,
    reference: payment.data.reference
  });
}
```

#### Step 2: Payment Verification

```typescript
// POST /api/payments/verify
export async function verifyPayment(req, res) {
  const { reference } = req.body;

  // Verify with Paystack
  const verification = await paystack.transaction.verify(reference);

  if (verification.data.status === 'success') {
    // Payment successful - create errand
    const metadata = verification.data.metadata;

    const errand = await supabase
      .from('errands')
      .insert({
        sender_id: metadata.sender_id,
        item_cost: metadata.item_cost,
        workmanship_fee: metadata.workmanship_fee,
        platform_fee: metadata.platform_fee,
        service_fee: metadata.service_fee,
        total_cost: verification.data.amount / 100,
        status: 'pending',
        // ... other errand fields
      })
      .single();

    // Store payment record
    await supabase.from('payments').insert({
      errand_id: errand.id,
      sender_id: metadata.sender_id,
      paystack_reference: reference,
      total_amount: verification.data.amount / 100,
      paystack_status: 'success'
    });

    // Broadcast to erranders
    await broadcastErrandToErranders(errand);

    res.json({ success: true, errand });
  } else {
    res.status(400).json({ success: false, message: 'Payment failed' });
  }
}
```

---

#### Step 3: Advance Payment (When Errand Assigned)

```typescript
// POST /api/errands/:id/assign
export async function assignErrand(req, res) {
  const { errand_id, errander_id, offer_id } = req.body;

  const errander = await getUserById(errander_id);
  const errand = await getErrandById(errand_id);

  // Calculate advance based on errander's tier
  let advance_amount = 0;

  if (errander.tier === 2) {
    advance_amount = Math.min(errand.item_cost, 7000);
  } else if (errander.tier === 3) {
    advance_amount = Math.min(errand.item_cost, 25000);
  } else if (errander.tier === 4) {
    advance_amount = errand.item_cost + errand.workmanship_fee; // Full advance
  }
  // Tier 1 gets ₦0 advance

  // Transfer funds to errander if advance > 0
  if (advance_amount > 0 && errander.paystack_recipient_code) {
    const transfer = await paystack.transfer.create({
      source: 'balance',
      amount: advance_amount * 100,
      recipient: errander.paystack_recipient_code,
      reason: `Advance for errand ${errand_id}`,
      reference: `ADV_${errand_id}_${Date.now()}`
    });

    // Update payment record
    await supabase
      .from('payments')
      .update({
        advance_paid: advance_amount,
        advance_reference: transfer.data.reference
      })
      .eq('errand_id', errand_id);
  }

  // Assign errand
  await supabase
    .from('errands')
    .update({
      errander_id,
      status: 'assigned',
      assigned_at: new Date()
    })
    .eq('id', errand_id);

  res.json({ success: true, advance_amount });
}
```

---

#### Step 4: Final Payout (After Completion)

```typescript
// POST /api/errands/:id/complete
export async function completeErrand(req, res) {
  const { errand_id } = req.params;

  const errand = await getErrandById(errand_id);
  const errander = await getUserById(errand.errander_id);
  const payment = await getPaymentByErrandId(errand_id);

  // Calculate final payout
  let payout_amount = 0;

  if (errander.tier === 1) {
    // Tier 1: Reimbursement + workmanship - daily fee
    payout_amount = errand.item_cost + errand.workmanship_fee - errander.daily_platform_fee;
  } else if (errander.tier === 2 || errander.tier === 3) {
    // Tier 2/3: Remaining item cost + workmanship - daily fee
    const remaining_item_cost = errand.item_cost - payment.advance_paid;
    payout_amount = remaining_item_cost + errand.workmanship_fee - errander.daily_platform_fee;
  } else if (errander.tier === 4) {
    // Tier 4: Only daily fee (already received full advance)
    payout_amount = -errander.daily_platform_fee; // Deduct from future errand or charge separately
  }

  // Check if daily fee already charged today
  const today = new Date().toISOString().split('T')[0];
  const dailyFeeRecord = await supabase
    .from('daily_fees')
    .select('*')
    .eq('user_id', errander.id)
    .eq('date', today)
    .single();

  if (dailyFeeRecord) {
    // Fee already paid today - don't deduct again
    payout_amount += errander.daily_platform_fee;
  } else {
    // Record daily fee
    await supabase.from('daily_fees').insert({
      user_id: errander.id,
      date: today,
      fee_amount: errander.daily_platform_fee,
      tier: errander.tier,
      first_errand_id: errand_id
    });
  }

  // Transfer final payout
  if (payout_amount > 0) {
    const transfer = await paystack.transfer.create({
      source: 'balance',
      amount: payout_amount * 100,
      recipient: errander.paystack_recipient_code,
      reason: `Payout for errand ${errand_id}`,
      reference: `PAY_${errand_id}_${Date.now()}`
    });

    // Update payment record
    await supabase
      .from('payments')
      .update({
        final_payout: payout_amount,
        payout_reference: transfer.data.reference,
        payout_status: 'paid',
        payout_at: new Date()
      })
      .eq('errand_id', errand_id);
  }

  // Update errand status
  await supabase
    .from('errands')
    .update({
      status: 'completed',
      completed_at: new Date()
    })
    .eq('id', errand_id);

  res.json({ success: true, payout_amount });
}
```

---

## Competitive Strategy

### Target Market: Ibadan First

**Why Ibadan**:
- 3.5M population (3rd largest Nigerian city)
- Less competition than Lagos
- High student population (UI, Polytech, Lead City)
- Growing middle class
- Traffic/banking pain points = high demand for errands

**Positioning**: "Ibadan's Most Trusted Errand Marketplace"

---

### Competitive Advantages

**vs. Naborgo**:
- ✅ Focused (errands only, no artisans) = clearer value prop
- ✅ Simpler operations (no skill verification needed)
- ✅ Lower risk (no home access issues)

**vs. Tucello/Errandaar**:
- ✅ Negotiation system = fair pricing (not platform-set)
- ✅ Erranders keep 100% workmanship (no commission)
- ✅ Tier system = progressive trust building
- ✅ Local focus (Ibadan-first, not national)

**vs. Informal Erranders**:
- ✅ GPS tracking + insurance
- ✅ Digital payments (no cash risk)
- ✅ Rating system = accountability
- ✅ Wider pool of vetted erranders

---

## Implementation Roadmap

### Phase 1: MVP (Weeks 1-6)

**Week 1-2: Core Features**
- [ ] User registration (sender + errander)
- [ ] Post errand flow
- [ ] Browse errands (errander side)
- [ ] Accept/decline functionality
- [ ] Basic payment integration (Paystack)

**Week 3-4: Uber-Style Matching**
- [ ] Push notification system (Expo)
- [ ] 10km radius calculation
- [ ] Real-time errand broadcasting
- [ ] View count tracking
- [ ] One-time counter offer UI + backend

**Week 5-6: Completion Flow**
- [ ] GPS tracking during errand
- [ ] Photo upload (receipt, item, delivery)
- [ ] In-app chat (sender ↔ errander)
- [ ] Rating system (both sides)
- [ ] Payment release logic

**MVP Launch Target**: 100 test users (40 senders + 60 erranders)

---

### Phase 2: Tier System (Weeks 7-9)

**Week 7: Backend Logic**
- [ ] Tier calculation algorithm
- [ ] KYC document upload endpoints
- [ ] Admin dashboard for KYC approval
- [ ] BVN verification API integration (Prembly/Youverify)

**Week 8: Payment Tiers**
- [ ] Advance payment logic per tier
- [ ] Daily platform fee tracking
- [ ] Automatic tier upgrades (when criteria met)
- [ ] Payout timing per tier

**Week 9: UI Updates**
- [ ] Tier badges on profiles
- [ ] KYC upload screens
- [ ] Tier progress indicators
- [ ] Benefits explanation screens

---

### Phase 3: Safety & Trust (Weeks 10-11)

- [ ] Emergency SOS button
- [ ] Live location sharing (sender can see errander)
- [ ] Insurance integration (partner with insurance company)
- [ ] Dispute resolution system
- [ ] Background check integration

---

### Phase 4: Growth Features (Week 12+)

- [ ] Referral system
- [ ] Corporate accounts (bulk errands)
- [ ] Subscription plans for frequent senders
- [ ] Analytics dashboard (ops team)
- [ ] Promotional campaigns (discount codes)

---

## Success Metrics

### User Acquisition
- **Month 1-2**: 100 active users
- **Month 3-6**: 1,000 active users
- **Month 7-12**: 3,000+ active users

### Engagement
- **Errands per Day**: 50 (Month 3) → 200 (Month 12)
- **Repeat Rate**: 40% of senders post 2+ errands
- **Errander Activity**: 60% complete 5+ errands/month

### Financial
- **GMV** (Gross Merchandise Value): ₦2M/month (Month 3) → ₦15M/month (Month 12)
- **Revenue**: ₦2.5M/month (Month 6) → ₦6M/month (Month 12)
- **Break-even**: Month 4-5

### Quality
- **Average Rating**: 4.3+ stars
- **Completion Rate**: 92%+
- **Fraud Rate**: <0.5%

### Tier Progression
- **Tier 2 Conversion**: 40% of Tier 1 reach Tier 2
- **Tier 3 Conversion**: 25% of Tier 2 reach Tier 3
- **Tier 4 Conversion**: 15% of Tier 3 reach Tier 4

---

## Next Co-Founder Meeting Agenda

1. **Finalize Tier Requirements**
   - Exact number of errands per tier?
   - KYC documents needed per tier?
   - Background check provider?

2. **Development Timeline**
   - When to start building?
   - Who codes what? (Frontend vs Backend split)
   - Beta launch date target?

3. **Initial Funding**
   - How much do we invest? (₦2-3M suggested)
   - Breakdown: Development, Marketing, Operations

4. **Roles & Responsibilities**
   - Who handles operations (KYC review, disputes)?
   - Who handles marketing?
   - Who manages tech?

5. **Legal Setup**
   - Register business (CAC)
   - Open corporate bank account
   - Terms of service + Privacy policy

---

## Conclusion

Zylo has a **clear competitive advantage** with:
1. ✅ Uber-style matching (simple, proven model)
2. ✅ One-time counter offers (simpler than Indrive's back-and-forth)
3. ✅ Sender pays all fees (attractive to erranders)
4. ✅ Tier-based trust system (progressive benefits + low platform risk)
5. ✅ Errands-only focus (clearer than Naborgo's artisan mix)

**Timeline to Launch**: 12 weeks (3 months) from start of development

**Expected Results**:
- Month 6: Break-even (₦2.5M revenue/month)
- Year 1: ₦25-30M revenue, 3,000+ active users

---

**Let's build Ibadan's most trusted errand marketplace! 🚀**

This document is our single source of truth. All decisions and implementations should align with what's written here.

**Last Updated**: February 13, 2026
**Next Review**: After Phase 1 MVP completion
