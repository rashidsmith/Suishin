import { Router } from 'express';
import { getUsers, createUser } from '../controllers/userController';

const router = Router();

// User routes
router.get('/users', getUsers);
router.post('/users', createUser);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export default router;