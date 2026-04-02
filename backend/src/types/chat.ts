export interface Conversation {
  id: string;
  errand_id: string;
  sender_id: string;
  errander_id: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: 'text' | 'image' | 'system';
  content: string;
  image_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationWithDetails extends Conversation {
  errand_title: string;
  errand_status: string;
  sender_name: string;
  sender_avatar?: string;
  errander_name: string;
  errander_avatar?: string;
  unread_count: number;
}
