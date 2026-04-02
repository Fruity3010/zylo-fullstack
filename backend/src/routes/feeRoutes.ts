import express from 'express';
import { FeeController } from '../controllers/feeController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Calculate fees for an errand
router.post('/errands/:id/calculate', authenticateUser, FeeController.calculateErrandFees);

// Get daily fee breakdown for an errand
router.get('/errands/:id', authenticateUser, FeeController.getErrandFees);

// Accrue daily fee (admin/automated)
router.post('/errands/:id/accrue', authenticateUser, FeeController.accrueDailyFee);

// Get fee summary for user's errands
router.get('/summary', authenticateUser, FeeController.getUserFeeSummary);

export default router;
