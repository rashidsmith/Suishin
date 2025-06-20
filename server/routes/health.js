import { Router } from 'express';
import { testDatabaseConnection } from '../config/supabase.js';
import aiService from '../services/aiService.js';

const router = Router();

// Health check endpoint that tests database connection
router.get('/', async (req, res) => {
  try {
    // Test database connection
    const dbTest = await testDatabaseConnection();
    
    if (dbTest.success) {
      res.json({
        status: 'ok',
        database: 'connected',
        message: 'All systems operational'
      });
    } else {
      res.status(500).json({
        status: 'error',
        database: 'disconnected',
        error: dbTest.error
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message
    });
  }
});

// AI service health check endpoint
router.get('/ai', async (req, res) => {
  try {
    const openaiTest = await aiService.testConnection('openai');
    const anthropicTest = await aiService.testConnection('anthropic');
    const serviceStatus = aiService.getServiceStatus();
    
    res.json({
      status: 'ok',
      message: 'AI service health check completed',
      services: {
        openai: openaiTest,
        anthropic: anthropicTest
      },
      summary: serviceStatus
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'AI service health check failed',
      error: error.message
    });
  }
});

export default router;