import { Router } from 'express';
import { generateSessionContent, generateIBOSuggestions } from '../controllers/aiController';

const router = Router();

router.post('/generate-session', generateSessionContent);
router.post('/generate-ibos', generateIBOSuggestions);

export default router;