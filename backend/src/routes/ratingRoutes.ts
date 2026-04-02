import express from 'express';
import { RatingController } from '../controllers/ratingController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Rate an errand
router.post('/errands/:id/rate', authenticateUser, RatingController.createRating);

// Get ratings for a specific user
router.get('/users/:id', authenticateUser, RatingController.getUserRatings);

// Get my given ratings
router.get('/my-ratings', authenticateUser, RatingController.getMyGivenRatings);

// Get ratings for a specific errand
router.get('/errands/:id', authenticateUser, RatingController.getErrandRatings);

// Check if user has rated an errand
router.get('/check/:errandId', authenticateUser, RatingController.checkRatingStatus);

export default router;
