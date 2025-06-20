import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Client-side Supabase client with anonymous key for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Helper functions for common operations
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  getUser: async () => {
    return await supabase.auth.getUser();
  }
};

// Database helper functions
export const db = {
  // Test database connection
  testConnection: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, message: 'Database connection successful' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },
  
  // Get all tables for verification
  getTables: async () => {
    const tables = [
      'users', 'ibos', 'performance_metrics', 'observable_behaviors',
      'learning_objectives', 'cards', 'activity_blocks', 'sessions', 'session_cards'
    ];
    
    const results: Record<string, any> = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        results[table] = error ? { error: error.message } : { success: true };
      } catch (error) {
        results[table] = { error: (error as Error).message };
      }
    }
    
    return results;
  }
};