# Zylo Backend - Quick Start

Get your backend running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier is fine)

---

## Setup Steps

### 1. Create Supabase Project (5 min)

1. Go to https://supabase.com and sign up
2. Create new project (wait ~2 min for provisioning)
3. Copy credentials from Settings > API:
   - Project URL
   - `anon` key
   - `service_role` key

### 2. Run Database Schema (1 min)

1. In Supabase: SQL Editor > New Query
2. Copy contents from `supabase-schema.sql`
3. Paste and click Run

### 3. Configure Backend (2 min)

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

### 4. Start Server (2 min)

```bash
npm install
npm run dev
```

Server runs on http://localhost:3000

### 5. Test It (1 min)

```bash
curl http://localhost:3000/health
```

Expected: `{"success":true,"message":"Zylo API is running"...}`

---

## That's It!

✅ Your backend is running!

### Next:

- **Test API**: See `README.md` for curl examples
- **Integrate with App**: See `../INTEGRATION_EXAMPLES.md`
- **Full Setup Guide**: See `../BACKEND_SETUP.md`

### Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
```

### Troubleshooting

**Can't connect?**
- Check `.env` has all values filled
- Verify Supabase project is active
- Restart server after editing `.env`

**Database errors?**
- Make sure you ran `supabase-schema.sql`
- Check Supabase Table Editor shows `users` and `errands` tables

---

**Need help?** Check the full documentation in `README.md`
