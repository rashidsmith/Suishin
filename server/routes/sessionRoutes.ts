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
import aiService from '../services/aiService.js';
import { supabaseAdmin } from '../config/supabase.js';

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

// Test AI endpoint to verify service is working
router.post('/:id/test-ai', async (req, res) => {
  try {
    console.log('[AI Test] Testing AI service...');
    
    const testParams = {
      personaContext: "Test Persona",
      topic: "Test Topic", 
      businessGoals: "Test Goals",
      aiProvider: "openai"
    };

    const result = await aiService.generateIBOs(testParams);
    
    res.json({
      success: true,
      testResult: result,
      message: "AI test completed"
    });
  } catch (error) {
    console.error('[AI Test] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// AI IBO generation endpoint
router.post('/:id/generate-ibos', async (req, res) => {
  try {
    console.log('[AI IBO Generation] Starting for session:', req.params.id);
    const { id } = req.params;
    
    // Get session data to extract generation parameters
    console.log('[AI IBO Generation] Fetching session data...');
    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !session) {
      console.log('[AI IBO Generation] Session not found:', error);
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }

    console.log('[AI IBO Generation] Session found:', session.title);

    // Parse generation parameters
    let generationParams;
    try {
      generationParams = session.generation_params 
        ? (typeof session.generation_params === 'string' 
            ? JSON.parse(session.generation_params) 
            : session.generation_params)
        : {};
    } catch (e) {
      generationParams = {};
    }

    // Use session data if generation params are incomplete
    const params = {
      personaContext: generationParams.persona_context || session.persona_id,
      topic: generationParams.topic || session.topic,
      businessGoals: generationParams.business_goals || session.business_goals,
      aiProvider: generationParams.ai_provider || 'openai'
    };

    console.log('[AI IBO Generation] Generation params:', params);

    const result = await aiService.generateIBOs(params);
    
    console.log('[AI IBO Generation] Result received:', result.success);
    
    if (result.success) {
      res.json({ 
        success: true, 
        content: result.content,
        timestamp: result.timestamp
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('[AI IBO Generation] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;