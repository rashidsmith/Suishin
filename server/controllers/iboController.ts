import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse, CreateIBOPayload } from '../types';
import { IBO } from '../../shared/types';

export const getAllIBOs = async (req: Request, res: Response) => {
  try {
    const { data: ibos, error } = await supabaseAdmin
      .from('ibos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching IBOs:', error);
      const errorResponse: ApiResponse<never> = {
        error: 'Failed to fetch IBOs',
        message: error.message,
        status: 'error'
      };
      return res.status(500).json(errorResponse);
    }

    const response: ApiResponse<IBO[]> = {
      data: ibos || [],
      message: 'IBOs retrieved successfully',
      status: 'ok'
    };
    res.json(response);
  } catch (error) {
    console.error('Error in getAllIBOs:', error);
    const errorResponse: ApiResponse<never> = {
      error: 'Failed to fetch IBOs',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
    res.status(500).json(errorResponse);
  }
};

export const getIBOById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: ibo, error } = await supabaseAdmin
      .from('ibos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        const errorResponse: ApiResponse<never> = {
          error: 'IBO not found',
          message: `IBO with id ${id} does not exist`,
          status: 'error'
        };
        return res.status(404).json(errorResponse);
      }
      
      console.error('Error fetching IBO:', error);
      const errorResponse: ApiResponse<never> = {
        error: 'Failed to fetch IBO',
        message: error.message,
        status: 'error'
      };
      return res.status(500).json(errorResponse);
    }

    const response: ApiResponse<IBO> = {
      data: ibo,
      message: 'IBO retrieved successfully',
      status: 'ok'
    };
    res.json(response);
  } catch (error) {
    console.error('Error in getIBOById:', error);
    const errorResponse: ApiResponse<never> = {
      error: 'Failed to fetch IBO',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
    res.status(500).json(errorResponse);
  }
};

export const createIBO = async (req: Request, res: Response) => {
  try {
    const { title, description }: { title: string; description?: string } = req.body;

    if (!title) {
      const errorResponse: ApiResponse<never> = {
        error: 'Missing required fields',
        message: 'Title is required',
        status: 'error'
      };
      return res.status(400).json(errorResponse);
    }

    // Start with minimal required fields - only use columns that exist
    const iboData: any = {
      title
    };

    // Test what columns are actually available by trying different combinations
    const { data: ibo, error } = await supabaseAdmin
      .from('ibos')
      .insert([iboData])
      .select()
      .single();

    if (error) {
      console.error('Error creating IBO:', error);
      const errorResponse: ApiResponse<never> = {
        error: 'Failed to create IBO',
        message: error.message,
        status: 'error'
      };
      return res.status(500).json(errorResponse);
    }

    const response: ApiResponse<IBO> = {
      data: ibo,
      message: 'IBO created successfully',
      status: 'ok'
    };
    res.status(201).json(response);
  } catch (error) {
    console.error('Error in createIBO:', error);
    const errorResponse: ApiResponse<never> = {
      error: 'Failed to create IBO',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
    res.status(500).json(errorResponse);
  }
};

export const updateIBO = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title && !description) {
      const errorResponse: ApiResponse<never> = {
        error: 'Missing update fields',
        message: 'At least one field (title or description) must be provided',
        status: 'error'
      };
      return res.status(400).json(errorResponse);
    }

    const updateData: Partial<IBO> = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const { data: ibo, error } = await supabaseAdmin
      .from('ibos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        const errorResponse: ApiResponse<never> = {
          error: 'IBO not found',
          message: `IBO with id ${id} does not exist`,
          status: 'error'
        };
        return res.status(404).json(errorResponse);
      }
      
      console.error('Error updating IBO:', error);
      const errorResponse: ApiResponse<never> = {
        error: 'Failed to update IBO',
        message: error.message,
        status: 'error'
      };
      return res.status(500).json(errorResponse);
    }

    const response: ApiResponse<IBO> = {
      data: ibo,
      message: 'IBO updated successfully',
      status: 'ok'
    };
    res.json(response);
  } catch (error) {
    console.error('Error in updateIBO:', error);
    const errorResponse: ApiResponse<never> = {
      error: 'Failed to update IBO',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
    res.status(500).json(errorResponse);
  }
};

export const deleteIBO = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('ibos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting IBO:', error);
      const errorResponse: ApiResponse<never> = {
        error: 'Failed to delete IBO',
        message: error.message,
        status: 'error'
      };
      return res.status(500).json(errorResponse);
    }

    const response: ApiResponse<{ id: string }> = {
      data: { id },
      message: 'IBO deleted successfully',
      status: 'ok'
    };
    res.json(response);
  } catch (error) {
    console.error('Error in deleteIBO:', error);
    const errorResponse: ApiResponse<never> = {
      error: 'Failed to delete IBO',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
    res.status(500).json(errorResponse);
  }
};