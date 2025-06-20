import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export const createPerformanceMetric = async (req: Request, res: Response) => {
  try {
    const { text, ibo_id, sort_order } = req.body;

    const { data, error } = await supabaseAdmin
      .from('performance_metrics')
      .insert([{
        text,
        ibo_id,
        sort_order: sort_order || 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating performance metric:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create performance metric',
        error: error.message
      });
    }

    res.status(201).json({
      status: 'ok',
      message: 'Performance metric created successfully',
      data
    });
  } catch (error) {
    console.error('Error creating performance metric:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getPerformanceMetricsByIBO = async (req: Request, res: Response) => {
  try {
    const { iboId } = req.params;

    const { data, error } = await supabaseAdmin
      .from('performance_metrics')
      .select('*')
      .eq('ibo_id', iboId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching performance metrics:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch performance metrics',
        error: error.message
      });
    }

    res.json({
      status: 'ok',
      message: 'Performance metrics retrieved successfully',
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updatePerformanceMetric = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, sort_order } = req.body;

    const { data, error } = await supabaseAdmin
      .from('performance_metrics')
      .update({ text, sort_order })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating performance metric:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update performance metric',
        error: error.message
      });
    }

    res.json({
      status: 'ok',
      message: 'Performance metric updated successfully',
      data
    });
  } catch (error) {
    console.error('Error updating performance metric:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deletePerformanceMetric = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // First delete associated observable behaviors
    await supabaseAdmin
      .from('observable_behaviors')
      .delete()
      .eq('pm_id', id);

    // Then delete the performance metric
    const { error } = await supabaseAdmin
      .from('performance_metrics')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting performance metric:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete performance metric',
        error: error.message
      });
    }

    res.json({
      status: 'ok',
      message: 'Performance metric deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting performance metric:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};