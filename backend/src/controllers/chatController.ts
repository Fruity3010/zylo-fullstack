import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest, ApiResponse } from '../types';

/**
 * Get all conversations for current user
 * GET /chat/conversations
 */
export const getConversations = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { data: conversations, error } = await supabase
      .from('conversation_list')
      .select('*')
      .or(`sender_id.eq.${req.user.id},errander_id.eq.${req.user.id}`)
      .order('updated_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch conversations',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Conversations retrieved successfully',
      data: { conversations }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get conversation by errand ID
 * GET /chat/conversations/errand/:errandId
 */
export const getConversationByErrand = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { errandId } = req.params;

    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('errand_id', errandId)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
        error: error.message
      });
    }

    // Verify user is part of conversation
    if (conversation.sender_id !== req.user.id && conversation.errander_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation retrieved successfully',
      data: { conversation }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get messages for a conversation
 * GET /chat/conversations/:conversationId/messages
 */
export const getMessages = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { conversationId } = req.params;
    const { limit = 50, before } = req.query;

    // Verify user is part of conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('sender_id, errander_id')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversation.sender_id !== req.user.id && conversation.errander_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation'
      });
    }

    // Get messages
    let query = supabase
      .from('messages')
      .select('*, sender:users!sender_id(id, full_name, avatar_url)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (before) {
      query = query.lt('created_at', before as string);
    }

    const { data: messages, error } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch messages',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Messages retrieved successfully',
      data: { messages: messages.reverse() }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Send a message
 * POST /chat/conversations/:conversationId/messages
 */
export const sendMessage = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { conversationId } = req.params;
    const { content, message_type = 'text', image_url } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Verify user is part of conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('sender_id, errander_id')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversation.sender_id !== req.user.id && conversation.errander_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this conversation'
      });
    }

    // Create message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: req.user.id,
        content,
        message_type,
        image_url: image_url || null,
        is_read: false
      })
      .select('*, sender:users!sender_id(id, full_name, avatar_url)')
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send message',
        error: error.message
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Mark messages as read
 * PATCH /chat/conversations/:conversationId/read
 */
export const markMessagesAsRead = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { conversationId } = req.params;

    // Verify user is part of conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('sender_id, errander_id')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversation.sender_id !== req.user.id && conversation.errander_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Mark all messages from other user as read
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', req.user.id)
      .eq('is_read', false);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to mark messages as read',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Upload image to Supabase Storage
 * POST /chat/upload-image
 */
export const uploadImage = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // This endpoint expects the image to be sent as base64 or file upload
    // For now, we'll return instructions for client-side upload
    // Client should upload directly to Supabase Storage from React Native

    return res.status(200).json({
      success: true,
      message: 'Use client-side upload to Supabase Storage',
      data: {
        bucket: 'chat-images',
        instructions: 'Upload directly from React Native using Supabase client'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
