# Zylo Backend API

Complete Node.js + Express + TypeScript backend for the Zylo mobile application with Supabase integration.

## 🚀 Features Implemented

### ✅ Core Features
- **Authentication**: JWT-based auth with Supabase Auth
- **Errands**: Full CRUD with status management & escrow integration
- **Chat**: Real-time messaging with Supabase Realtime
- **Payments**: Mock Paystack integration with escrow system
- **Wallet**: Full ledger tracking (deposits, withdrawals, holds, releases)
- **Negotiation**: Counter-offer system for errands
- **Ratings**: 5-star rating system with reviews
- **Fees**: Tier-based daily fee calculation
- **Tier Promotion**: Auto-upgrade from Bronze → Silver → Gold

### 🎯 Status: Backend 100% Complete

## 📋 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 4.18
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT)
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Payment**: Paystack (Mocked for development)

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.ts              # Supabase client setup
│   ├── controllers/
│   │   ├── authController.ts        # Auth endpoints
│   │   ├── errandController.ts      # Errand CRUD + workflow
│   │   ├── chatController.ts        # Chat/messaging
│   │   ├── paymentController.ts     # Wallet & payments
│   │   ├── offerController.ts       # Negotiation system
│   │   ├── ratingController.ts      # Ratings & reviews
│   │   └── feeController.ts         # Daily fee tracking
│   ├── middleware/
│   │   └── auth.ts                  # JWT auth middleware
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── errandRoutes.ts
│   │   ├── chatRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   ├── offerRoutes.ts
│   │   ├── ratingRoutes.ts
│   │   └── feeRoutes.ts
│   ├── services/
│   │   ├── walletService.ts         # Wallet ledger operations
│   │   └── paystackService.ts       # Mock payment gateway
│   ├── types/
│   │   ├── index.ts                 # Core types
│   │   └── chat.ts                  # Chat types
│   └── server.ts                    # Express app setup
├── supabase-schema.sql              # Users & errands tables
├── supabase-chat-schema.sql         # Chat tables
├── supabase-extended-schema.sql     # Offers, ratings, wallet, fees
├── supabase-storage-setup.sql       # File storage setup
├── API_DOCUMENTATION.md             # Complete API reference
├── package.json
└── tsconfig.json
```

## 🗄️ Database Schema

### Core Tables
- **users** - User profiles with tier, KYC, ratings
- **errands** - Errand listings with status tracking
- **conversations** - Chat conversations
- **messages** - Chat messages

### Extended Tables
- **errand_offers** - Counter-offers for negotiation
- **ratings** - User ratings and reviews
- **wallets** - User wallet balances
- **transactions** - Complete transaction ledger
- **payouts** - Withdrawal requests
- **daily_fees** - Daily fee tracking
- **tier_history** - Tier promotion audit trail

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Paystack (use test keys for development)
PAYSTACK_SECRET_KEY=sk_test_your_key
PAYSTACK_PUBLIC_KEY=pk_test_your_key

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8081
```

### 3. Run Database Migrations

In your Supabase SQL Editor, run these files in order:

```sql
-- 1. Core schema
\i supabase-schema.sql

-- 2. Chat schema
\i supabase-chat-schema.sql

-- 3. Extended features
\i supabase-extended-schema.sql

-- 4. Storage setup
\i supabase-storage-setup.sql
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Start Development Server
```bash
npm run dev
```

Server will start on http://localhost:3000

**Access Points:**
- API: http://localhost:3000/health
- **Swagger UI: http://localhost:3000/api-docs** ⭐
- Docs shortcut: http://localhost:3000/docs

### 6. Build for Production
```bash
npm run build
npm start
```

## 📚 Interactive API Documentation (Swagger)

### Access Swagger UI

Visit **http://localhost:3000/api-docs** for interactive API documentation.

**Features:**
- ✅ Try all 40 endpoints directly in browser
- ✅ JWT authentication built-in (click Authorize button)
- ✅ Request/response examples for every endpoint
- ✅ Downloadable OpenAPI spec
- ✅ Export to Postman

**Quick Start:**
1. Open http://localhost:3000/api-docs
2. Try `POST /api/auth/signup` to create account
3. Copy the `access_token` from response
4. Click **Authorize** button, paste token
5. Test any endpoint with "Try it out"

See `SWAGGER_GUIDE.md` for detailed usage instructions.

## 📡 API Endpoints Summary

**All endpoints documented in Swagger UI** - See `API_DOCUMENTATION.md` for markdown version.

### Authentication
- POST `/api/auth/signup`, `/api/auth/login`
- GET `/api/auth/me`
- POST `/api/auth/logout`

### Errands
- Full CRUD + `/api/errands/:id/apply`, `/api/errands/:id/complete`, `/api/errands/:id/cancel`

### Payments & Wallet
- `/api/payments/wallet`, `/api/payments/initialize`, `/api/payments/verify/:ref`
- `/api/payments/transactions`, `/api/payments/withdraw`, `/api/payments/payouts`

### Offers (Negotiation)
- `/api/offers/errands/:id/offers`, `/api/offers/my-offers`
- `/api/offers/:id/accept`, `/api/offers/:id/reject`

### Ratings
- `/api/ratings/errands/:id/rate`, `/api/ratings/users/:id`
- `/api/ratings/my-ratings`, `/api/ratings/check/:errandId`

### Fees
- `/api/fees/errands/:id/calculate`, `/api/fees/errands/:id`
- `/api/fees/summary`

### Chat
- `/api/chat/conversations`, `/api/chat/conversations/:id/messages`

## 💰 Payment Flow (Escrow System)

1. **Create Errand** → Status: "open"
2. **Apply to Errand** → Check balance → Hold funds in escrow → Status: "assigned"
3. **Complete Errand** → Release funds to errander → Status: "completed"
4. **Cancel Errand** → Refund held funds → Status: "cancelled"

## 🎯 Tier System

| Tier   | Daily Fee | Requirements              |
|--------|-----------|---------------------------|
| Bronze | 10%       | Default                   |
| Silver | 8%        | 10+ errands, 4.0+ rating  |
| Gold   | 5%        | 50+ errands, 4.5+ rating  |

**Auto-promotion via database triggers**

## 🧪 Quick Test

```bash
# Health check
curl http://localhost:3000/health

# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","full_name":"Test","role":"both"}'

# Get wallet
curl http://localhost:3000/api/payments/wallet \
  -H "Authorization: Bearer <token>"
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use production Supabase & Paystack keys
3. Replace mock Paystack with real integration (see `paystackService.ts`)
4. Enable rate limiting & monitoring
5. Configure CORS for your domain

## 📝 Development Notes

- Mock Paystack: All payments succeed instantly
- Database triggers: Auto-create wallet, update ratings, promote tiers
- Transaction ledger: Complete audit trail for all wallet operations
- RLS policies: Enabled on all tables for security

---

**Version:** 1.0.0 | **Status:** ✅ Complete | **Updated:** 2025-02-21
