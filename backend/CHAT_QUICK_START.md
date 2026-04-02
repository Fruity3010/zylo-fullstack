# Chat System - Quick Start Guide

Get real-time chat working in 10 minutes!

---

## Prerequisites

- ✅ Backend server running
- ✅ Supabase project created
- ✅ Main database schema already installed

---

## 3-Step Setup

### Step 1: Run Chat Schema (3 min)

1. Open Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy contents from `backend/supabase-chat-schema.sql`
4. Paste and click **Run**

Expected: ✅ "Chat system schema created successfully!"

### Step 2: Create Storage Bucket (2 min)

**Option A - Dashboard (easier)**:
1. Supabase Dashboard → **Storage**
2. Click **Create bucket**
3. Name: `chat-images`
4. Set to **Public**
5. Click **Create**

**Option B - SQL**:
1. SQL Editor → New Query
2. Copy from `backend/supabase-storage-setup.sql`
3. Run

### Step 3: Enable Realtime (2 min)

1. Supabase Dashboard → **Database** → **Replication**
2. Find `messages` table → Toggle **ON**
3. Find `conversations` table → Toggle **ON**

### Step 4: Configure Mobile App (3 min)

Edit `services/chat.ts` (lines 5-6):

```typescript
const SUPABASE_URL = 'https://xxxxx.supabase.co'; // Your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbG...'; // Your anon key
```

Get these from: **Supabase Dashboard → Settings → API**

---

## Test It!

### 1. Test Backend

```bash
# Get conversations (should be empty initially)
curl http://localhost:3000/api/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Create Test Conversation

An errand must be **assigned** first:

```bash
# Apply to an errand (as errander)
curl -X POST http://localhost:3000/api/errands/ERRAND_ID/apply \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check if conversation was created
curl http://localhost:3000/api/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Test in Mobile App

1. Start app: `npm start`
2. Login as **Sender** (user who posted errand)
3. Navigate to **Chat** or **Conversations**
4. You should see the conversation!
5. Send a message
6. Login on another device as **Errander**
7. Message appears instantly! ✨

---

## Add Chat to Your App

### Option 1: Standalone Chat Screens

Create these files:

```typescript
// app/chat/index.tsx - Conversations list
import ConversationsList from '../../components/Chat/ConversationsList';

export default function ChatListScreen() {
  return <ConversationsList />;
}
```

```typescript
// app/chat/[conversationId].tsx - Individual chat
import ChatScreen from '../../components/Chat/ChatScreen';

export default function ChatDetailScreen() {
  return <ChatScreen />;
}
```

### Option 2: Chat Button in Errand Detail

```typescript
// In your errand detail screen
import { getConversationByErrand } from '../../services/chat';
import { useRouter } from 'expo-router';

const handleOpenChat = async () => {
  const response = await getConversationByErrand(errandId);

  if (response.success && response.data) {
    router.push(`/chat/${response.data.conversation.id}`);
  } else {
    Alert.alert('Chat not available yet');
  }
};

// Add button
<TouchableOpacity onPress={handleOpenChat}>
  <Text>💬 Open Chat</Text>
</TouchableOpacity>
```

---

## Features

✅ **Real-time messaging** - Messages appear instantly
✅ **Image sharing** - Camera or gallery
✅ **Unread badges** - See new message count
✅ **Auto-created** - Conversations start when errand is assigned
✅ **Secure** - Row Level Security enforced
✅ **Offline support** - Messages cached locally

---

## File Locations

| Component | Path |
|-----------|------|
| Chat service | `services/chat.ts` |
| Chat screen | `components/Chat/ChatScreen.tsx` |
| Conversations list | `components/Chat/ConversationsList.tsx` |
| Database schema | `backend/supabase-chat-schema.sql` |
| Storage setup | `backend/supabase-storage-setup.sql` |
| Backend routes | `backend/src/routes/chatRoutes.ts` |
| Backend controller | `backend/src/controllers/chatController.ts` |

---

## Troubleshooting

### "Messages not appearing in real-time"

✅ Check: Database → Replication → `messages` table is **enabled**

### "Image upload fails"

✅ Check: Storage → `chat-images` bucket exists and is **Public**

### "Conversation not found"

✅ Check: Errand status is **"assigned"** (not "open")

---

## Next Steps

- Read full guide: `CHAT_SYSTEM_GUIDE.md`
- Add push notifications (future feature)
- Customize chat UI colors
- Add message reactions

---

**That's it! Your chat system is ready!** 🎉

For detailed docs, see `CHAT_SYSTEM_GUIDE.md`
