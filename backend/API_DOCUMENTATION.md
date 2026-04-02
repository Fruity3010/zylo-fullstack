# Zylo Backend API Documentation

Complete API reference for the Zylo mobile application backend.

## Base URL
```
http://localhost:3000
```

## Authentication
All endpoints except `/api/auth/*` and `/api/payments/webhook` require JWT authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Sign Up
```http
POST /api/auth/signup
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe",
  "role": "sender" // or "errander" or "both"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": { ... },
    "session": { ... }
  }
}
```

### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Get Current User
```http
GET /api/auth/me
```

### Logout
```http
POST /api/auth/logout
```

---

## 📦 Errand Endpoints

### Create Errand
```http
POST /api/errands
```

**Body:**
```json
{
  "category": "courier_delivery",
  "title": "Deliver package to Ikeja",
  "description": "Pick up from location A and deliver to B",
  "budget": 5000,
  "pickup_location": {
    "latitude": 6.5244,
    "longitude": 3.3792,
    "address": "123 Street, Lagos"
  },
  "destination_location": {
    "latitude": 6.6018,
    "longitude": 3.3515,
    "address": "456 Avenue, Ikeja"
  }
}
```

### Get All Errands
```http
GET /api/errands?status=open&category=courier_delivery&limit=20&offset=0
```

### Get Errand by ID
```http
GET /api/errands/:id
```

### Update Errand
```http
PUT /api/errands/:id
```

### Delete Errand
```http
DELETE /api/errands/:id
```

### Apply to Errand
```http
POST /api/errands/:id/apply
```

---

## 💰 Payment & Wallet Endpoints

### Get Wallet Balance
```http
GET /api/payments/wallet
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": {
      "available_balance": 15000,
      "held_balance": 5000,
      "total_earned": 50000,
      "total_spent": 25000
    },
    "balance": {
      "available": 15000,
      "held": 5000,
      "total": 20000
    }
  }
}
```

### Initialize Payment (Deposit)
```http
POST /api/payments/initialize
```

**Body:**
```json
{
  "amount": 10000,
  "errand_id": "optional-errand-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authorization_url": "https://checkout.paystack.com/ZYLO_...",
    "access_code": "access_code_...",
    "reference": "ZYLO_1234567890_ABC"
  }
}
```

### Verify Payment
```http
POST /api/payments/verify/:reference
```

### Get Transaction History
```http
GET /api/payments/transactions?limit=50&offset=0&type=deposit
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "type": "deposit",
      "amount": 10000,
      "balance_after": 25000,
      "description": "Wallet top-up",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Request Withdrawal
```http
POST /api/payments/withdraw
```

**Body:**
```json
{
  "amount": 5000,
  "bank_name": "GTBank",
  "account_number": "0123456789",
  "account_name": "John Doe"
}
```

### Get Payout History
```http
GET /api/payments/payouts
```

### Get Supported Banks
```http
GET /api/payments/banks
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "name": "Access Bank", "code": "044", "id": 1 },
    { "name": "GTBank", "code": "058", "id": 2 }
  ]
}
```

### Paystack Webhook (No Auth)
```http
POST /api/payments/webhook
```

---

## 🤝 Negotiation/Offers Endpoints

### Create Offer on Errand
```http
POST /api/offers/errands/:id/offers
```

**Body:**
```json
{
  "offered_price": 4500,
  "message": "I can do this for ₦4,500"
}
```

### Get Offers for an Errand
```http
GET /api/offers/errands/:id/offers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "errand_id": "...",
      "errander_id": "...",
      "errander_name": "Jane Doe",
      "errander_rating": 4.5,
      "errander_tier": "silver",
      "offered_price": 4500,
      "message": "I can do this for ₦4,500",
      "status": "pending",
      "created_at": "..."
    }
  ]
}
```

### Get My Offers
```http
GET /api/offers/my-offers
```

### Accept Offer
```http
PATCH /api/offers/:id/accept
```

### Reject Offer
```http
PATCH /api/offers/:id/reject
```

### Withdraw Offer
```http
DELETE /api/offers/:id
```

---

## ⭐ Ratings & Reviews Endpoints

### Rate an Errand
```http
POST /api/ratings/errands/:id/rate
```

**Body:**
```json
{
  "rating": 5,
  "review": "Great experience, very professional!"
}
```

### Get User's Ratings
```http
GET /api/ratings/users/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ratings": [...],
    "statistics": {
      "total": 25,
      "average": 4.6,
      "distribution": {
        "5": 15,
        "4": 8,
        "3": 2,
        "2": 0,
        "1": 0
      }
    }
  }
}
```

### Get My Given Ratings
```http
GET /api/ratings/my-ratings
```

### Get Errand Ratings
```http
GET /api/ratings/errands/:id
```

### Check Rating Status
```http
GET /api/ratings/check/:errandId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "has_rated": true,
    "rating": { ... }
  }
}
```

---

## 💵 Daily Fees Endpoints

### Calculate Errand Fees
```http
POST /api/fees/errands/:id/calculate
```

**Response:**
```json
{
  "success": true,
  "data": {
    "errand_id": "...",
    "budget": 5000,
    "user_tier": "bronze",
    "daily_fee": 500,
    "days_elapsed": 3,
    "total_fees": 1500,
    "total_cost": 6500,
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-01-04T00:00:00Z"
  }
}
```

### Get Daily Fee Breakdown
```http
GET /api/fees/errands/:id
```

### Accrue Daily Fee (Admin/Automated)
```http
POST /api/fees/errands/:id/accrue
```

**Body:**
```json
{
  "date": "2024-01-15"
}
```

### Get User Fee Summary
```http
GET /api/fees/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "errands": [
      {
        "id": "...",
        "title": "Deliver package",
        "budget": 5000,
        "total_fees": 1500,
        "total_cost": 6500
      }
    ],
    "total_fees": 1500,
    "total_budget": 5000,
    "total_cost": 6500
  }
}
```

---

## 💬 Chat Endpoints

### Get Conversations
```http
GET /api/chat/conversations
```

### Get Messages
```http
GET /api/chat/conversations/:conversationId/messages
```

### Send Message
```http
POST /api/chat/conversations/:conversationId/messages
```

### Mark as Read
```http
PUT /api/chat/messages/:messageId/read
```

---

## 📊 Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔄 Errand Status Flow

```
open → assigned → in_progress → completed
                              ↘ cancelled
```

## 🎯 Tier System

**Bronze (Default):**
- 10% daily fee
- No KYC required

**Silver:**
- 8% daily fee
- Requires: 10+ errands, 4.0+ rating

**Gold:**
- 5% daily fee
- Requires: 50+ errands, 4.5+ rating

## 💳 Payment Flow

1. **Sender creates errand** → No payment yet
2. **Errander applies/offers** → No payment yet
3. **Sender accepts** → Must fund wallet (errand budget is held in escrow)
4. **Errand in progress** → Funds held
5. **Errand completed** → Funds released to errander
6. **Errand cancelled** → Funds refunded to sender

---

## 🧪 Testing with Mock Data

The Paystack integration is mocked for development:
- All payments succeed instantly
- No real money is charged
- Use any bank details for withdrawals

To test:
1. Sign up → Get JWT token
2. Fund wallet → Use any amount
3. Create errand → Will auto-succeed
4. Apply to errand → Accept offer
5. Complete errand → Funds released

---

## 🚀 Production Setup

Before deploying:

1. **Set environment variables:**
   ```env
   PAYSTACK_SECRET_KEY=sk_live_xxx
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=eyJxxx...
   NODE_ENV=production
   ```

2. **Run database migrations:**
   ```sql
   -- In Supabase SQL Editor:
   -- 1. Run supabase-schema.sql
   -- 2. Run supabase-chat-schema.sql
   -- 3. Run supabase-extended-schema.sql
   -- 4. Run supabase-storage-setup.sql
   ```

3. **Replace mock Paystack with real integration:**
   - See comments in `src/services/paystackService.ts`
   - Install `npm install paystack`
   - Update all methods with real API calls

---

## 📝 Notes

- JWT tokens expire after 7 days
- Maximum file upload: 10MB
- Transaction history: Last 1000 items
- Rate limiting: 100 requests/minute per user
