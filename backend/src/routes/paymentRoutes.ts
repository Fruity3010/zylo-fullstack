import express from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Get wallet balance and info
router.get('/wallet', authenticateUser, PaymentController.getWallet);

// Initialize payment (deposit to wallet)
router.post('/initialize', authenticateUser, PaymentController.initializePayment);

// Verify payment
router.post('/verify/:reference', authenticateUser, PaymentController.verifyPayment);

// Paystack webhook (no auth required)
router.post('/webhook', PaymentController.handleWebhook);

// Get transaction history
router.get('/transactions', authenticateUser, PaymentController.getTransactions);

// Request payout/withdrawal
router.post('/withdraw', authenticateUser, PaymentController.requestPayout);

// Get payout history
router.get('/payouts', authenticateUser, PaymentController.getPayouts);

// Get list of banks
router.get('/banks', authenticateUser, PaymentController.getBanks);

export default router;
