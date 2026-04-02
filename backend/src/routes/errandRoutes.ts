import { Router } from 'express';
import {
  createErrand,
  getErrands,
  getErrandById,
  updateErrand,
  deleteErrand,
  applyToErrand,
  completeErrand,
  cancelErrand
} from '../controllers/errandController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// All errand routes require authentication
router.use(authenticateUser);

router.post('/', createErrand);
router.get('/', getErrands);
router.get('/:id', getErrandById);
router.patch('/:id', updateErrand);
router.delete('/:id', deleteErrand);
router.post('/:id/apply', applyToErrand);
router.post('/:id/complete', completeErrand);
router.post('/:id/cancel', cancelErrand);

export default router;
