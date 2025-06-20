import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export const setupDatabase = async (req: Request, res: Response) => {
  try {
    // Create cards table
    const cardsTableQuery = `
      CREATE TABLE IF NOT EXISTS cards (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          ibo_id TEXT NOT NULL,
          learning_objective_id TEXT NOT NULL,
          target_duration INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create activities table
    const activitiesTableQuery = `
      CREATE TABLE IF NOT EXISTS activities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          type TEXT NOT NULL CHECK (type IN ('C1', 'C2', 'C3', 'C4')),
          duration INTEGER NOT NULL,
          order_index INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create indexes
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_activities_card_id ON activities(card_id);',
      'CREATE INDEX IF NOT EXISTS idx_activities_order ON activities(card_id, order_index);',
      'CREATE INDEX IF NOT EXISTS idx_cards_ibo_id ON cards(ibo_id);'
    ];

    // Enable RLS and create policies
    const securityQueries = [
      'ALTER TABLE cards ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE activities ENABLE ROW LEVEL SECURITY;',
      'DROP POLICY IF EXISTS "Allow all operations on cards" ON cards;',
      'DROP POLICY IF EXISTS "Allow all operations on activities" ON activities;',
      'CREATE POLICY "Allow all operations on cards" ON cards FOR ALL USING (true);',
      'CREATE POLICY "Allow all operations on activities" ON activities FOR ALL USING (true);'
    ];

    // Execute all queries
    const queries = [
      cardsTableQuery,
      activitiesTableQuery,
      ...indexQueries,
      ...securityQueries
    ];

    for (const query of queries) {
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql: query });
      if (error) {
        console.error('Error executing query:', query, error);
        // Continue with other queries even if one fails
      }
    }

    // Alternative approach using direct SQL execution
    try {
      await supabaseAdmin.sql`
        CREATE TABLE IF NOT EXISTS cards (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT,
            ibo_id TEXT NOT NULL,
            learning_objective_id TEXT NOT NULL,
            target_duration INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      await supabaseAdmin.sql`
        CREATE TABLE IF NOT EXISTS activities (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL CHECK (type IN ('C1', 'C2', 'C3', 'C4')),
            duration INTEGER NOT NULL,
            order_index INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      res.status(200).json({
        message: 'Database tables created successfully',
        status: 'ok'
      });
    } catch (sqlError) {
      console.error('SQL execution error:', sqlError);
      res.status(500).json({
        error: 'Failed to create database tables',
        message: 'Please create the tables manually in Supabase',
        status: 'error',
        sql: {
          cards: cardsTableQuery,
          activities: activitiesTableQuery
        }
      });
    }

  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({
      error: 'Failed to setup database',
      message: 'Please create the tables manually in your Supabase dashboard',
      status: 'error'
    });
  }
};