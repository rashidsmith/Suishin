import { Router } from 'express';
import {
  createPerformanceMetric,
  getPerformanceMetricsByIBO,
  updatePerformanceMetric,
  deletePerformanceMetric
} from '../controllers/performanceMetricController';

const router = Router();

router.post('/', createPerformanceMetric);
router.get('/ibo/:iboId', getPerformanceMetricsByIBO);
router.put('/:id', updatePerformanceMetric);
router.delete('/:id', deletePerformanceMetric);

export default router;