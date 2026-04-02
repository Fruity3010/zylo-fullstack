# Zylo API - Swagger Documentation Guide

## 🎯 Quick Start

### Access Swagger UI

After starting the server (`npm run dev`), access the interactive API documentation at:

- **Primary URL:** http://localhost:3000/api-docs
- **Shortcut:** http://localhost:3000/docs

## 🔐 Authentication Setup

### Step 1: Sign Up or Login

1. In Swagger UI, scroll to **Authentication** section
2. Click on `POST /api/auth/signup` or `POST /api/auth/login`
3. Click **"Try it out"** button
4. Fill in the request body:

```json
{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "Test User",
  "role": "both"
}
```

5. Click **"Execute"**
6. Copy the `access_token` from the response

### Step 2: Authorize All Requests

1. Click the **"Authorize"** button (top-right with lock icon)
2. In the popup, paste your JWT token (just the token, no "Bearer" prefix)
3. Click **"Authorize"**
4. Click **"Close"**

**Your token is now saved!** All subsequent requests will include it automatically.

## 📚 Using the Documentation

### Exploring Endpoints

The documentation is organized by tags:
- 🔐 **Authentication** - Sign up, login, logout
- 📦 **Errands** - Create, list, apply to errands
- 💰 **Payments** - Wallet operations, deposits, withdrawals
- 🤝 **Offers** - Negotiation system
- ⭐ **Ratings** - Rate users and view ratings
- 💵 **Fees** - Daily fee tracking
- 💬 **Chat** - Messaging system

### Testing an Endpoint

Example: Create an Errand

1. Click on **Errands** tag to expand
2. Click on `POST /api/errands`
3. Click **"Try it out"**
4. Edit the request body (or use the example):

```json
{
  "category": "courier_delivery",
  "title": "Deliver package to Ikeja",
  "description": "Need urgent package delivery",
  "budget": 5000,
  "destination_location": {
    "latitude": 6.6018,
    "longitude": 3.3515,
    "address": "456 Avenue, Ikeja"
  }
}
```

5. Click **"Execute"**
6. View the response below

### Understanding Responses

**Successful Response (200/201):**
```json
{
  "success": true,
  "message": "Errand created successfully",
  "data": {
    "errand": { ... }
  }
}
```

**Error Response (400/401/404/500):**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🔄 Complete Workflow Example

### 1. Create an Account
```
POST /api/auth/signup
→ Copy access_token
→ Click Authorize, paste token
```

### 2. Fund Your Wallet
```
POST /api/payments/initialize (amount: 10000)
→ Get payment reference

POST /api/payments/verify/:reference
→ Wallet credited
```

### 3. Create an Errand
```
POST /api/errands
→ Note the errand ID
```

### 4. Make a Counter-Offer (as different user)
```
POST /api/offers/errands/:id/offers
{
  "offered_price": 4500,
  "message": "I can do it for ₦4,500"
}
```

### 5. Accept Offer
```
PATCH /api/offers/:offerId/accept
→ Funds held in escrow automatically
```

### 6. Complete Errand
```
POST /api/errands/:id/complete
→ Funds released to errander
```

### 7. Rate the User
```
POST /api/ratings/errands/:id/rate
{
  "rating": 5,
  "review": "Excellent service!"
}
```

## 💡 Pro Tips

### Filter & Search
Use the filter box at the top to quickly find endpoints:
- Type "payment" to see all payment endpoints
- Type "errand" for errand-related endpoints

### Persistent Authorization
Your JWT token persists in browser storage, so you don't need to re-enter it every time you refresh.

### Expandable Schemas
Click on schema examples to see detailed type definitions:
- Click `User` to see all user properties
- Click `Errand` to see errand structure
- Click `Transaction` to see transaction types

### Download Spec
Click **"/openapi.json"** link at the top to download the OpenAPI spec for:
- Postman import
- Code generation tools
- CI/CD integration

## 🔧 Advanced Features

### Testing Escrow System

**Scenario:** Apply to errand and check wallet holds

```bash
# 1. Check initial wallet
GET /api/payments/wallet
→ Note available_balance

# 2. Apply to errand (₦5000)
POST /api/errands/:id/apply

# 3. Check wallet again
GET /api/payments/wallet
→ available_balance decreased by ₦5000
→ held_balance increased by ₦5000

# 4. Complete errand
POST /api/errands/:id/complete

# 5. Check errander's wallet
GET /api/payments/wallet (as errander)
→ available_balance increased by ₦5000
```

### Testing Negotiation Flow

```bash
# Sender creates errand with ₦5000 budget
POST /api/errands

# Errander A offers ₦4500
POST /api/offers/errands/:id/offers { "offered_price": 4500 }

# Errander B offers ₦4000
POST /api/offers/errands/:id/offers { "offered_price": 4000 }

# Sender views all offers
GET /api/offers/errands/:id/offers

# Sender accepts B's offer
PATCH /api/offers/:offerId/accept
→ Errand budget updated to ₦4000
→ A's offer auto-withdrawn
→ Funds held in escrow
```

### Testing Tier Promotion

```bash
# Create and complete 10 errands
# Rate all with 4+ stars

# Check user tier
GET /api/auth/me
→ tier should be "silver" (auto-promoted)

# View tier history
GET /api/ratings/users/:userId
→ See promotion record in statistics
```

## 📖 Schema Reference

### Common Parameters

**Errand Status:**
- `open` - Available for applications
- `assigned` - Errander assigned, funds held
- `in_progress` - Work in progress
- `completed` - Finished, payment released
- `cancelled` - Cancelled, funds refunded

**Transaction Types:**
- `deposit` - Added funds to wallet
- `withdrawal` - Removed funds
- `hold` - Moved to escrow
- `release` - Paid to errander
- `refund` - Cancelled hold
- `fee` - Platform fee
- `earning` - Received payment

**User Tiers:**
- `bronze` - Default (10% daily fee)
- `silver` - 10+ errands, 4.0+ rating (8% fee)
- `gold` - 50+ errands, 4.5+ rating (5% fee)

## 🐛 Troubleshooting

### "Unauthorized" Error
- Ensure you clicked **Authorize** and pasted your JWT token
- Check if token expired (login again to get fresh token)
- Verify token format (no "Bearer" prefix needed)

### "Forbidden" Error
- Check if you have the right role (sender/errander)
- Verify you own the resource you're trying to modify

### "Insufficient balance" Error
- Fund wallet first via `POST /api/payments/initialize`
- Check available balance via `GET /api/payments/wallet`

### "Errand not available" Error
- Errand status must be "open" to apply
- Check status via `GET /api/errands/:id`

## 📱 Mobile/Postman Integration

### Export for Postman

1. In Swagger UI, click the top link showing OpenAPI spec
2. Copy the URL or download JSON
3. In Postman: Import → Link/File → Paste URL
4. All 40 endpoints imported with examples!

### Generate API Client

Use OpenAPI Generator to create client SDKs:

```bash
# JavaScript/TypeScript
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api-docs/swagger.json \
  -g typescript-axios \
  -o ./api-client

# Swift
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api-docs/swagger.json \
  -g swift5 \
  -o ./ios-client
```

## 🚀 Production Notes

When deploying to production:

1. **Update servers in swagger.yaml:**
```yaml
servers:
  - url: https://api.zylo.app
    description: Production server
```

2. **Secure Swagger UI:**
   - Add authentication to `/api-docs` route
   - Or disable in production
   - Or make read-only

3. **Enable CORS:**
   - Allow your frontend domain
   - Update `FRONTEND_URL` in `.env`

## 📞 Support

- **Issues with docs?** Check `swagger.yaml` for typos
- **Missing endpoint?** Verify it's in `src/server.ts`
- **Schema errors?** Validate YAML at https://editor.swagger.io

---

**Swagger UI Version:** 5.0.0
**OpenAPI Version:** 3.0.3
**Last Updated:** 2026-02-21
