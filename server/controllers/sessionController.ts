import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export const getAllSessions = async (req: Request, res: Response) => {
  try {
    const { personaId, modality, topic, status } = req.query;
    
    let query = supabaseAdmin
      .from('sessions')
      .select(`
        *,
        personas!inner(
          id,
          name,
          description
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (personaId && personaId !== 'all') {
      query = query.eq('persona_id', personaId);
    }
    if (modality && modality !== 'all') {
      query = query.eq('modality', modality);
    }
    if (topic) {
      query = query.ilike('topic', `%${topic}%`);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return res.status(500).json({
        error: 'Failed to fetch sessions',
        message: error.message,
        status: 'error'
      });
    }

    res.status(200).json({
      data: sessions || [],
      message: 'Sessions retrieved successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error fetching sessions:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};

export const getSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Session not found',
          message: `Session with id ${id} does not exist`,
          status: 'error'
        });
      }
      console.error('Error fetching session:', error);
      return res.status(500).json({
        error: 'Failed to fetch session',
        message: error.message,
        status: 'error'
      });
    }

    res.status(200).json({
      data: session,
      message: 'Session retrieved successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error fetching session:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};

export const createSession = async (req: Request, res: Response) => {
  try {
    const { user_id, learning_objective_id, title, persona_id, topic, modality, business_goals, card_ids } = req.body;

    if (!user_id || !learning_objective_id || !title || !modality) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'user_id, learning_objective_id, title, and modality are required',
        status: 'error'
      });
    }

    // Validate modality
    if (!['onsite', 'virtual', 'hybrid'].includes(modality)) {
      return res.status(400).json({
        error: 'Invalid modality',
        message: 'modality must be one of: onsite, virtual, hybrid',
        status: 'error'
      });
    }

    // Create the session first
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .insert({
        user_id,
        learning_objective_id,
        title,
        persona_id: persona_id || 'temp-placeholder',
        topic: topic || '',
        modality,
        business_goals: business_goals || '',
        status: 'not_started'
      })
      .select('*')
      .single();

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return res.status(500).json({
        error: 'Failed to create session',
        message: sessionError.message,
        status: 'error'
      });
    }

    // If there are card_ids, create session-card relationships
    let sessionCards = [];
    if (card_ids && card_ids.length > 0) {
      const sessionCardsData = card_ids.map((card_id: string, index: number) => ({
        session_id: session.id,
        card_id,
        order_index: index,
        is_completed: false
      }));

      const { data: createdSessionCards, error: sessionCardsError } = await supabaseAdmin
        .from('session_cards')
        .insert(sessionCardsData)
        .select(`
          *,
          cards (
            id,
            title,
            description,
            target_duration,
            activities (
              id,
              title,
              description,
              type,
              duration,
              order_index
            )
          )
        `);

      if (sessionCardsError) {
        console.error('Error creating session cards:', sessionCardsError);
        // Don't fail the whole request, just log the error
      } else {
        sessionCards = createdSessionCards || [];
      }
    }

    const response = {
      ...session,
      session_cards: sessionCards
    };

    res.status(201).json({
      data: response,
      message: 'Session created successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error creating session:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};

export const updateSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, persona_id, topic, modality, business_goals, status, started_at, completed_at, card_ids } = req.body;

    // Validate modality if provided
    if (modality && !['onsite', 'virtual', 'hybrid'].includes(modality)) {
      return res.status(400).json({
        error: 'Invalid modality',
        message: 'modality must be one of: onsite, virtual, hybrid',
        status: 'error'
      });
    }

    // Update the session
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (title !== undefined) updateData.title = title;
    if (persona_id !== undefined) updateData.persona_id = persona_id;
    if (topic !== undefined) updateData.topic = topic;
    if (modality !== undefined) updateData.modality = modality;
    if (business_goals !== undefined) updateData.business_goals = business_goals;
    if (status !== undefined) updateData.status = status;
    if (started_at !== undefined) updateData.started_at = started_at;
    if (completed_at !== undefined) updateData.completed_at = completed_at;

    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        personas!inner(
          id,
          name,
          description
        )
      `)
      .single();

    if (sessionError) {
      console.error('Error updating session:', sessionError);
      return res.status(500).json({
        error: 'Failed to update session',
        message: sessionError.message,
        status: 'error'
      });
    }

    // Handle session cards update if provided
    let updatedSessionCards = [];
    if (card_ids) {
      // Delete existing session cards
      await supabaseAdmin
        .from('session_cards')
        .delete()
        .eq('session_id', id);

      // Create new session cards if provided
      if (card_ids.length > 0) {
        const sessionCardsData = card_ids.map((card_id: string, index: number) => ({
          session_id: id,
          card_id,
          order_index: index,
          is_completed: false
        }));

        const { data: createdSessionCards, error: sessionCardsError } = await supabaseAdmin
          .from('session_cards')
          .insert(sessionCardsData)
          .select(`
            *,
            cards (
              id,
              title,
              description,
              target_duration,
              activities (
                id,
                title,
                description,
                type,
                duration,
                order_index
              )
            )
          `);

        if (sessionCardsError) {
          console.error('Error updating session cards:', sessionCardsError);
        } else {
          updatedSessionCards = createdSessionCards || [];
        }
      }
    }

    const response = {
      ...session,
      session_cards: updatedSessionCards
    };

    res.status(200).json({
      data: response,
      message: 'Session updated successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error updating session:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete session (cascade will handle session_cards)
    const { error } = await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting session:', error);
      return res.status(500).json({
        error: 'Failed to delete session',
        message: error.message,
        status: 'error'
      });
    }

    res.status(200).json({
      message: 'Session deleted successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error deleting session:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};

export const updateSessionProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { current_step, completed_steps, generation_params } = req.body;

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (current_step !== undefined) {
      updateData.current_step = current_step;
    }

    if (completed_steps !== undefined) {
      updateData.completed_steps = JSON.stringify(completed_steps);
    }

    if (generation_params !== undefined) {
      updateData.generation_params = JSON.stringify(generation_params);
    }

    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating session progress:', error);
      return res.status(500).json({
        error: 'Failed to update session progress',
        message: error.message,
        status: 'error'
      });
    }

    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        status: 'error'
      });
    }

    res.status(200).json({
      data: session,
      message: 'Session progress updated successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error updating session progress:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};

export const updateSessionCard = async (req: Request, res: Response) => {
  try {
    const { sessionId, cardId } = req.params;
    const { response_data, is_completed, viewed_at } = req.body;

    const { data: sessionCard, error } = await supabaseAdmin
      .from('session_cards')
      .update({
        response_data,
        is_completed,
        viewed_at: viewed_at || new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .eq('card_id', cardId)
      .select()
      .single();

    if (error) {
      console.error('Error updating session card:', error);
      return res.status(500).json({
        error: 'Failed to update session card',
        message: error.message,
        status: 'error'
      });
    }

    res.status(200).json({
      data: sessionCard,
      message: 'Session card updated successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error updating session card:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};