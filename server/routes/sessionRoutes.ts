import { Router } from 'express';
import {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  updateSessionCard,
  updateSessionProgress
} from '../controllers/sessionController.js';

const router = Router();

// Session CRUD routes
router.get('/', getAllSessions);
router.get('/:id', getSessionById);
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

// Session progress tracking
router.put('/:id/progress', updateSessionProgress);

// Session card relationship routes
router.put('/:sessionId/cards/:cardId', updateSessionCard);

export default router;