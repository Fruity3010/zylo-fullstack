import express from 'express';
import { OfferController } from '../controllers/offerController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Create an offer on an errand
router.post('/errands/:id/offers', authenticateUser, OfferController.createOffer);

// Get all offers for an errand
router.get('/errands/:id/offers', authenticateUser, OfferController.getErrandOffers);

// Get my offers
router.get('/my-offers', authenticateUser, OfferController.getMyOffers);

// Accept an offer (sender only)
router.patch('/:id/accept', authenticateUser, OfferController.acceptOffer);

// Reject an offer (sender only)
router.patch('/:id/reject', authenticateUser, OfferController.rejectOffer);

// Withdraw an offer (errander only)
router.delete('/:id', authenticateUser, OfferController.withdrawOffer);

export default router;
