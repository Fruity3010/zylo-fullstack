# Zylo Chat System - Complete Guide

Real-time chat system for Zylo errands with image support using Supabase Realtime.

---

## Overview

The chat system allows **senders** and **erranders** to communicate once an errand is assigned. Features include:

- ✅ Real-time messaging using Supabase Realtime
- ✅ Image/photo sharing
- ✅ Unread message indicators
- ✅ Auto-created conversations when errand is assigned
- ✅ Message read receipts
- ✅ System messages for important events

---

## How It Works

### 1. Conversation Creation

Conversations are **automatically created** when an errander is assigned to an errand:

```
Sender posts errand → Errander applies → Errand status: "assigned"
                                              ↓
                              Conversation auto-created
                                              ↓
                          System message: "Conversation started..."
```

### 2. Message Flow

```
User types message → Sent to backend → Saved to database
                                              ↓
                         Supabase Realtime broadcasts to all participants
                                              ↓
                              Other user receives instantly
```

---

## Setup Instructions

### Step 1: Run Chat Database Schema

1. Go to your Supabase Dashboard
2. Open **SQL Editor**
3. Copy contents from `backend/supabase-chat-schema.sql`
4. Paste and click **Run**

This creates:
- `conversations` table
- `messages` table
- Triggers for auto-conversation creation
- Realtime subscriptions
- Row Level Security policies

### Step 2: Set Up Storage Bucket

**Option A: Using Dashboard (Recommended)**

1. Go to Supabase Dashboard → **Storage**
2. Click **Create bucket**
3. Name: `chat-images`
4. Make it **Public**
5. Click **Create**

**Option B: Using SQL**

1. Open **SQL Editor**
2. Copy contents from `backend/supabase-storage-setup.sql`
3. Paste and run

### Step 3: Configure Supabase Credentials in Mobile App

Edit `services/chat.ts` and add your Supabase credentials:

```typescript
const SUPABASE_URL = 'https://xxxxx.supabase.co'; // Your project URL
const SUPABASE_ANON_KEY = 'eyJhbG...'; // Your anon key
```

**Better approach**: Create environment config file:

```typescript
// config/supabase.ts
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
```

Then in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### Step 4: Enable Realtime in Supabase

1. Go to **Database** → **Replication**
2. Find `messages` table
3. Click toggle to enable
4. Repeat for `conversations` table

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/conversations` | Get all user's conversations |
| GET | `/api/chat/conversations/errand/:errandId` | Get conversation for specific errand |
| GET | `/api/chat/conversations/:id/messages` | Get messages (paginated) |
| POST | `/api/chat/conversations/:id/messages` | Send a message |
| PATCH | `/api/chat/conversations/:id/read` | Mark messages as read |

---

## Usage in React Native

### 1. Conversations List Screen

```typescript
// app/chat/index.tsx
import ConversationsList from '../../components/Chat/ConversationsList';

export default function ChatListScreen() {
  return <ConversationsList />;
}
```

### 2. Individual Chat Screen

```typescript
// app/chat/[conversationId].tsx
import ChatScreen from '../../components/Chat/ChatScreen';

export default function ChatDetailScreen() {
  return <ChatScreen />;
}
```

### 3. Add Chat Button to Errand Detail

```typescript
// app/errands/[id].tsx
import { useRouter } from 'expo-router';
import { getConversationByErrand } from '../../services/chat';

export default function ErrandDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleOpenChat = async () => {
    const response = await getConversationByErrand(id as string);

    if (response.success && response.data) {
      router.push(`/chat/${response.data.conversation.id}`);
    } else {
      Alert.alert('No Chat', 'Chat will be available once an errander is assigned');
    }
  };

  return (
    <View>
      {/* Errand details */}

      <TouchableOpacity onPress={handleOpenChat} style={styles.chatButton}>
        <Text>Open Chat</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 4. Send Text Message

```typescript
import { sendMessage } from '../../services/chat';

const handleSend = async () => {
  const response = await sendMessage(conversationId, messageText);

  if (response.success) {
    console.log('Message sent!');
  }
};
```

### 5. Send Image

```typescript
import { sendImageMessage, pickImage } from '../../services/chat';

const handleSendImage = async () => {
  const imageUri = await pickImage();

  if (imageUri) {
    const response = await sendImageMessage(
      conversationId,
      imageUri,
      'Check this out!'
    );
  }
};
```

### 6. Subscribe to Real-time Messages

```typescript
import { subscribeToMessages, unsubscribeFromMessages } from '../../services/chat';

const [messages, setMessages] = useState([]);
const channelRef = useRef(null);

useEffect(() => {
  // Subscribe
  channelRef.current = subscribeToMessages(conversationId, (newMessage) => {
    setMessages(prev => [...prev, newMessage]);
  });

  // Cleanup on unmount
  return () => {
    if (channelRef.current) {
      unsubscribeFromMessages(channelRef.current);
    }
  };
}, [conversationId]);
```

---

## Database Schema

### Conversations Table

```sql
conversations
├── id (UUID, primary key)
├── errand_id (UUID, foreign key → errands)
├── sender_id (UUID, foreign key → users)
├── errander_id (UUID, foreign key → users)
├── last_message (TEXT)
├── last_message_at (TIMESTAMPTZ)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

### Messages Table

```sql
messages
├── id (UUID, primary key)
├── conversation_id (UUID, foreign key → conversations)
├── sender_id (UUID, foreign key → users)
├── message_type (TEXT: 'text' | 'image' | 'system')
├── content (TEXT)
├── image_url (TEXT, nullable)
├── is_read (BOOLEAN)
└── created_at (TIMESTAMPTZ)
```

---

## Features Explained

### 1. Auto-Conversation Creation

When an errander is assigned to an errand, a database trigger automatically:
- Creates a new conversation
- Links sender and errander
- Sends a system message

**Trigger location**: `backend/supabase-chat-schema.sql:150-180`

### 2. Real-time Updates

Uses Supabase Realtime to broadcast changes:
- New messages appear instantly
- Conversation list updates when new message arrives
- No polling needed

**Implementation**: `services/chat.ts:subscribeToMessages()`

### 3. Unread Messages

- Messages have `is_read` boolean field
- Badge shows unread count
- Auto-marked as read when viewing conversation

**Mark as read**: `markMessagesAsRead(conversationId)`

### 4. Image Upload

Images are uploaded to Supabase Storage:
1. User selects/takes photo
2. Image uploaded to `chat-images/{userId}/{filename}`
3. Public URL generated
4. Message created with image URL

**Storage path**: `chat-images/{user_id}/1234567890.jpg`

### 5. Message Types

- **text**: Regular text message
- **image**: Image with optional caption
- **system**: Automated messages (gray, centered)

---

## Security

### Row Level Security (RLS)

Users can only:
- View conversations they're part of
- Send messages in their conversations
- Upload images to their own folder
- Read messages from their conversations

**Policies defined in**: `backend/supabase-chat-schema.sql`

### Storage Security

- Images stored in user-specific folders: `{userId}/filename.jpg`
- Public bucket (anyone can view)
- Only owner can delete their images

---

## UI Components

### ChatScreen

**Location**: `components/Chat/ChatScreen.tsx`

**Features**:
- Message list with sender info
- Text input with character limit
- Image picker button
- Real-time message updates
- Auto-scroll to bottom
- Loading states

### ConversationsList

**Location**: `components/Chat/ConversationsList.tsx`

**Features**:
- List of all user conversations
- Unread message badges
- Last message preview
- Avatar display
- Pull-to-refresh
- Real-time updates

---

## Customization

### Change Colors

Edit styles in component files:

```typescript
// ChatScreen.tsx
const styles = StyleSheet.create({
  myMessage: {
    backgroundColor: '#6AFF6A', // Change sender bubble color
  },
  theirMessage: {
    backgroundColor: '#2C2C2C', // Change receiver bubble color
  },
});
```

### Add Message Reactions

1. Add `reactions` column to `messages` table (JSONB)
2. Create `addReaction()` function in `services/chat.ts`
3. Add reaction UI in `ChatScreen.tsx`

### Add Typing Indicators

1. Use Supabase Presence API
2. Broadcast typing status
3. Display "User is typing..." indicator

---

## Testing

### 1. Test Conversation Creation

```bash
# Create test errand and assign errander
curl -X PATCH http://localhost:3000/api/errands/ERRAND_ID \
  -H "Authorization: Bearer TOKEN" \
  -d '{"status": "assigned", "errander_id": "USER_ID"}'

# Check if conversation was created
curl http://localhost:3000/api/chat/conversations/errand/ERRAND_ID \
  -H "Authorization: Bearer TOKEN"
```

### 2. Test Sending Messages

```bash
curl -X POST http://localhost:3000/api/chat/conversations/CONV_ID/messages \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello!", "message_type": "text"}'
```

### 3. Test Realtime

1. Open chat screen in two different devices/simulators
2. Login as different users (sender and errander)
3. Send message from one
4. Verify it appears instantly on the other

---

## Troubleshooting

### Messages not appearing in real-time

**Solutions**:
- Check Realtime is enabled for `messages` table in Supabase
- Verify Supabase credentials in `services/chat.ts`
- Check browser console for WebSocket errors
- Ensure Row Level Security policies allow access

### Images not uploading

**Solutions**:
- Verify `chat-images` bucket exists in Storage
- Check bucket is set to **Public**
- Verify storage policies allow uploads
- Check file permissions in iOS/Android

### "Conversation not found" error

**Solutions**:
- Ensure errand status is "assigned"
- Check trigger ran successfully (view `conversations` table)
- Verify both sender and errander IDs exist

### Unread count not updating

**Solutions**:
- Call `markMessagesAsRead()` when opening conversation
- Check RLS policies allow UPDATE on messages
- Verify `is_read` field updates in database

---

## Performance Tips

### 1. Pagination

Load messages in batches:

```typescript
const [messages, setMessages] = useState([]);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const oldestMessage = messages[0];

  const response = await getMessages(
    conversationId,
    50,
    oldestMessage?.created_at
  );

  if (response.success && response.data) {
    setMessages([...response.data.messages, ...messages]);
    setHasMore(response.data.messages.length === 50);
  }
};
```

### 2. Image Compression

Compress images before upload:

```bash
npm install expo-image-manipulator
```

```typescript
import * as ImageManipulator from 'expo-image-manipulator';

const compressImage = async (uri: string) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  return result.uri;
};
```

### 3. Optimize Realtime

Only subscribe when screen is active:

```typescript
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  useCallback(() => {
    const channel = subscribeToMessages(conversationId, onNewMessage);

    return () => unsubscribeFromMessages(channel);
  }, [conversationId])
);
```

---

## Future Enhancements

### Phase 2 Features
- [ ] Voice messages
- [ ] Video calls
- [ ] Message editing/deletion
- [ ] Message reactions (❤️, 👍, 😂)
- [ ] Typing indicators
- [ ] Online/offline status
- [ ] Message search
- [ ] Archive conversations

### Phase 3 Features
- [ ] Group chats (multi-errander errands)
- [ ] Chat backup/export
- [ ] Scheduled messages
- [ ] Chat bots for FAQs
- [ ] Translation support
- [ ] Message encryption

---

## Support

**Files to check**:
- Database schema: `backend/supabase-chat-schema.sql`
- Storage setup: `backend/supabase-storage-setup.sql`
- Chat service: `services/chat.ts`
- Chat UI: `components/Chat/ChatScreen.tsx`
- Conversations list: `components/Chat/ConversationsList.tsx`
- Backend controllers: `backend/src/controllers/chatController.ts`

**Common issues**: See [Troubleshooting](#troubleshooting) section

---

**✅ Chat system is ready to use!**

Run the database migrations, configure your Supabase credentials, and start chatting!
