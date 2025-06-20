import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const { data: cards, error } = await supabaseAdmin
      .from('cards')
      .select(`
        *,
        activities (
          id,
          title,
          description,
          type,
          duration,
          order_index,
          created_at,
          updated_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cards:', error);
      return res.status(500).json({
        error: 'Failed to fetch cards',
        message: error.message,
        status: 'error'
      });
    }

    res.status(200).json({
      data: cards || [],
      message: 'Cards retrieved successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error fetching cards:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};

export const getCardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: card, error } = await supabaseAdmin
      .from('cards')
      .select(`
        *,
        activities (
          id,
          title,
          description,
          type,
          duration,
          order_index,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Card not found',
          message: `Card with id ${id} does not exist`,
          status: 'error'
        });
      }
      console.error('Error fetching card:', error);
      return res.status(500).json({
        error: 'Failed to fetch card',
        message: error.message,
        status: 'error'
      });
    }

    res.status(200).json({
      data: card,
      message: 'Card retrieved successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error fetching card:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { title, description, ibo_id, learning_objective_id, target_duration, activities } = req.body;

    if (!title || !ibo_id || !learning_objective_id || !target_duration) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title, ibo_id, learning_objective_id, and target_duration are required',
        status: 'error'
      });
    }

    // Create the card first
    const { data: card, error: cardError } = await supabaseAdmin
      .from('cards')
      .insert({
        title,
        description,
        ibo_id,
        learning_objective_id,
        target_duration
      })
      .select()
      .single();

    if (cardError) {
      console.error('Error creating card:', cardError);
      return res.status(500).json({
        error: 'Failed to create card',
        message: cardError.message,
        status: 'error'
      });
    }

    // If there are activities, create them
    let createdActivities = [];
    if (activities && activities.length > 0) {
      const activitiesData = activities.map((activity: any, index: number) => ({
        card_id: card.id,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        duration: activity.duration,
        order_index: index
      }));

      const { data: activitiesResult, error: activitiesError } = await supabaseAdmin
        .from('activities')
        .insert(activitiesData)
        .select();

      if (activitiesError) {
        console.error('Error creating activities:', activitiesError);
        // Card was created but activities failed - could rollback here
        return res.status(500).json({
          error: 'Failed to create activities',
          message: activitiesError.message,
          status: 'error'
        });
      }

      createdActivities = activitiesResult || [];
    }

    const cardWithActivities = {
      ...card,
      activities: createdActivities
    };

    res.status(201).json({
      data: cardWithActivities,
      message: 'Card created successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error creating card:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};

export const updateCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, ibo_id, learning_objective_id, target_duration, activities } = req.body;

    // Update the card
    const { data: card, error: cardError } = await supabaseAdmin
      .from('cards')
      .update({
        title,
        description,
        ibo_id,
        learning_objective_id,
        target_duration,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (cardError) {
      console.error('Error updating card:', cardError);
      return res.status(500).json({
        error: 'Failed to update card',
        message: cardError.message,
        status: 'error'
      });
    }

    // Handle activities update if provided
    let updatedActivities = [];
    if (activities) {
      // Delete existing activities
      await supabaseAdmin
        .from('activities')
        .delete()
        .eq('card_id', id);

      // Create new activities
      if (activities.length > 0) {
        const activitiesData = activities.map((activity: any, index: number) => ({
          card_id: id,
          title: activity.title,
          description: activity.description,
          type: activity.type,
          duration: activity.duration,
          order_index: index
        }));

        const { data: activitiesResult, error: activitiesError } = await supabaseAdmin
          .from('activities')
          .insert(activitiesData)
          .select();

        if (activitiesError) {
          console.error('Error updating activities:', activitiesError);
          return res.status(500).json({
            error: 'Failed to update activities',
            message: activitiesError.message,
            status: 'error'
          });
        }

        updatedActivities = activitiesResult || [];
      }
    }

    const cardWithActivities = {
      ...card,
      activities: updatedActivities
    };

    res.status(200).json({
      data: cardWithActivities,
      message: 'Card updated successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error updating card:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('cards')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting card:', error);
      return res.status(500).json({
        error: 'Failed to delete card',
        message: error.message,
        status: 'error'
      });
    }

    res.status(200).json({
      data: { id },
      message: 'Card deleted successfully',
      status: 'ok'
    });
  } catch (error) {
    console.error('Unexpected error deleting card:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      status: 'error'
    });
  }
};