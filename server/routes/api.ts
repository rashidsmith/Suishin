import { Router } from 'express';
import { getUsers, createUser } from '../controllers/userController';
import healthRouter from './health.js';

const router = Router();

// Health check routes
router.use('/health', healthRouter);

// User routes
router.get('/users', getUsers);
router.post('/users', createUser);

export default router;