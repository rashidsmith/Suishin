import { Router } from 'express';
import {
  createObservableBehavior,
  getObservableBehaviorsByPM,
  updateObservableBehavior,
  deleteObservableBehavior
} from '../controllers/observableBehaviorController';

const router = Router();

router.post('/', createObservableBehavior);
router.get('/pm/:pmId', getObservableBehaviorsByPM);
router.put('/:id', updateObservableBehavior);
router.delete('/:id', deleteObservableBehavior);

export default router;