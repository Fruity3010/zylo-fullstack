-- Zylo Chat System Database Schema
-- Run this SQL in your Supabase SQL Editor (AFTER running the main schema)

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  errand_id UUID NOT NULL REFERENCES errands(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  errander_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(errand_id) -- One conversation per errand
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  content TEXT NOT NULL,
  image_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_errand_id ON conversations(errand_id);
CREATE INDEX IF NOT EXISTS idx_conversations_sender_id ON conversations(sender_id);
CREATE INDEX IF NOT EXISTS idx_conversations_errander_id ON conversations(errander_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read) WHERE is_read = FALSE;

-- Trigger to update conversation when new message is sent
CREATE OR REPLACE FUNCTION update_conversation_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET
    last_message = NEW.content,
    last_message_at = NEW.created_at,
    updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_new_message();

-- Apply updated_at trigger to conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations table

-- Users can view conversations they're part of
CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR
    auth.uid() = errander_id
  );

-- System creates conversations when errand is assigned
CREATE POLICY "System can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id OR
    auth.uid() = errander_id
  );

-- Users can update their own conversations (mark as read, etc)
CREATE POLICY "Users can update their conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = sender_id OR
    auth.uid() = errander_id
  )
  WITH CHECK (
    auth.uid() = sender_id OR
    auth.uid() = errander_id
  );

-- RLS Policies for messages table

-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (sender_id = auth.uid() OR errander_id = auth.uid())
    )
  );

-- Users can send messages in their conversations
CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (sender_id = auth.uid() OR errander_id = auth.uid())
    )
  );

-- Users can update their own messages (mark as read)
CREATE POLICY "Users can update messages in their conversations"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (sender_id = auth.uid() OR errander_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (sender_id = auth.uid() OR errander_id = auth.uid())
    )
  );

-- Create view for conversation list with unread counts
CREATE OR REPLACE VIEW conversation_list AS
SELECT
  c.id,
  c.errand_id,
  c.sender_id,
  c.errander_id,
  c.last_message,
  c.last_message_at,
  c.created_at,
  c.updated_at,
  e.title as errand_title,
  e.status as errand_status,
  sender.full_name as sender_name,
  sender.avatar_url as sender_avatar,
  errander.full_name as errander_name,
  errander.avatar_url as errander_avatar,
  (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.is_read = FALSE) as unread_count
FROM conversations c
LEFT JOIN errands e ON c.errand_id = e.id
LEFT JOIN users sender ON c.sender_id = sender.id
LEFT JOIN users errander ON c.errander_id = errander.id;

-- Grant access to the view
GRANT SELECT ON conversation_list TO authenticated;

-- Function to auto-create conversation when errand is assigned
CREATE OR REPLACE FUNCTION create_conversation_on_errand_assigned()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create conversation when errander is assigned (status changes to 'assigned')
  IF NEW.errander_id IS NOT NULL AND NEW.status = 'assigned' AND
     (OLD.errander_id IS NULL OR OLD.status != 'assigned') THEN

    -- Insert conversation if it doesn't exist
    INSERT INTO conversations (errand_id, sender_id, errander_id)
    VALUES (NEW.id, NEW.sender_id, NEW.errander_id)
    ON CONFLICT (errand_id) DO NOTHING;

    -- Insert system message
    INSERT INTO messages (
      conversation_id,
      sender_id,
      message_type,
      content
    )
    VALUES (
      (SELECT id FROM conversations WHERE errand_id = NEW.id),
      NEW.sender_id,
      'system',
      'Conversation started. The errander has been assigned to your errand.'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create conversation when errand is assigned
DROP TRIGGER IF EXISTS trigger_create_conversation_on_errand_assigned ON errands;
CREATE TRIGGER trigger_create_conversation_on_errand_assigned
  AFTER UPDATE ON errands
  FOR EACH ROW
  EXECUTE FUNCTION create_conversation_on_errand_assigned();

-- Enable Realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Chat system schema created successfully!';
  RAISE NOTICE 'Realtime enabled for messages and conversations tables.';
END $$;
