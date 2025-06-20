import { Router, Request, Response } from 'express';
import {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  updateSessionCard,
  updateSessionProgress
} from '../controllers/sessionController.js';
// @ts-ignore
import aiService from '../services/aiService.js';
// @ts-ignore
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

// AI IBO generation endpoint - place before generic :id route
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

// IBO refinement endpoint
router.post('/:id/refine-ibos', async (req, res) => {
  try {
    console.log('[AI IBO Refinement] Starting for session:', req.params.id);
    const { id } = req.params;
    const { currentContent, refinementRequest } = req.body;

    if (!currentContent || !refinementRequest) {
      return res.status(400).json({ 
        success: false, 
        error: 'Current content and refinement request are required' 
      });
    }

    // Get session data to extract generation parameters
    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !session) {
      console.log('[AI IBO Refinement] Session not found:', error);
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }

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

    console.log('[AI IBO Refinement] Refinement request:', refinementRequest);

    const result = await aiService.refineIBOs(currentContent, refinementRequest, params);
    
    console.log('[AI IBO Refinement] Result received:', result.success);
    
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
    console.error('[AI IBO Refinement] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Generate 4C activities endpoint
router.post('/sessions/:id/generate-4c', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { iboContent } = req.body;

    if (!iboContent) {
      return res.status(400).json({ 
        success: false, 
        error: 'IBO content is required. Please generate IBOs first.' 
      });
    }

    // Get session with persona details using Supabase
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select(`
        *,
        personas (
          name,
          description,
          context,
          experience,
          motivations,
          constraints
        )
      `)
      .eq('id', sessionId)
      .single();
    
    if (sessionError || !sessionData) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    const persona = sessionData.personas;
    const personaDescription = `${persona.name}: ${persona.description}. Context: ${persona.context}. Experience: ${persona.experience}. Motivations: ${persona.motivations}. Constraints: ${persona.constraints}`;

    console.log('[API] Generating 4C activities for session:', sessionId);
    
    const result = await aiService.generate4CActivities(
      iboContent,
      personaDescription,
      sessionData.modality,
      sessionData.topic,
      sessionData.business_goals
    );
    
    if (result.success) {
      console.log('[API] 4C generation successful');
      res.json({ success: true, content: result.content });
    } else {
      console.error('[API] 4C generation failed:', result.error);
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('[API] 4C generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;