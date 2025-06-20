import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export const createObservableBehavior = async (req: Request, res: Response) => {
  try {
    const { text, pm_id, sort_order } = req.body;

    const { data, error } = await supabaseAdmin
      .from('observable_behaviors')
      .insert([{
        text,
        pm_id,
        sort_order: sort_order || 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating observable behavior:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create observable behavior',
        error: error.message
      });
    }

    res.status(201).json({
      status: 'ok',
      message: 'Observable behavior created successfully',
      data
    });
  } catch (error) {
    console.error('Error creating observable behavior:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getObservableBehaviorsByPM = async (req: Request, res: Response) => {
  try {
    const { pmId } = req.params;

    const { data, error } = await supabaseAdmin
      .from('observable_behaviors')
      .select('*')
      .eq('pm_id', pmId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching observable behaviors:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch observable behaviors',
        error: error.message
      });
    }

    res.json({
      status: 'ok',
      message: 'Observable behaviors retrieved successfully',
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching observable behaviors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateObservableBehavior = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, sort_order } = req.body;

    const { data, error } = await supabaseAdmin
      .from('observable_behaviors')
      .update({ text, sort_order })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating observable behavior:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update observable behavior',
        error: error.message
      });
    }

    res.json({
      status: 'ok',
      message: 'Observable behavior updated successfully',
      data
    });
  } catch (error) {
    console.error('Error updating observable behavior:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteObservableBehavior = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('observable_behaviors')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting observable behavior:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete observable behavior',
        error: error.message
      });
    }

    res.json({
      status: 'ok',
      message: 'Observable behavior deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting observable behavior:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};