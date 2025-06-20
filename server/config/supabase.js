import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://bxrgyldljgzqqvyzeoem.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4cmd5bGRsamd6cXF2eXplb2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzODUyMTYsImV4cCI6MjA2NTk2MTIxNn0.fMrwsNZHHWbAfu4Qf80BA494lchdflGEQCXrOfdmenk';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase environment variables, using fallback values');
}

// Server-side Supabase client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    // Test with a simple query that should work with service role
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Database connection test failed:', error.message);
      console.error('Error details:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Database connection test successful');
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('Database connection test error:', error.message);
    return { success: false, error: error.message };
  }
};