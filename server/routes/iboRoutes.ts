import { Router } from 'express';
import {
  getAllIBOs,
  getIBOById,
  createIBO,
  updateIBO,
  deleteIBO
} from '../controllers/iboController';

const router = Router();

// GET /api/ibos - Get all IBOs
router.get('/', getAllIBOs);

// GET /api/ibos/:id - Get IBO by ID
router.get('/:id', getIBOById);

// POST /api/ibos - Create new IBO
router.post('/', createIBO);

// PUT /api/ibos/:id - Update IBO
router.put('/:id', updateIBO);

// DELETE /api/ibos/:id - Delete IBO
router.delete('/:id', deleteIBO);

export default router;