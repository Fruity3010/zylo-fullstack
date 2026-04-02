# Zylo Backend Setup Guide

This guide will walk you through setting up the Node.js + Supabase backend for Zylo.

## Quick Start Checklist

- [ ] Create Supabase account and project
- [ ] Run database schema in Supabase
- [ ] Configure backend environment variables
- [ ] Start backend server
- [ ] Test API endpoints
- [ ] Update mobile app configuration

---

## Step 1: Create Supabase Project

### 1.1 Sign Up for Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

### 1.2 Create New Project

1. Click "New Project"
2. Fill in:
   - **Project name**: `zylo-app` (or your choice)
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing plan**: Free tier is fine for development
3. Click "Create new project"
4. Wait ~2 minutes for provisioning

### 1.3 Get API Credentials

Once your project is ready:

1. Go to **Settings** (gear icon in sidebar)
2. Click **API**
3. Copy these values (you'll need them soon):
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public: eyJhbGc...
   service_role: eyJhbGc... (click "Reveal" first)
   ```

---

## Step 2: Set Up Database

### 2.1 Open SQL Editor

1. In Supabase dashboard, click **SQL Editor** in sidebar
2. Click **New Query**

### 2.2 Run Schema

1. Open the file: `backend/supabase-schema.sql`
2. Copy all contents
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

### 2.3 Verify Tables

1. Click **Table Editor** in sidebar
2. You should see two tables:
   - `users`
   - `errands`

---

## Step 3: Configure Backend

### 3.1 Create Environment File

```bash
cd backend
cp .env.example .env
```

### 3.2 Edit .env File

Open `backend/.env` and fill in your Supabase credentials:

```env
PORT=3000
NODE_ENV=development

# Paste your Supabase values here
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

FRONTEND_URL=http://localhost:8081
```

**Important**: Keep `service_role` key secret! Never commit it to git.

---

## Step 4: Start Backend Server

### 4.1 Install Dependencies (if not done)

```bash
cd backend
npm install
```

### 4.2 Start Development Server

```bash
npm run dev
```

You should see:
```
🚀 Zylo API server running on port 3000
📍 Environment: development
🔗 Health check: http://localhost:3000/health
```

### 4.3 Test Health Endpoint

Open new terminal and run:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Zylo API is running",
  "timestamp": "2024-01-08T12:00:00.000Z"
}
```

✅ If you see this, your backend is working!

---

## Step 5: Test Authentication

### 5.1 Create Test User

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "full_name": "Test User",
    "role": "sender"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "test@example.com",
      "full_name": "Test User",
      "role": "sender"
    },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "..."
    }
  }
}
```

**Save the `access_token`** - you'll need it for testing!

### 5.2 Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

### 5.3 Verify in Supabase

1. Go to **Authentication** in Supabase dashboard
2. Click **Users**
3. You should see your test user!

---

## Step 6: Test Errand Creation

### 6.1 Create Test Errand

Replace `YOUR_TOKEN` with the access_token from signup:

```bash
curl -X POST http://localhost:3000/api/errands \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "category": "courier_delivery",
    "title": "Deliver package to downtown",
    "description": "Need urgent package delivery",
    "budget": 25.00,
    "pickup_location": {
      "latitude": 6.5244,
      "longitude": 3.3792,
      "address": "123 Main St, Lagos"
    },
    "destination_location": {
      "latitude": 6.4541,
      "longitude": 3.3947,
      "address": "456 Oak Ave, Lagos"
    }
  }'
```

### 6.2 Get All Errands

```bash
curl -X GET http://localhost:3000/api/errands \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6.3 Verify in Supabase

1. Go to **Table Editor** > **errands**
2. You should see your test errand!

---

## Step 7: Update Mobile App Configuration

### 7.1 For iOS Simulator / Android Emulator

The mobile app is already configured to use `http://localhost:3000` in development.

**No changes needed!**

### 7.2 For Physical Device Testing

If testing on a real phone:

1. Find your computer's local IP address:

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

2. Edit `services/api.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.100:3000/api' // Replace with YOUR IP
  : 'https://your-production-api.com/api';
```

3. Make sure your phone and computer are on the same WiFi network

---

## Step 8: Test in Mobile App

### 8.1 Start Mobile App

```bash
# In project root (not backend folder)
cd ..
npm start
```

### 8.2 Test Signup Flow

1. Open app on device/simulator
2. Click "Sign Up"
3. Fill in form:
   - Email: `mobile@test.com`
   - Password: `Test123!@#`
   - Full Name: `Mobile User`
   - Role: Select "Sender" or "Errander"
4. Click Sign Up

### 8.3 Check Backend Logs

In your backend terminal, you should see:
```
POST /api/auth/signup 201 - - ms
```

### 8.4 Test Errand Creation

1. Navigate to Dashboard
2. Select errand category
3. Fill in form
4. Submit

Check backend logs for:
```
POST /api/errands 201 - - ms
```

---

## Troubleshooting

### Issue: "Cannot connect to backend"

**Solutions:**
- Verify backend server is running (`npm run dev`)
- Check backend URL in `services/api.ts`
- If using physical device, ensure same WiFi network
- Check firewall isn't blocking port 3000

### Issue: "Missing Supabase environment variables"

**Solutions:**
- Verify `.env` file exists in `backend/` folder
- Check all values are filled in (no placeholders)
- Restart backend server after editing `.env`

### Issue: "Authentication required" error

**Solutions:**
- User needs to login/signup first
- Token may have expired - login again
- Check AsyncStorage has token stored

### Issue: Database errors

**Solutions:**
- Verify you ran `supabase-schema.sql`
- Check Supabase project is active (not paused)
- Check RLS policies in **Authentication** > **Policies**

### Issue: CORS errors

**Solutions:**
- Check `FRONTEND_URL` in `.env`
- Verify CORS is configured in `server.ts`

---

## Development Workflow

### Starting Work

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Mobile App
npm start
```

### Stopping Work

- Press `Ctrl + C` in both terminals
- Backend server will stop
- Mobile app will stop

### Checking Logs

**Backend logs**: Terminal running `npm run dev`

**Database**: Supabase Dashboard > Table Editor

**Auth users**: Supabase Dashboard > Authentication > Users

---

## Production Deployment

When ready for production:

### Backend Deployment Options:

1. **Railway.app** (Recommended - easiest)
2. **Render.com** (Free tier available)
3. **DigitalOcean App Platform**
4. **AWS Elastic Beanstalk**

### Steps:

1. Build backend: `npm run build`
2. Deploy `dist/` folder to hosting
3. Set production environment variables
4. Update mobile app API URL in `services/api.ts`

---

## API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/auth/signup` | No | Create user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/logout` | Yes | Logout user |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/errands` | Yes | Create errand |
| GET | `/api/errands` | Yes | List errands |
| GET | `/api/errands/:id` | Yes | Get errand |
| PATCH | `/api/errands/:id` | Yes | Update errand |
| DELETE | `/api/errands/:id` | Yes | Delete errand |
| POST | `/api/errands/:id/apply` | Yes | Apply to errand |

---

## Next Steps

Now that your backend is set up:

- [ ] Integrate login screen with API
- [ ] Connect signup flow
- [ ] Implement errand posting from mobile app
- [ ] Add errand listing screen
- [ ] Implement errander application flow
- [ ] Add user profile screen
- [ ] Implement image upload (Supabase Storage)
- [ ] Add push notifications
- [ ] Implement chat/messaging
- [ ] Add payment integration

---

## Support

If you encounter issues:

1. Check backend logs in terminal
2. Check Supabase logs in dashboard
3. Verify all environment variables
4. Review this guide step-by-step

**Backend is located in**: `backend/`
**Documentation**: `backend/README.md`
**Schema**: `backend/supabase-schema.sql`

---

**✅ Setup Complete!**

Your backend is now ready for development. Happy coding!
