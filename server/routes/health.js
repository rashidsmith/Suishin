import { Router } from 'express';
import { testDatabaseConnection } from '../config/supabase.js';

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

export default router;