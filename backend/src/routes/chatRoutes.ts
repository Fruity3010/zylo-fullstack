import { Router } from 'express';
import {
  getConversations,
  getConversationByErrand,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  uploadImage
} from '../controllers/chatController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// All chat routes require authentication
router.use(authenticateUser);

// Conversations
router.get('/conversations', getConversations);
router.get('/conversations/errand/:errandId', getConversationByErrand);

// Messages
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);
router.patch('/conversations/:conversationId/read', markMessagesAsRead);

// Image upload
router.post('/upload-image', uploadImage);

export default router;
