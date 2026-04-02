import { Router } from 'express';
import { signup, login, logout, getCurrentUser } from '../controllers/authController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.post('/logout', authenticateUser, logout);
router.get('/me', authenticateUser, getCurrentUser);

export default router;
